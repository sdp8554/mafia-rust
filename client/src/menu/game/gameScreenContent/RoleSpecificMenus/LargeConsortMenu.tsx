import React from "react"
import GAME_MANAGER from "../../../.."
import translate from "../../../../game/lang"
import "./largeConsortMenu.css"
import ChatElement from "../../../../components/ChatMessage"

type LargeConsortMenuProps = {
}
type LargeConsortMenuState = {
    roleblock: boolean,

    youWereRoleblockedMessage: boolean,
    youSurvivedAttackMessage: boolean,
    youWereProtectedMessage: boolean,
    youWereTransportedMessage: boolean,
    youWerePossessedMessage: boolean,
    yourTargetWasJailedMessage: boolean
}
export default class LargeConsortMenu extends React.Component<LargeConsortMenuProps, LargeConsortMenuState> {
    listener: () => void;
    constructor(props: LargeConsortMenuState) {
        super(props);

        if(GAME_MANAGER.state.stateType === "game" && GAME_MANAGER.state.roleState?.role === "consort")
            this.state = {
                roleblock: GAME_MANAGER.state.roleState?.roleblock,
                
                youWereRoleblockedMessage: GAME_MANAGER.state.roleState?.youWereRoleblockedMessage === undefined || GAME_MANAGER.state.roleState?.youWereRoleblockedMessage === null ? false : GAME_MANAGER.state.roleState?.youWereRoleblockedMessage,
                youSurvivedAttackMessage: GAME_MANAGER.state.roleState?.youSurvivedAttackMessage === undefined || GAME_MANAGER.state.roleState?.youSurvivedAttackMessage === null ? false : GAME_MANAGER.state.roleState?.youSurvivedAttackMessage,
                youWereProtectedMessage: GAME_MANAGER.state.roleState?.youWereProtectedMessage === undefined || GAME_MANAGER.state.roleState?.youWereProtectedMessage === null ? false : GAME_MANAGER.state.roleState?.youWereProtectedMessage,
                youWereTransportedMessage: GAME_MANAGER.state.roleState?.youWereTransportedMessage === undefined || GAME_MANAGER.state.roleState?.youWereTransportedMessage === null ? false : GAME_MANAGER.state.roleState?.youWereTransportedMessage,
                youWerePossessedMessage: GAME_MANAGER.state.roleState?.youWerePossessedMessage === undefined || GAME_MANAGER.state.roleState?.youWerePossessedMessage === null ? false : GAME_MANAGER.state.roleState?.youWerePossessedMessage,
                yourTargetWasJailedMessage: GAME_MANAGER.state.roleState?.yourTargetWasJailedMessage === undefined || GAME_MANAGER.state.roleState?.yourTargetWasJailedMessage === null ? false : GAME_MANAGER.state.roleState?.yourTargetWasJailedMessage
            };
        this.listener = ()=>{
            if(GAME_MANAGER.state.stateType === "game" && GAME_MANAGER.state.roleState?.role === "consort"){
                this.setState({
                    roleblock: GAME_MANAGER.state.roleState.roleblock,
            
                    youWereRoleblockedMessage: GAME_MANAGER.state.roleState.youWereRoleblockedMessage,
                    youSurvivedAttackMessage: GAME_MANAGER.state.roleState.youSurvivedAttackMessage,
                    youWereProtectedMessage: GAME_MANAGER.state.roleState.youWereProtectedMessage,
                    youWereTransportedMessage: GAME_MANAGER.state.roleState.youWereTransportedMessage,
                    youWerePossessedMessage: GAME_MANAGER.state.roleState.youWerePossessedMessage,
                    yourTargetWasJailedMessage: GAME_MANAGER.state.roleState.yourTargetWasJailedMessage
                })
            }
        };  
    }
    componentDidMount() {
        GAME_MANAGER.addStateListener(this.listener);
    }
    componentWillUnmount() {
        GAME_MANAGER.removeStateListener(this.listener);
    }

    handleRoleblockToggle(){
        GAME_MANAGER.sendSetConsortOptions(
            !this.state.roleblock, 
            this.state.youWereRoleblockedMessage, 
            this.state.youSurvivedAttackMessage, 
            this.state.youWereProtectedMessage, 
            this.state.youWereTransportedMessage, 
            this.state.youWerePossessedMessage, 
            this.state.yourTargetWasJailedMessage
        );
    }
    handleYouWereRoleblockedMessageToggle(){
        GAME_MANAGER.sendSetConsortOptions(
            this.state.roleblock, 
            !this.state.youWereRoleblockedMessage, 
            this.state.youSurvivedAttackMessage, 
            this.state.youWereProtectedMessage, 
            this.state.youWereTransportedMessage, 
            this.state.youWerePossessedMessage, 
            this.state.yourTargetWasJailedMessage
        );
    }
    handleYouSurvivedAttackMessageToggle(){
        GAME_MANAGER.sendSetConsortOptions(
            this.state.roleblock, 
            this.state.youWereRoleblockedMessage, 
            !this.state.youSurvivedAttackMessage, 
            this.state.youWereProtectedMessage, 
            this.state.youWereTransportedMessage, 
            this.state.youWerePossessedMessage, 
            this.state.yourTargetWasJailedMessage
        );
    }
    handleYouWereProtectedMessageToggle(){
        GAME_MANAGER.sendSetConsortOptions(
            this.state.roleblock, 
            this.state.youWereRoleblockedMessage, 
            this.state.youSurvivedAttackMessage, 
            !this.state.youWereProtectedMessage, 
            this.state.youWereTransportedMessage, 
            this.state.youWerePossessedMessage, 
            this.state.yourTargetWasJailedMessage
        );
    }
    handleYouWereTransportedMessageToggle(){
        GAME_MANAGER.sendSetConsortOptions(
            this.state.roleblock, 
            this.state.youWereRoleblockedMessage, 
            this.state.youSurvivedAttackMessage, 
            this.state.youWereProtectedMessage, 
            !this.state.youWereTransportedMessage, 
            this.state.youWerePossessedMessage, 
            this.state.yourTargetWasJailedMessage
        );
    }
    handleYouWerePossessedMessageToggle(){
        GAME_MANAGER.sendSetConsortOptions(
            this.state.roleblock, 
            this.state.youWereRoleblockedMessage, 
            this.state.youSurvivedAttackMessage, 
            this.state.youWereProtectedMessage, 
            this.state.youWereTransportedMessage, 
            !this.state.youWerePossessedMessage, 
            this.state.yourTargetWasJailedMessage
        );
    }
    handleYourTargetWasJailedMessageToggle(){
        GAME_MANAGER.sendSetConsortOptions(
            this.state.roleblock, 
            this.state.youWereRoleblockedMessage, 
            this.state.youSurvivedAttackMessage, 
            this.state.youWereProtectedMessage, 
            this.state.youWereTransportedMessage, 
            this.state.youWerePossessedMessage, 
            !this.state.yourTargetWasJailedMessage
        );
    }


    render(){
        return <div className="large-consort-menu">
            <div>
                
                {translate("wiki.article.standard.roleblock")}
                <label className="material-icons-round" onClick={()=>this.handleRoleblockToggle()}>
                    {this.state.roleblock ? "check" : "close"}
                </label>

            </div>
            <div>
                <ChatElement message={{
                    type: "roleBlocked",
                    immune: false,
                }}/>
                <ChatElement message={{
                    type: "roleBlocked",
                    immune: true,
                }}/>
                <label className="material-icons-round" onClick={()=>this.handleYouWereRoleblockedMessageToggle()}>
                    {this.state.youWereRoleblockedMessage ? "check" : "close"}
                </label>
                
            </div>
            <div>
                <ChatElement message={{
                    type: "youSurvivedAttack",
                }}/>
                <label className="material-icons-round" onClick={()=>this.handleYouSurvivedAttackMessageToggle()}>
                    {this.state.youSurvivedAttackMessage ? "check" : "close"}
                </label>
                
            </div>
            <div>
                <ChatElement message={{
                    type: "youWereProtected",
                }}/>
                <label className="material-icons-round" onClick={()=>this.handleYouWereProtectedMessageToggle()}>
                    {this.state.youWereProtectedMessage ? "check" : "close"}
                </label>
                
            </div>
            <div>
                <ChatElement message={{
                    type: "transported",
                }}/>
                <label className="material-icons-round" onClick={()=>this.handleYouWereTransportedMessageToggle()}>
                    {this.state.youWereTransportedMessage ? "check" : "close"}
                </label>
                
            </div>
            <div>
                <ChatElement message={{
                    type: "youWerePossessed",
                    immune: false,
                }}/>
                <ChatElement message={{
                    type: "youWerePossessed",
                    immune: true,
                }}/>
                <label className="material-icons-round" onClick={()=>this.handleYouWerePossessedMessageToggle()}>
                    {this.state.youWerePossessedMessage ? "check" : "close"}
                </label>
                
            </div>
            <div>
                <ChatElement message={{
                    type: "targetJailed",
                }}/>
                <label className="material-icons-round" onClick={()=>this.handleYourTargetWasJailedMessageToggle()}>
                    {this.state.yourTargetWasJailedMessage ? "check" : "close"}
                </label>
            </div>            
        </div>
    }
}