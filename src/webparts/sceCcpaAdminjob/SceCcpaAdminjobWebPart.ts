import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
//import { getSP } from "../../extensions/sceCcpaAdminjobDecryptlistitem/services/pnpJsConfig" 
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";

import * as strings from 'SceCcpaAdminjobWebPartStrings';
import SceCcpaAdminjob from './components/SceCcpaAdminjob';
import { ISceCcpaAdminjobProps } from './components/ISceCcpaAdminjobProps';

export interface ISceCcpaAdminjobWebPartProps {
  description: string;
  clientID:string;
  authorityUrl:string;
  redirectURL:string;
  scopes:string;
}

export default class SceCcpaAdminjobWebPart extends BaseClientSideWebPart<ISceCcpaAdminjobWebPartProps> {
 
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';

  public render(): void {
    sp.web.lists.get().then(lsts=>console.log(lsts));
    const element: React.ReactElement<ISceCcpaAdminjobProps> = React.createElement(
      SceCcpaAdminjob,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        clientID:this.properties.clientID,        
        authorityUrl:this.properties.authorityUrl,
        redirectURL:this.properties.redirectURL,
        scopes:this.properties.scopes,
        context:this.context
      

      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this._environmentMessage = this._getEnvironmentMessage();
    await super.onInit();

    sp.setup({
      spfxContext: this.context as any
    });
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
    }

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('authorityUrl', {
                  label: strings.AuthorityUrlLabel
                }),
                PropertyPaneTextField('clientID', {
                  label: strings.ClientIDLabel
                }),
                PropertyPaneTextField('redirectURL', {
                  label: strings.RedirectUrlLabel
                }),
                PropertyPaneTextField('scopes', {
                  label: strings.ScopesLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
