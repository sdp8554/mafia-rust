
import { createGameState, createLobbyPlayer, createPlayer } from "./gameState";
import Anchor from "./../menu/Anchor";
import LobbyMenu from "./../menu/lobby/LobbyMenu";
import StartMenu from "./../menu/main/StartMenu";
import GAME_MANAGER from "./../index";
import GameScreen, { ContentMenus } from "./../menu/game/GameScreen";
import React from "react";
import { ToClientPacket } from "./packet";
import { Tag } from "./gameState.d";
import { Role } from "./roleState.d";

export default function messageListener(packet: ToClientPacket){

    console.log(JSON.stringify(packet, null, 2));
    switch(packet.type) {
        case "acceptJoin":
            
        //TODO
            // GAME_MANAGER.gameState.inGame = packet.inGame;
            // GAME_MANAGER.gameState?.id = packet.playerId;

            if(packet.inGame){
                Anchor.setContent(GameScreen.createDefault());
            }else{
                Anchor.setContent(<LobbyMenu/>);
            }
        break;
        case "rejectJoin":
            switch(packet.reason) {
                case "INVALID_ROOM_CODE":
                    Anchor.pushInfo("Couldn't join", "No lobby has that room code!");
                break;
                case "GAME_ALREADY_STARTED":
                    Anchor.pushInfo("Couldn't join", "That game has already begun!");
                break;
                case "ROOM_FULL":
                    Anchor.pushInfo("Couldn't join", "That lobby is full!");
                break;
                case "SERVER_BUSY":
                    Anchor.pushInfo("Couldn't join", "The server is busy. Try again later!");
                break;
                default:
                    Anchor.pushInfo("Couldn't join", "Failed to join the lobby. Try again later!");
                    console.log("incoming message response not implemented " + packet.type + ": " + packet.reason);
                    console.log(packet);
                break;
            }
            Anchor.setContent(<StartMenu/>);
        break;
        case "rejectStart":
            switch(packet.reason) {
                case "GameEndsInstantly":
                    Anchor.pushInfo("Couldn't start", "Game would end instantly! Make sure your role list is valid.");
                break;
                case "ZeroTimeGame":
                    Anchor.pushInfo("Couldn't start", "Make sure your phase time settings are valid!");
                break;
                default:
                    Anchor.pushInfo("Couldn't start", "Failed to start lobby. Try again later!");
                    console.log("incoming message response not implemented " + packet.type + ": " + packet.reason);
                    console.log(packet);
                break;
            }
        break;
        case "acceptHost":
            
            if(GAME_MANAGER.gameState?.type !== "lobby")
                throw new Error("type = game expected");

            GAME_MANAGER.roomCode = packet.roomCode.toString(18);
            GAME_MANAGER.gameState.id = packet.playerId;
            GAME_MANAGER.gameState.host = true;
            Anchor.setContent(<LobbyMenu/>);
        break;
        /*
        In Lobby/Game 
        */
        case "yourName":
            GAME_MANAGER.gameState.name = packet.name;
        break;
        case "yourPlayerIndex":
            
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            GAME_MANAGER.gameState.index = packet.playerIndex;
        break;
        case "players":
            GAME_MANAGER.gameState.players = [];
            
            if(GAME_MANAGER.gameState?.type === "game"){
                for(let i = 0; i < packet.players.length; i++){
                    if (GAME_MANAGER.gameState.players.length > i) {
                        GAME_MANAGER.gameState.players[i].name = packet.players[i][1];
                    } else {
                        GAME_MANAGER.gameState.players.push(createPlayer(packet.players[i][1], i));
                    }
                }
            }else{
                for(let i = 0; i < packet.players.length; i++){
                    if (GAME_MANAGER.gameState.players.length > i) {
                        GAME_MANAGER.gameState.players[i].name = packet.players[i][1];
                    } else {
                        GAME_MANAGER.gameState.players.push(createLobbyPlayer(packet.players[i][1], i));
                    }
                }
            }
            
        break;
        case "kickPlayer":
            if(packet.playerId === GAME_MANAGER.gameState.id){
                GAME_MANAGER.leaveGame();
            }
            // GAME_MANAGER.gameState = createGameState();
            // Anchor.setContent(<StartMenu/>)
        break;
        case "startGame":
            GAME_MANAGER.gameState = GAME_MANAGER.gameState = createGameState();
            Anchor.setContent(GameScreen.createDefault());
        break;
        case "roleList":
            //list of role list entriy
            GAME_MANAGER.gameState.roleList = packet.roleList;
        break;
        case "roleOutline":
            //role list entriy
            GAME_MANAGER.gameState.roleList[packet.index] = packet.roleOutline;
        break;
        case "phaseTime":
            GAME_MANAGER.gameState.phaseTimes[packet.phase as keyof typeof GAME_MANAGER.gameState.phaseTimes] = packet.time;
        break;
        case "phaseTimes":
            GAME_MANAGER.gameState.phaseTimes = packet.phaseTimeSettings;
        break;
        case "excludedRoles":
            GAME_MANAGER.gameState.excludedRoles = packet.roles;
        break;
        case "youAreHost":
            
            if(GAME_MANAGER.gameState?.type !== "lobby")
                throw new Error("type = lobby expected");
            
            GAME_MANAGER.gameState.host = true;
            Anchor.pushInfo("You are host", "The previous host left and you have become the host.")
        break;
        case "phase":
            
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");

            GAME_MANAGER.gameState.phase = packet.phase;
            GAME_MANAGER.gameState.dayNumber = packet.dayNumber;
            GAME_MANAGER.gameState.timeLeftMs = packet.secondsLeft * 1000;
        break;
        case "playerOnTrial":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            GAME_MANAGER.gameState.playerOnTrial = packet.playerIndex;
        break;
        case "playerAlive":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            for(let i = 0; i < GAME_MANAGER.gameState.players.length && i < packet.alive.length; i++){
                GAME_MANAGER.gameState.players[i].alive = packet.alive[i];
            }
        break;
        case "playerVotes":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            for(let i = 0; i < GAME_MANAGER.gameState.players.length; i++){
                GAME_MANAGER.gameState.players[i].numVoted = 0;
            }
            for(let [playerIndex, numVoted] of Object.entries(packet.votesForPlayer)){
                GAME_MANAGER.gameState.players[Number.parseInt(playerIndex)].numVoted = numVoted;
            }
        break;
        case "yourButtons":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            for(let i = 0; i < GAME_MANAGER.gameState.players.length && i < packet.buttons.length; i++){
                GAME_MANAGER.gameState.players[i].buttons = packet.buttons[i];
            }
        break;
        case "yourRoleLabels":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            for (const [key, value] of Object.entries(packet.roleLabels)) { 
                GAME_MANAGER.gameState.players[Number.parseInt(key)].roleLabel = value as Role;
            }
        break;
        case "yourPlayerTags":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            for (const [key, value] of Object.entries(packet.playerTags)) { 
                GAME_MANAGER.gameState.players[Number.parseInt(key)].playerTags = value as Tag[];
            }
        break;
        case "yourWill":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            GAME_MANAGER.gameState.will = packet.will;
        break;
        case "yourNotes":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            GAME_MANAGER.gameState.notes = packet.notes;
        break;
        case "yourDeathNote":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            GAME_MANAGER.gameState.deathNote = packet.deathNote ?? "";
        break;
        case "yourRoleState":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            if(GAME_MANAGER.gameState.roleState?.role!== packet.roleState.role){
                GameScreen.instance?.closeMenu(ContentMenus.RoleSpecificMenu);
            }
            GAME_MANAGER.gameState.roleState = packet.roleState;
        break;
        case "yourTarget":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            GAME_MANAGER.gameState.targets = packet.playerIndices;
        break;
        case "yourVoting":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            GAME_MANAGER.gameState.voted = packet.playerIndex;
        break;
        case "yourJudgement":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            GAME_MANAGER.gameState.judgement = packet.verdict;
        break;
        case "addChatMessages":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            GAME_MANAGER.gameState.chatMessages = GAME_MANAGER.gameState.chatMessages.concat(packet.chatMessages);
        break;
        case "addGrave":
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            GAME_MANAGER.gameState.graves.push(packet.grave);
        break;
        case "gameOver":
            switch(packet.reason) {
                case "ReachedMaxDay":
                    alert("Game Over: Reached the maximum day!");
                break;
                default:
                    alert("Game ended for an unknown reason!");
                    console.log("incoming message response not implemented " + packet.type + ": " + packet.reason);
                    console.log(packet);
                break;
            }
        break;
        default:
            console.log("incoming message response not implemented " + packet);
            console.log(packet);
        break;
    }

    GAME_MANAGER.invokeStateListeners(packet.type);
}


