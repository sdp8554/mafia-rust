import GameState, { Player } from "./gameState.d"

export function createGameState(): GameState {
    return {
        stateType: "game",
        
        inGame: false,

        myName: null,
        myIndex: null,
        host: false,

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

        ongoing: true,
    }
}

export function createPlayer(name: string, index: number, id: number): Player {
    return{
        name: name,
        index: index,
        id: id,
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


