import { create_gameState } from "./gameState";
import Anchor from "../menu/Anchor";
import StartMenu from "../menu/main/StartMenu";
import GAME_MANAGER from "../index";
import messageListener from "./messageListener";
import CONFIG from "../resources/config.json"
import React from "react";
import { Phase, PhaseTimes, Player } from "./gameState.d";
import { GameManager, Server } from "./gameManager.d";

export function create_gameManager(): GameManager {

    console.log("gameManager created");
    
    let gameManager: GameManager = {
        roomCode: null,

        name: undefined,

        Server : create_server(),

        gameState : create_gameState(),

        listeners : [],
        addStateListener(listener) {
            gameManager.listeners.push(listener);
        },
        removeStateListener(listener) {
            gameManager.listeners.splice(gameManager.listeners.indexOf(listener));
        },
        invokeStateListeners(type=null) {
            for(let i = 0; i < gameManager.listeners.length; i++){
                if(typeof(gameManager.listeners[i])==="function"){
                    gameManager.listeners[i](type);
                }
            }
        },

        host_button() {
            gameManager.Server.send(`"Host"`);
        },
        join_button() {
            gameManager.Server.send(JSON.stringify({
                "Join":{
                    "room_code": Number(gameManager.roomCode!)
                }
            }));
        },

        setName_button(name) {
            // if(name)
                gameManager.Server.send(JSON.stringify({
                    "SetName":{
                        "name":name
                    }
                }));
        },
        startGame_button() {
            gameManager.Server.send(`"StartGame"`);
        },
        phaseTimesButton(phaseTimes: PhaseTimes) {
            gameManager.Server.send(JSON.stringify({
                "SetPhaseTimes":{
                    "phase_times":{
                        "morning": {"secs": phaseTimes[Phase.Morning], "nanos": 0},
                        "discussion": {"secs": phaseTimes[Phase.Discussion], "nanos": 0},
                        "voting": {"secs": phaseTimes[Phase.Voting], "nanos": 0},
                        "testimony": {"secs": phaseTimes[Phase.Testimony], "nanos": 0},
                        "judgement": {"secs": phaseTimes[Phase.Judgement], "nanos": 0},
                        "evening": {"secs": phaseTimes[Phase.Evening], "nanos": 0},
                        "night": {"secs": phaseTimes[Phase.Night], "nanos": 0},
                    }
                }
            }))
        },
        roleList_button(roleListEntries) {
            gameManager.Server.send(JSON.stringify({
                "SetRoleList":{
                    "role_list": {
                        "role_list": roleListEntries
                    }
                }
            }));
        },

        judgement_button(judgement) {
            if(judgement===1) judgement="Innocent";
            if(judgement===-1) judgement="Guilty";
            if(judgement===0) judgement="Abstain";
            gameManager.Server.send(JSON.stringify({
                "Judgement":{
                    "verdict":judgement
                }
            }));
        },
        vote_button(votee_index) {
            gameManager.Server.send(JSON.stringify({
                "Vote":{
                    "player_index":votee_index
                }
            }));
        },
        target_button(target_index_list) {
            gameManager.Server.send(JSON.stringify({
                "Target":{
                    "player_index_list":target_index_list
                }
            }));
        },
        dayTarget_button(target_index) {
            gameManager.Server.send(JSON.stringify({
                "DayTarget":{
                    "player_index":target_index
                }
            }));
        },

        saveWill_button(will) {
            gameManager.Server.send(JSON.stringify({
                "SaveWill":{
                    "will":will
                }
            }));
        },
        sendMessage_button(text) {
            gameManager.Server.send(JSON.stringify({
                "SendMessage":{
                    "text":text
                }
            }));
        },
        sendWhisper_button(playerIndex, text) {
            gameManager.Server.send(JSON.stringify({
                "SendWhisper":{
                    "player_index":playerIndex,
                    "text":text
                }
            }));
        },
        
        messageListener(serverMessage) {
            messageListener(serverMessage);
        },
    
        tick(timePassedms) {
            console.log("tick");
            gameManager.gameState.secondsLeft = Math.round(gameManager.gameState.secondsLeft - timePassedms/1000)
            if(gameManager.gameState.secondsLeft < 0)
                gameManager.gameState.secondsLeft = 0;
            gameManager.invokeStateListeners("tick");
        },

        getPlayer(playerIndex: number): Player {
            return this.gameState.players[playerIndex];
        }
    }
    return gameManager;
}
function create_server(){
 

    let Server: Server = {
        ws: null,

        openListener : (event: any)=>{
            //Server.ws.send("Hello to Server");
        },
        closeListener : (event: any)=>{
            console.log(event);

            Anchor.setContent(<StartMenu/>);
        },
        messageListener: (event: any)=>{
            // console.log("Server: "+event.data);

            GAME_MANAGER.messageListener(
                JSON.parse(event.data)
            );
        },

        open : ()=>{
            let address = CONFIG.server_ip + ":" + CONFIG.port;
            Server.ws = new WebSocket("ws://"+address);   //TODO
            Server.ws.addEventListener("open", (event: any)=>{
                Server.openListener(event);
            });
            Server.ws.addEventListener("close", (event: any)=>{
                Server.closeListener(event);
            });
            Server.ws.addEventListener("message", (event: any)=>{
                Server.messageListener(event);
            });
        },
        send : (packets)=>{
            Server.ws.send(packets);
        },
        close : ()=>{
            if(Server.ws==null) return;
            
            Server.ws.close();
            Server.ws.removeEventListener("close", Server.closeListener);
            Server.ws.removeEventListener("message", Server.messageListener);
            Server.ws.removeEventListener("open", Server.openListener);
            Server.ws = null;
        }
        
    }
    return Server;
}


export type { GameManager, Server } from "./gameManager.d";
// export default gameManager;


/*
rust side code of packets i need to make
pub enum ToServerPacket{
    
    Join
    Host

    //
    StartGame,
    Kick,
    SetRoleList,
    SetPhaseTimes,
    SetInvestigatorResults,

    //
    Vote,   //Accusation
    Target,
    DayTarget,
    Judgement,  //Vote
    Whisper,
    SendMessage,
    SaveWill,
}
*/