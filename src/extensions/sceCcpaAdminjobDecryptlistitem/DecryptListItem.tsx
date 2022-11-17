import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";
import { Separator } from "office-ui-fabric-react/lib/Separator";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button";
import {
    BaseListViewCommandSet,
    Command,
    IListViewCommandSetExecuteEventParameters,
    ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';
import { ExtensionContext } from '@microsoft/sp-extension-base';
import panelstyles from './CustomPanel.module.scss';
import { Label } from 'office-ui-fabric-react';
import DecryptService from './services/DecryptService';

import { globalVariables, IReqObject } from './services/Constants';

export interface IDecryptListItemProps {
    decryptService: DecryptService;
}

export interface IDecryptListItemState {
    decryptObject: IReqObject;
    accessToken:string;
}


const DecryptField = (props: { fieldLabel: string; fieldValue: string }) => (
    <div className={panelstyles.item} >
        <Label className={panelstyles.fieldLabel}>{props.fieldLabel}</Label>
        <Label>{props.fieldValue}</Label>
    </div>
);
export default class DecryptListItem extends React.Component<IDecryptListItemProps, IDecryptListItemState> {

    constructor(props: IDecryptListItemProps) {
        super(props);
        this.state = {
            decryptObject: {} as IReqObject,
            accessToken:""
        }
    }

    componentDidMount(): void {      
      
        this.getGraph();



    }
    private async  getGraph() {
       let ds=this.props.decryptService;
       await ds.getaccessToken(globalVariables.authority,globalVariables.clientID,globalVariables.redirectURL,
            globalVariables.scopes,ds._context.pageContext.user.email);
        console.log(ds._reqObject);
        console.log(ds._token);
       
        var headers = new Headers();
        var bearer = "Bearer " + ds._token;
        headers.append("Authorization", bearer);
        headers.append("X-IBM-Client-Id", globalVariables.XIBM_ClientId);
        headers.append("X-IBM-Client-Secret", globalVariables.XIBM_ClientSecret);

        var options: RequestInit = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(ds._reqObject)

        }
        this.setState({
            decryptObject:ds._reqObject,
            accessToken:ds._token
        })

        fetch(globalVariables.decryptEndpoint,options).then(resp=>{
            console.log("############ Decrypt Response #######");
            console.log(resp);
        })


    }

    public render() {
        let reqObject = this.props.decryptService._reqObject;
        return (
            <div className={panelstyles.customPanel}>
                <Separator />
                <div className={panelstyles.header}>{this.props.decryptService._itemTitle}</div>
                <Separator />
                <DecryptField fieldLabel='Last 4SSN' fieldValue={reqObject.SSN} />
                <DecryptField fieldLabel='Date of Birth' fieldValue={reqObject.DOB} />
                <DecryptField fieldLabel='Dependent Date of Birth' fieldValue={reqObject.dependentDob} />
                <DecryptField fieldLabel='Dependent Last 4SSN' fieldValue={reqObject.dependentSsn} />
                <DecryptField fieldLabel='Request Object' fieldValue={JSON.stringify(reqObject)} />
                <DecryptField fieldLabel='Decrypt Response Object' fieldValue={JSON.stringify(this.state.decryptObject)} />
                <DecryptField fieldLabel='Access Token' fieldValue={this.state.accessToken} />
            </div>
        );
    }
}
