import * as React from 'react';
import styles from './SceCcpaAdminjob.module.scss';
import { ISceCcpaAdminjobProps } from './ISceCcpaAdminjobProps';
import { escape } from '@microsoft/sp-lodash-subset';
import * as msal from "@azure/msal-browser";
import { PrimaryButton,DefaultButton } from 'office-ui-fabric-react/lib/Button';

import { Separator } from 'office-ui-fabric-react/lib/Separator';

export default class SceCcpaAdminjob extends React.Component<ISceCcpaAdminjobProps, {accessToken:string}> {
  constructor(props: ISceCcpaAdminjobProps) {
    super(props);
    this.callMsGraph = this.callMsGraph.bind(this);
    this.state={
      accessToken:''
    }

  }
  public componentDidMount() {
  
  }
  public render(): React.ReactElement<ISceCcpaAdminjobProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      clientID,
      authorityUrl,
      redirectURL
    } = this.props;

    return (
      <section className={styles.sceCcpaAdminjob}>
        <div>
          <h3>{this.props.description}</h3>
          <Separator/>          
          <div>Client ID: {this.props.clientID}</div>
          <div>Authority URL: {this.props.authorityUrl}</div>
          <div>Redirect URL: {this.props.redirectURL}</div>
          <div>Scopes: {this.props.scopes}</div>
          <Separator/>
          <div><PrimaryButton onClick={this.callMsGraph} text='Get JWT Token'/></div>
          <div>
            {this.state.accessToken}
          </div>        
        </div>
      </section>
    );
  }


  private async callMsGraph() {
   
    this.setState({accessToken:""})
    const msalConfig = {
      auth: {
        authority:this.props.authorityUrl,
        clientId: this.props.clientID,
        redirectUri: this.props.redirectURL
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
      }
    };
    let scopes = this.props.scopes;
    let silentRequest = {
      scopes: [scopes],
      loginHint: this.props.context.pageContext.user.email
    };


    const msalInstance = new msal.PublicClientApplication(msalConfig);
    let resp = await msalInstance.ssoSilent(silentRequest)
    let accToken = resp.accessToken;

    console.log(accToken);
    this.setState({accessToken:accToken})

   // this.getGraph(accToken);


  }


  private getGraph(accessToken: any) {
    const graphConfig = {
      graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
    };
    var headers = new Headers();
    var bearer = "Bearer " + accessToken;
    headers.append("Authorization", bearer);

    let reqObject={
      CPRARequestId: 1,
      keyName: "cpraSSNsce-20220721-00",
      source: "sharepoint4",
      SSN: "QHCRV/1KHcUdlDfDGXpZ9g==",
      DOB: "0bfjcI12jGeQrjXXrWgQ+Yc/LW6dF1cjXAJ0gh7flU4=",
      dependentSsn: "Z+6J1aJOwuKotbSVGKldag==",
      dependentDob: "eGlteMF784rlOo/UZajdQg5rsymmgfsO/usqtxzZY1E="
     }
    var options:RequestInit = {
      method: "GET",
      headers: headers     
      
    };
   
    fetch(graphConfig.graphMeEndpoint, options)
      .then(function (response) {
        //do something with response  


        var data = response.json()
        data.then(function (userinfo) {
          console.log("resp", userinfo)
        })

      });


  }
}
