import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISceCcpaAdminjobProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  clientID:string;
  authorityUrl:string;
  redirectURL:string;
  context:WebPartContext;
  scopes:string;
}
