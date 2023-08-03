import React from "react";
import translate from "../../game/lang";
import GAME_MANAGER from "../../index";
import "./lobbyMenu.css";
import { LobbyPlayer } from "../../game/gameState.d";
import { StateListener } from "../../game/gameManager.d";
import StyledText from "../../components/StyledText";

interface PlayerListState {
    enteredName: string,
    players: LobbyPlayer[],
    host: boolean
}

export default class LobbyPlayerList extends React.Component<{}, PlayerListState> {
    listener: StateListener;
    constructor(props: {}) {
        
        if(GAME_MANAGER.gameState?.type !== "lobby")
            throw new Error("Lobby menu cant be rendered with wrong state");

        super(props);

        this.state = {     
            enteredName: "",
            players: GAME_MANAGER.gameState.players,
            host: GAME_MANAGER.gameState.host
        };
        this.listener = ()=>{
            if(GAME_MANAGER.gameState?.type !== "lobby")
                throw new Error("Lobby menu cant be rendered with wrong state");

            this.setState({
                players: GAME_MANAGER.gameState.players,
                host: GAME_MANAGER.gameState.host
            });
        }
    }
    componentDidMount() {
        GAME_MANAGER.addStateListener(this.listener);
    }
    componentWillUnmount() {
        GAME_MANAGER.removeStateListener(this.listener);
    }
    
    renderName(){return(
        <div className="name-box">
            <input type="text" value={this.state.enteredName}
                onChange={(e)=>{this.setState({enteredName: e.target.value})}}
                placeholder={translate("menu.lobby.field.namePlaceholder")}
                onKeyUp={(e)=>{
                    if(e.key === 'Enter')
                        GAME_MANAGER.sendSetNamePacket(this.state.enteredName);
                }}
            />
            <button onClick={()=>{
                GAME_MANAGER.sendSetNamePacket(this.state.enteredName)
            }}>{translate("menu.lobby.button.setName")}</button>
        </div>
    )}

    renderPlayers(){return(<div>
        {this.state.players.map((player, i)=>{
            return(<div key={i}>
                <StyledText>
                    {player.toString()}
                </StyledText>
                <button onClick={()=>{GAME_MANAGER.sendKickPlayerPacket(player.id)}}>{translate("menu.lobby.kick")}</button>
            </div>)
        })}
    </div>)}

    render(){return(<section>
        {this.renderName()}
        {this.renderPlayers()}
    </section>)}
}