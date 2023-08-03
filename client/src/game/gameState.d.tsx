import { Grave } from "./grave";
import { ChatMessage } from "../components/ChatMessage";
import { Role, RoleState } from "./roleState.d";
import { RoleOutline } from "./roleListState.d";



export interface LobbyState {
    type: "lobby",

    name: string,
    host: boolean,
    id: PlayerID,

    players: LobbyPlayer[],

    //settings 
    roleList: RoleOutline[],
    excludedRoles: RoleOutline[],
    phaseTimes: PhaseTimes
}

export type PlayerID = number;
export interface LobbyPlayer{
    name: string,
    id: PlayerID,

    toString(): string
}

export default interface GameState {
    type: "game",

    name: string,
    index: PlayerIndex,
    id: PlayerID,

    chatMessages : ChatMessage[],
    roleState: RoleState | null,
    will: string,
    notes: string,
    deathNote: string,
    targets: PlayerIndex[],
    voted: PlayerIndex | null,
    judgement: Verdict,

    graves: Grave[],
    players: Player[],
    
    playerOnTrial: PlayerIndex | null,
    phase: Phase | null,
    timeLeftMs: number,
    dayNumber: number,

    //settings
    roleList: RoleOutline[],
    excludedRoles: RoleOutline[],
    phaseTimes: PhaseTimes
}

export type PlayerIndex = number;
export interface Player {
    name: string,
    index: number,

    buttons: {
        dayTarget: boolean,
        target: boolean,
        vote: boolean,
    },
    numVoted: number,
    alive: boolean,
    roleLabel: Role | null,
    playerTags: Tag[],

    toString(): string
}
export type Tag =
| "doused"
| "hexed"
| "necronomicon"
| "executionerTarget"
| "insane"


export type Verdict = "innocent" | "guilty" | "abstain";
export type Phase = "morning" | "discussion" | "voting" | "testimony" | "judgement" | "evening" | "night";

export interface PhaseTimes {
    "morning": number,
    "discussion": number,
    "voting": number,
    "testimony": number,
    "judgement": number,
    "evening": number,
    "night": number,
}




