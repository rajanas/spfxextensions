import * as msal from "@azure/msal-browser";
import { IReqObject } from "./Constants";
import { ExtensionContext } from '@microsoft/sp-extension-base';

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
    public _token:string =null;
    public _reqObject:IReqObject;
    public _itemTitle:string;
    public _context:ExtensionContext;
   

    async getaccessToken(authorityUrl: string, clientID: string, redirectURL: string, scopes: string, currentUserEmail: string) {
        const msalConfig = {
            auth: {
                authority: authorityUrl,
                clientId: clientID,
                redirectUri: redirectURL
            }
        };

        let silentRequest = {
            scopes: [scopes],
            loginHint: currentUserEmail
        };


        const msalInstance = new msal.PublicClientApplication(msalConfig);
        let resp = await msalInstance.ssoSilent(silentRequest)
        let accToken = resp.accessToken;

        this._token=accToken;
       

    }

    async decriptResponseObject(reqObject: IDecryptReqObject, accessToken: string, decryptEndPoint: string) {
        const graphConfig = {
            graphMeEndpoint: 'https://apistcld.sce.com/sce/stb/v1/cpra/decrypt'
          };
      
          let decObject={
            CPRARequestId: 1,
            keyName: "cpraSSNsce-20220721-00",
            source: "sharepoint4",
            SSN: "QHCRV/1KHcUdlDfDGXpZ9g==",
            DOB: "0bfjcI12jGeQrjXXrWgQ+Yc/LW6dF1cjXAJ0gh7flU4=",
            dependentSsn: "Z+6J1aJOwuKotbSVGKldag==",
            dependentDob: "eGlteMF784rlOo/UZajdQg5rsymmgfsO/usqtxzZY1E="
           };
      
          var headers = new Headers();  
          var bearer = "Bearer " + accessToken;            
          headers.append("Authorization", bearer);  
          headers.append("X-IBM-Client-Id", "d4d3b670ef4b617a6f7075e0f9d8d178");
          headers.append("X-IBM-Client-Secret", "ff6a8d8e5be33587a5638f8b3212633b");
          
          var options:RequestInit = {  
               method: "POST", 
              
               headers: headers,
               body:JSON.stringify(reqObject)
              
               }            
            
                fetch(graphConfig.graphMeEndpoint, options)  
                .then(function(response) {  
                     //do something with response  
                     var data  = response.json()  
                     data.then(function(userinfo){  
                        console.log("resp", userinfo)  
                     })  
                });


    }
}
