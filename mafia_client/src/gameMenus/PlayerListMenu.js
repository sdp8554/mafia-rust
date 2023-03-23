import React from "react";
import { getPlayerString, translate } from "../game/lang.js";
import gameManager from "../index";
import "./playerListMenu.css"
import "./gameScreen.css"
export class PlayerListMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gameState : gameManager.gameState,
            hideDead: false,
        };
        this.listener = ()=>{
            this.setState({
                gameState: gameManager.gameState
            })
        };  
    }
    componentDidMount() {
        gameManager.addStateListener(this.listener);
    }
    componentWillUnmount() {
        gameManager.removeStateListener(this.listener);
    }

    renderPhaseSpecific(){
        switch(this.state.gameState.phase){
            case"Voting":
                let votedString = "";
                if(this.state.gameState.voted!=null){
                    votedString = this.state.gameState.players[this.state.gameState.voted].name;
                    return(<div>
                        <div>{votedString}</div>
                        <button class="button gm-button" onClick={()=>{
                            gameManager.vote_button(null);
                        }}>Reset Vote</button>
                    </div>);
                }
                return null;
            case"Night":
                let targetStringList = [];
                for(let i = 0; i < this.state.gameState.targets.length; i++){
                    targetStringList.push(getPlayerString(this.state.gameState.targets[i]));
                }

                if(targetStringList.length>0){
                    return(<div>
                        <div>{targetStringList.join(", ")+"."}</div>
                        <button class="button gm-button" onClick={()=>{
                            gameManager.target_button([]);
                        }}>Reset Targets</button>
                    </div>);
                }
                return null;
            default:
                return null;
        }
    }

    renderPlayer(player, playerIndex){
        
        let canWhisper = this.state.gameState.phase !== "Night" && gameManager.gameState.phase !== null && this.state.gameState.myIndex !== playerIndex;

        // let buttonCount = player.buttons.dayTarget + player.buttons.target + player.buttons.vote + canWhisper;

        return(<div key={playerIndex}>
            {getPlayerString(playerIndex)}<br/>

            <div>
                {((player)=>{if(player.buttons.target){return(<button class="button gm-button" onClick={()=>{
                        gameManager.target_button([...gameManager.gameState.targets, playerIndex]);
                    }}
                >{translate("button.Target")}</button>)}})(player)}
                {((player)=>{if(player.buttons.vote){return(<button class="button gm-button" onClick={()=>{gameManager.vote_button(playerIndex)}}
                >{translate("button.Vote")}</button>)}})(player)}
                {((player)=>{if(player.buttons.dayTarget){return(<button class="button gm-button" onClick={()=>{gameManager.dayTarget_button(playerIndex)}}
                >{translate("button.DayTarget")}</button>)}})(player)}
                {((player)=>{if(canWhisper){return(<button class="button gm-button">{translate("button.Whisper")}</button>)}})(player)}

                <div></div>
            </div>

            
        </div>)
    }
    renderPlayers(players){return<div>
        {
            players.map((player, playerIndex)=>{
                if(!this.state.hideDead || player.alive){
                    return this.renderPlayer(player, playerIndex);
                }
                return null;
            }, this)
        }
    </div>}

    render(){return(<div>
        {this.renderPhaseSpecific()}
        <br/>
        {this.renderPlayers(this.state.gameState.players)}
    </div>)}
}
