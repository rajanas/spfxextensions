import { Log } from '@microsoft/sp-core-library';
import { IColor } from 'office-ui-fabric-react/lib/Color';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetExecuteEventParameters,
  ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import { ExtensionContext } from '@microsoft/sp-extension-base';
import { Dialog } from '@microsoft/sp-dialog';
import { ICustomPanelProps, CustomPanel } from './CustomPanel';
import DecryptService from './services/DecryptService';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISceCcpaAdminjobDecryptlistitemCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'SceCcpaAdminjobDecryptlistitemCommandSet';

export default class SceCcpaAdminjobDecryptlistitemCommandSet extends BaseListViewCommandSet<ISceCcpaAdminjobDecryptlistitemCommandSetProperties> {
  private _panelPlaceHolder: HTMLDivElement = null;
  private  ds=new DecryptService();
  
  public  onInit(): Promise<void> {  

    this.ds._context=this.context;
    this.ds.getInternalColumns();    
    this.ds.getaccessToken(this.context.pageContext.user.email);

    Log.info(LOG_SOURCE, 'Initialized SceCcpaAdminjobDecryptlistitemCommandSet');

    // initial state of the command's visibility
        
    const compareOneCommand: Command = this.tryGetCommand('DecryptItem');
    compareOneCommand.visible = false;
    /* let viewItems=this.context.listView.rows.length;
    viewItems==1?compareOneCommand.visible = true:compareOneCommand.visible = false;
    console.log('#######################');
    console.log(viewItems);
    */
    this.context.listView.listViewStateChangedEvent.add(this, this._onListViewStateChanged);

    this._panelPlaceHolder = document.body.appendChild(document.createElement("div"));

    return Promise.resolve();
  }

  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    switch (event.itemId) {
      case 'DecryptItem':
      // this.decryptListItem(event);   
    
      this._showPanel(event,this.ds);       
        break;
      
      default:
        throw new Error('Unknown command');
    }
  }

  private _onListViewStateChanged = (args: ListViewStateChangedEventArgs): void => {
   
    Log.info(LOG_SOURCE, 'List view state changed');   

    const compareOneCommand: Command = this.tryGetCommand('DecryptItem');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
     
     compareOneCommand.visible = this.context.listView.selectedRows?.length === 1;
    }

    // TODO: Add your logic here

    // You should call this.raiseOnChage() to update the command bar
    this.raiseOnChange();
  }

  

  private _showPanel = (event:IListViewCommandSetExecuteEventParameters,decryptService:DecryptService): void => {
     let ds=this.ds;
     ds.formatReqObject(event);


    this._renderPanelComponent({    
      isOpen: true,    
      decryptService:ds
      
    });
  }

  private _renderPanelComponent = (props: ICustomPanelProps): void => {
    const element: React.ReactElement<ICustomPanelProps> = React.createElement(CustomPanel, props);
    ReactDom.render(element, this._panelPlaceHolder);
  }
}
