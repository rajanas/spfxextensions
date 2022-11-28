import * as React from 'react';
import { Separator } from "office-ui-fabric-react/lib/Separator";

import panelstyles from './CustomPanel.module.scss';
import { Label } from 'office-ui-fabric-react';
import DecryptService, { IDecryptReqObject } from './services/DecryptService';

import { objectDefinedNotNull, stringIsNullOrEmpty, } from "@pnp/core";

import { globalVariables, IReqObject, IDecryptObject } from './services/Constants';

export interface IDecryptListItemProps {
    decryptService: DecryptService;
}

export interface IDecryptListItemState {
    decryptObject: IDecryptObject;
    accessToken: string;
}


const DecryptField = (props: { fieldLabel: string; fieldValue: string }) => {
    let fieldValue = (props.fieldValue === "0000" || props.fieldValue === new Date().toLocaleDateString()
     || stringIsNullOrEmpty(props.fieldValue));

    return (
        !fieldValue?        
        <div className={panelstyles.item} >            
            <Label className={panelstyles.fieldLabel}>{props.fieldLabel}</Label>
            <Label>{props.fieldValue}</Label>
        </div>:null
    )
};
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
        await ds.getaccessToken(ds._context.pageContext.user.email);

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
            let dt = new Date()
            let errordecObj: IDecryptObject = {
                dependentDob: dt.toLocaleDateString(),
                dependentSsn: '0000',
                dob: dt.toLocaleDateString(),
                ssn: '0000'
            };

            this.setState({
                decryptObject: errordecObj,
                accessToken: ds._token

            })

        }





    }

    public render() {
        let reqObject = this.props.decryptService._reqObject;
        let respObject = this.state.decryptObject;
        let intCols = this.props.decryptService._columns;
        let dob = !objectDefinedNotNull(respObject.dob) ?  new Date().toLocaleDateString() : new Date(respObject.dob).toLocaleDateString();
        let ssn = !objectDefinedNotNull(respObject.ssn) ? "0000" : respObject.ssn;
        let depssn = !objectDefinedNotNull(respObject.dependentSsn) ? "0000" : respObject.dependentSsn;
        let depdob = !objectDefinedNotNull(respObject.dependentDob) ?  new Date().toLocaleDateString() : new Date(respObject.dependentDob).toLocaleDateString();

        return (
            <div className={panelstyles.customPanel}>
                <Separator />
                <div className={panelstyles.header}>{this.props.decryptService._itemTitle}</div>
                <Separator />
                <DecryptField fieldLabel='Last 4SSN' fieldValue={ssn} />
                <DecryptField fieldLabel='Date of Birth' fieldValue={dob} />
                <DecryptField fieldLabel='Dependent Last 4SSN' fieldValue={depssn} />
                <DecryptField fieldLabel='Dependent Date of Birth' fieldValue={depdob} />
                <DecryptField fieldLabel='Request Object' fieldValue={JSON.stringify(reqObject)} />
                <DecryptField fieldLabel='Decrypt Response Object' fieldValue={JSON.stringify(respObject)} />
                <DecryptField fieldLabel='Access Token' fieldValue={this.state.accessToken} />
            </div>
        );
    }
}
