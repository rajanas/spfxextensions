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
import DecryptService, { IDecryptReqObject } from './services/DecryptService';

import { globalVariables, IReqObject, IDecryptObject } from './services/Constants';

export interface IDecryptListItemProps {
    decryptService: DecryptService;
}

export interface IDecryptListItemState {
    decryptObject: IDecryptObject;
    accessToken: string;
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
            decryptObject: {} as IDecryptObject,
            accessToken: ""
        }
    }

    componentDidMount(): void {

        this.getGraph();

    }
    private async getGraph() {
        let ds = this.props.decryptService;
        await ds.getaccessToken(globalVariables.authority, globalVariables.clientID, globalVariables.redirectURL,
            globalVariables.scopes, ds._context.pageContext.user.email);

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

        const fetchResult = await fetch(globalVariables.decryptEndpoint, options);

        if (fetchResult.ok) {
            const result = await fetchResult.json();
            this.setState({
                decryptObject: result,
                accessToken: ds._token
            })
        } else {
            let errordecObj: IDecryptObject = {
                dependentDob: 'Tue Aug 30 00:00:00 UTC 2022',
                dependentSsn: '2345', dob: 'Tue Aug 09 00:00:00 UTC 2022', ssn: '4532'
            };

            this.setState({
                decryptObject: errordecObj,
                accessToken: ds._token

            })

        }

        /* fetch(globalVariables.decryptEndpoint, options).then(resp => {
             resp.json().then(re => {
                 console.log(re);
                 this.setState({
                     decryptObject: re,
                     accessToken: ds._token
                 })
             });
         }); */



    }

    public render() {
        let reqObject = this.props.decryptService._reqObject;
        let respObject = this.state.decryptObject;
        return (
            <div className={panelstyles.customPanel}>
                <Separator />
                <div className={panelstyles.header}>{this.props.decryptService._itemTitle}</div>
                <Separator />
                <DecryptField fieldLabel='Last 4SSN' fieldValue={respObject.ssn} />
                <DecryptField fieldLabel='Date of Birth' fieldValue={respObject.dob} />
                <DecryptField fieldLabel='Dependent Date of Birth' fieldValue={respObject.dependentDob} />
                <DecryptField fieldLabel='Dependent Last 4SSN' fieldValue={respObject.dependentSsn} />
                <DecryptField fieldLabel='Request Object' fieldValue={JSON.stringify(reqObject)} />
                <DecryptField fieldLabel='Decrypt Response Object' fieldValue={JSON.stringify(this.state.decryptObject)} />
                <DecryptField fieldLabel='Access Token' fieldValue={this.state.accessToken} />
            </div>
        );
    }
}
