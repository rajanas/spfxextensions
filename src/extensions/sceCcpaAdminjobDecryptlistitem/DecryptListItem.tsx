import * as React from 'react';
import { Separator } from "office-ui-fabric-react/lib/Separator";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";

import panelstyles from './CustomPanel.module.scss';
import { Label } from 'office-ui-fabric-react/lib/Label';
import DecryptService, { IDecryptReqObject } from './services/DecryptService';

import { objectDefinedNotNull, stringIsNullOrEmpty, } from "@pnp/core";

import { globalVariables, IReqObject, IDecryptObject } from './services/Constants';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { isDate, isUndefined } from 'lodash';
import { disableBodyScroll } from 'office-ui-fabric-react';

export interface IDecryptListItemProps {
    decryptService: DecryptService;
}

export interface IDecryptListItemState {
    decryptObject: IReqObject;
    accessToken: string;
    error: boolean;
}


const DecryptField = (props: { fieldLabel: string; fieldValue: string }) => {
    console.log(props.fieldValue);
    return (
       !isUndefined(props.fieldValue)? <div className={panelstyles.item} >
            <Label className={panelstyles.fieldLabel}>{props.fieldLabel}</Label>
            <Label>{props.fieldValue}</Label>
        </div>:null
    )
};
const DecryptDateField = (props: { fieldLabel: string; fieldValue: string }) => {
    console.log(props.fieldValue);
    let dt=isDate(props.fieldValue)?new Date(props.fieldValue).toLocaleDateString():props.fieldValue;
    return (
        !isUndefined(props.fieldValue)? <div className={panelstyles.item} >
            <Label className={panelstyles.fieldLabel}>{props.fieldLabel}</Label>
            <Label>{dt}</Label>
        </div>:null
    )
};

export default class DecryptListItem extends React.Component<IDecryptListItemProps, IDecryptListItemState> {

    constructor(props: IDecryptListItemProps) {
        super(props);
        this.state = {
            decryptObject: {} as IReqObject,
            accessToken: "",
            error: false
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
            const result:IDecryptObject = await fetchResult.json();
            let respObj=this.props.decryptService._reqObject;
             respObj.DOB=result.dob;
             respObj.SSN=result.ssn;
             respObj.dependentDob=result.dependentDob;
             respObj.dependentSsn=result.dependentSsn;


            this.setState({
                decryptObject: respObj,
                accessToken: ds._token
            })
        } else {
            let dt = new Date()
            let errordecObj: IReqObject = this.props.decryptService._reqObject;

            this.setState({
                decryptObject: errordecObj,
                accessToken: ds._token,
                error: true

            })

        }





    }

    public render() {
        let reqObject = this.props.decryptService._reqObject;
        let respObject = this.state.decryptObject;
        let intCols = this.props.decryptService._columns;
        let dob = respObject.DOB;
        let ssn = respObject.SSN;
        let depssn = respObject.dependentSsn;
        let depdob = respObject.dependentDob;

        console.log(this.state);
        let isLoading = isEmpty(this.state.decryptObject) ? true : false;

        return (
            <div className={panelstyles.customPanel}>
                <Separator />
                <div className={panelstyles.header}>{this.props.decryptService._itemTitle}</div>
                <Separator />
                {
                    !isLoading ? <div>
                        <DecryptField fieldLabel='Last 4SSN' fieldValue={ssn} />
                        <DecryptDateField fieldLabel='Date of Birth' fieldValue={dob} />
                        <DecryptField fieldLabel='Dependent Last 4SSN' fieldValue={depssn} />
                        <DecryptDateField fieldLabel='Dependent Date of Birth' fieldValue={depdob} />
                       {/* <DecryptField fieldLabel='Request Object' fieldValue={JSON.stringify(reqObject)} />
                        <DecryptField fieldLabel='Decrypt Response Object' fieldValue={JSON.stringify(respObject)} />
                        <DecryptField fieldLabel='Access Token' fieldValue={this.state.accessToken} /> */ }
                        <Label className={panelstyles.error} hidden={this.state.error}>** Error occurred while decrypting. Please contact administrator</Label>
                    </div> :
                        <div className={panelstyles.spinner}>
                            <Spinner size={SpinnerSize.large} />
                        </div>
                }
            </div>
        );
    }
}
