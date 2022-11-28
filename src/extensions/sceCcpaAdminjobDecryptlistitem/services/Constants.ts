let globalVariables = {
    authority: "https://login.microsoftonline.com/4c20a308-8b26-408c-9d08-b884a95f8b73",
    clientID: "c134bd2a-ffe5-4fea-8c87-d20de7f29754",
    redirectURL: "https://aarainternationalinc.sharepoint.com/sites/socaledison/Lists/CCPA_HR/AllItems.aspx",
    scopes: "api://c134bd2a-ffe5-4fea-8c87-d20de7f29754/users.read",

    decryptEndpoint: 'https://apistcld.sce.com/sce/stb/v1/cpra/decrypt',
    CPRARequestId: 1,
    keyName: "cpraSSNsce-20220721-00",
    source: "sharepoint4",   
    XIBM_ClientId: "d4d3b670ef4b617a6f7075e0f9d8d178",
    XIBM_ClientSecret: "ff6a8d8e5be33587a5638f8b3212633b",
    ListNames:["CPRA_CS_Requestor","CCPA_HR"]
    

}
/*
let globalVariables = {
    authority: 'https://login.microsoftonline.com/5b2a8fee-4c95-4bdc-8aae-196f8aacb1b6',
    clientID: '4ec2eeab-b7f7-4567-8746-bc03558ff2be',
    redirectURL: 'https://edisonintl.sharepoint.com/teams/CPRA_HR_Test/Lists/Forms/AllItems.aspx',
    scopes: "api://4ec2eeab-b7f7-4567-8746-bc03558ff2be/users.read",

    decryptEndpoint: 'https://apistcld.sce.com/sce/stb/v1/cpra/decrypt',
    CPRARequestId: 1,
    keyName: "cpraSSNsce-20220721-00",
    source: "sharepoint4",
    SSN: "QHCRV/1KHcUdlDfDGXpZ9g==",
    DOB: "0bfjcI12jGeQrjXXrWgQ+Yc/LW6dF1cjXAJ0gh7flU4=",
    dependentSsn: "Z+6J1aJOwuKotbSVGKldag==",
    dependentDob: "eGlteMF784rlOo/UZajdQg5rsymmgfsO/usqtxzZY1E=",
    XIBM_ClientId: "d4d3b670ef4b617a6f7075e0f9d8d178",
    XIBM_ClientSecret: "ff6a8d8e5be33587a5638f8b3212633b",
    field_ssn: "field_14",
    field_dob: "field_16",
    field_dep_ssn: "field_24",
    field_dep_dob: "field_25"
}
*/
interface IReqObject {
    CPRARequestId: number,
    keyName: string,
    source: string,
    SSN: string,
    DOB: string,
    dependentSsn: string,
    dependentDob: string
}
interface IDecryptObject{
    dependentDob: string;
    dependentSsn: string;
    dob: string;
    ssn: string;
}

export {globalVariables,IReqObject,IDecryptObject};