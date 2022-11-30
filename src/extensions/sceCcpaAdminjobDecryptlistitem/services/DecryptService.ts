import * as msal from "@azure/msal-browser";
import { IReqObject, globalVariables } from "./Constants";
import { ExtensionContext } from '@microsoft/sp-extension-base';
import {
    BaseListViewCommandSet,
    Command,
    IListViewCommandSetExecuteEventParameters,
    ListViewCommandSetContext,
    ListViewStateChangedEventArgs
} from '@microsoft/sp-listview-extensibility';


export interface IDecryptReqObject {
    CPRARequestId: number,
    keyName: string;
    source: string;
    SSN: string;
    DOB: string;
    dependentSsn: string;
    dependentDob: string;
}
export default class DecryptService {
    public _token: string = null;
    public _reqObject: IReqObject;
    public _itemTitle: string;
    public _context: ListViewCommandSetContext;
    public _columns: Map<any, any>;

    constructor(context:ListViewCommandSetContext){
        this._context=context;
    }



    async getaccessToken(currentUserEmail: string) {

        const msalConfig = {
            auth: {
                authority: globalVariables.authority,
                clientId: globalVariables.clientID,
                redirectUri: globalVariables.redirectURL
            }
        };

        let silentRequest = {
            scopes: [globalVariables.scopes],
            loginHint: currentUserEmail
        };

        const msalInstance = new msal.PublicClientApplication(msalConfig);
        let resp = await msalInstance.ssoSilent(silentRequest)
        let accToken = resp.accessToken;
        this._token = accToken;

    }

    getInternalColumns() {
        let cols = this._context.listView.columns;
        let intCol = new Map();
        cols.map(col => {
            intCol.set(col.field.displayName, col.field.internalName)
        })
        this._columns = intCol;

    }

    formatReqObject(event: IListViewCommandSetExecuteEventParameters) {
        let intCols = this._columns;
        let field_ssn = intCols.get("Last4SSN");
        let field_dob = intCols.get("DateofBirth");
        let field_dep_ssn = intCols.get("DependentLast4SSN");
        let field_dep_dob = intCols.get("DependentDateofBirth");
       
        let reqObject = {
            CPRARequestId: 1,
            keyName: "cpraSSNsce-20220721-00",
            source: "sharepoint4",
            SSN: event.selectedRows[0].getValueByName(field_ssn),
            DOB: event.selectedRows[0].getValueByName(field_dob),
            dependentSsn: event.selectedRows[0].getValueByName(field_dep_ssn),
            dependentDob: event.selectedRows[0].getValueByName(field_dep_dob)
        };
        this._itemTitle = event.selectedRows[0].getValueByName('Title');
        this._reqObject = reqObject;

        console.log("#################  reqObject  ###########3")
        console.log(reqObject)
    }

    showDecryptCommand(): boolean {
        let lstNames = globalVariables.ListNames;
        let lstTitle = this._context.listView.list.title;
        console.log(lstTitle);
        return (lstNames.indexOf(lstTitle) !== -1)


    }

}
