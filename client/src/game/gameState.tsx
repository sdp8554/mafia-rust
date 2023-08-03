import GameState, { LobbyPlayer, LobbyState, Player } from "./gameState.d"

export function createGameState(): GameState {
    return {
        type: "game",
        name: "",
        index: 0,
        id: 0,
        
        chatMessages : [],
        graves: [],
        players: [],
        
        playerOnTrial: null,
        phase: null,
        timeLeftMs: 0,
        dayNumber: 1,

        roleState: null,

        will: "",
        notes: "",
        deathNote: "",
        targets: [],
        voted: null,
        judgement: "abstain",
        
        roleList: [],
        excludedRoles: [],
        phaseTimes: {
            morning: 5,
            discussion: 45, 
            voting: 30, 
            testimony: 20, 
            judgement: 20, 
            evening: 7, 
            night: 37,
        },
    }
}

export function createPlayer(name: string, index: number): Player {
    return{
        name: name,
        index: index,

        buttons: {
            dayTarget: false,
            target: false,
            vote: false,
        },
        numVoted: 0,
        alive: true,
        roleLabel: null,
        playerTags: [],

        toString() {
            return ""+(this.index+1)+"-" + this.name;
        }
    }
}

export function createLobbyState(): LobbyState {
    return {
        type: "lobby",

        name: "",
        host: false,
        id: 0,

        players: [],

        //settings 
        roleList: [],
        excludedRoles: [],
        phaseTimes: {
            morning: 5,
            discussion: 45, 
            voting: 30, 
            testimony: 20, 
            judgement: 20, 
            evening: 7, 
            night: 37,
        }
    }
}

export function createLobbyPlayer(name: string, id: number): LobbyPlayer{
    return {
        name: name,
        id: id
    }
}


