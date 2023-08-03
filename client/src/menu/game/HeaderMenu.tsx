import React from "react";
import translate from "../../game/lang";
import GAME_MANAGER from "../../index";
import GameState, { Phase, Verdict } from "../../game/gameState.d";
import GameScreen, { ContentMenus as GameScreenContentMenus } from "./GameScreen";
import ROLES from "../../resources/roles.json"
import "./headerMenu.css";
import { Role } from "../../game/roleState.d";
import StyledText from "../../components/StyledText";


type HeaderMenuProps = {
    phase: Phase | null,
}
type HeaderMenuState = {
    gameState: GameState,
}

export default class HeaderMenu extends React.Component<HeaderMenuProps, HeaderMenuState> {
    listener: () => void;
    
    constructor(props: HeaderMenuProps) {
        super(props);
        
        if(GAME_MANAGER.gameState?.type !== "game")
            throw new Error("type = game expected");

        this.state = {
            gameState: GAME_MANAGER.gameState,
        };
        this.listener = () => {
            
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");

            this.setState({
                gameState: GAME_MANAGER.gameState,
            });
        };
    }
    componentDidMount() {
        GAME_MANAGER.addStateListener(this.listener);
    }
    componentWillUnmount() {
        GAME_MANAGER.removeStateListener(this.listener);
    }
    renderPhaseSpecific(){
        // TODO: Change to phase state
        switch(this.state.gameState.phase){
            case "judgement":
            if(this.state.gameState.playerOnTrial !== null){
                return(<div className="judgement-specific">
                    <div>
                        <StyledText>
                            {this.state.gameState.players[this.state.gameState.playerOnTrial!]?.toString()}
                        </StyledText>
                    {(()=>{
                        if (this.state.gameState.playerOnTrial === this.state.gameState.index) {
                            return <div className="judgement-info">{translate("judgement.cannotVote.onTrial")}</div>;
                        } else if (!this.state.gameState.players[this.state.gameState.index!].alive){
                            return <div className="judgement-info">{translate("judgement.cannotVote.dead")}</div>;
                        } else {
                            return(<div className="judgement-info">
                                {this.renderVerdictButton("guilty")}
                                {this.renderVerdictButton("abstain")}
                                {this.renderVerdictButton("innocent")}
                            </div>);
                        }
                    })()}
                    </div>
                </div>);
            }else{
                return(<div> 
                    ERROR NO PLAYER ON TRIAL FOUND IN JUDGEMENT PHASE + LANG TODO 
                </div>);
            }
            
            default:
            return null;
        }
    }

    renderVerdictButton(verdict: Verdict) {
        return <button
            className={this.state.gameState.judgement === verdict ? "highlighted" : undefined}
            onClick={()=>{GAME_MANAGER.sendJudgementPacket(verdict)}}
        >
            <StyledText noLinks={true}>
                {translate("verdict." + verdict)}
            </StyledText>
        </button>
    }
    
    renderMenuButtons(){
        return <div className="menu-buttons">
            <button 
            className={GameScreen.instance.menusOpen().includes(GameScreenContentMenus.GraveyardMenu)?"highlighted":""} 
            onClick={()=>{
                GameScreen.instance.closeOrOpenMenu(GameScreenContentMenus.GraveyardMenu)
            }}>{translate("menu.graveyard.title")}</button>

            <button 
            className={GameScreen.instance.menusOpen().includes(GameScreenContentMenus.PlayerListMenu)?"highlighted":""} 
            onClick={()=>{
                GameScreen.instance.closeOrOpenMenu(GameScreenContentMenus.PlayerListMenu)
            
            }}>{translate("menu.playerList.title")}</button>
            <button 
            className={GameScreen.instance.menusOpen().includes(GameScreenContentMenus.WillMenu)?"highlighted":""} 
            onClick={()=>{
                GameScreen.instance.closeOrOpenMenu(GameScreenContentMenus.WillMenu)
            }}>{translate("menu.will.title")}</button>
            {(()=>
                (
                    ROLES[this.state.gameState.roleState?.role as Role] === undefined || !ROLES[this.state.gameState.roleState?.role as Role].largeRoleSpecificMenu
                )?null:
                    <button 
                    className={GameScreen.instance.menusOpen().includes(GameScreenContentMenus.RoleSpecificMenu)?"highlighted":""} 
                    onClick={()=>{
                        GameScreen.instance.closeOrOpenMenu(GameScreenContentMenus.RoleSpecificMenu)
                    
                    }}>
                        <StyledText noLinks={true}>
                            {translate("role."+this.state.gameState.roleState?.role+".name")}
                        </StyledText>
                    </button>
            )()}
            <button 
            className={GameScreen.instance.menusOpen().includes(GameScreenContentMenus.WikiMenu)?"highlighted":""} 
            onClick={()=>{
                GameScreen.instance.closeOrOpenMenu(GameScreenContentMenus.WikiMenu)
            
            }}>{translate("menu.wiki.title")}</button>

        </div>
    }
    renderPhase(){
        if(this.state.gameState.phase){
            return(<div>
                {translate("phase."+this.state.gameState.phase)} {this.state.gameState.dayNumber}⏳{Math.floor(this.state.gameState.timeLeftMs/1000)}
            </div>);
        }
        return null;
    }

    render(){return(<div className="header-menu">
        {this.renderPhase()}
        {(()=>{
            if(this.state.gameState.index !== null){
                return <StyledText>
                    {this.state.gameState.players[this.state.gameState.index].toString() +
                    " (" + translate("role."+this.state.gameState.roleState?.role+".name") + ")"}
                </StyledText>;
            }
        })()}
        {this.renderPhaseSpecific()}
        {this.renderMenuButtons()}
    </div>)}
}