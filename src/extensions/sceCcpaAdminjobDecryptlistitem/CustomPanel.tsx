import * as React from 'react';
import { Panel, PanelType } from "office-ui-fabric-react/lib/Panel";

import { Separator } from "office-ui-fabric-react/lib/Separator";
import { PrimaryButton, DefaultButton } from "office-ui-fabric-react/lib/Button";
import panelstyles from './CustomPanel.module.scss';
import DecryptListItem from './DecryptListItem';

export interface ICustomPanelState {
    isOpen: boolean;
}


import DecryptService from './services/DecryptService';

export interface ICustomPanelProps {   
    isOpen: boolean;   
    decryptService:DecryptService
}

export class CustomPanel extends React.Component<ICustomPanelProps, ICustomPanelState> {
    constructor(props: ICustomPanelProps) {
      
        super(props);
        this.state = {
            isOpen: true
        };
    }
    public async componentWillReceiveProps(nextProps: ICustomPanelProps): Promise<void> {
        // open panel
        this.setState({
            isOpen: nextProps.isOpen,
        });
    }
    public componentDidMount(): void {
        
    }

    public render(): React.ReactElement<ICustomPanelProps> {
        return (
            <Panel isOpen={this.state.isOpen}
                type={PanelType.medium}
                isLightDismiss
                onRenderBody={this._onRenderBodyContent}
                onRenderFooter={this._onRenderFooter}
                onDismiss={this._closePanel}>
            </Panel>
        );
    }
    private _onRenderFooter = () => {
        return (
            <div className={panelstyles.customPanel}>
                <PrimaryButton text="Cancel" onClick={this._closePanel} />
            </div>
        )
    }
    private _onRenderBodyContent = () => {

        return (
            <DecryptListItem   decryptService={this.props.decryptService}/>           
        );
    }

    /**
     * Close extension panel
     */
    private _closePanel = () => {
        this.setState({ isOpen: false });
    }

}

