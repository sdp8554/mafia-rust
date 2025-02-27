
import translate from "./lang";
import { Role } from "./roleState.d";
import ROLES from "../resources/roles.json";

export const FACTIONS = ["town", "mafia", "vampire", "neutral"] as const;
export type Faction = typeof FACTIONS[number]
export function getRoleOutlineFromFaction(faction: Faction): RoleOutline {
    return {
        type: "roleOutlineOptions",
        options: [{
            type: "faction",
            faction: faction
        }]
    }
}

export type RoleList = RoleOutline[];
export function getRolesFromRoleList(roleList: RoleList): Role[] {

    let set = new Set<Role>();
    for(let roleOutline of roleList){
        for(let role of getRolesFromOutline(roleOutline)){
            set.add(role);
        }
    }

    return Array.from(set);
}
export function getRolesFromRoleListRemoveExclusionsAddConversions(roleList: RoleList, excludedRoles: Role[]): Role[] {
    let out = [];

    let roles = getRolesFromRoleList(roleList);
    roles = roles.filter((role) => {
        return !excludedRoles.includes(role);
    });

    
    for(let role of roles){
        if(role==="amnesiac"){
            getRolesComplement(excludedRoles).forEach((role) => {
                out.push(role);
            });
            break;
        }
    }

    for(let role of roles){
        out.push(role);
        for(let converted of ROLES[role].canBeConvertedTo){
            out.push(converted);
        }
    }

    return out as Role[];
}
export function getRolesComplement(roleList: Role[]): Role[] {
    let roles = Object.keys(ROLES) as Role[];
    return roles.filter((role) => {
        return !roleList.includes(role);
    });
}



export const ROLE_SETS = [
    "townSupport", "townKilling", "townProtective", "townInvestigative", "townCommon",
    "mafiaPower", "mafiaSupport",
    "neutralEvil", "neutralKilling", "neutralChaos", "neutralApocalypse"
] as const;
export type RoleSet = typeof ROLE_SETS[number];
export function getRolesFromRoleSet(roleSet: RoleSet): Role[] {
    switch(roleSet){
        case "townSupport":
            return ["medium", "retributionist", "transporter", "escort", "mayor", "journalist"];
        case "townKilling":
            return ["vigilante", "veteran", "deputy"];
        case "townProtective":
            return ["bodyguard", "crusader", "doctor", "reveler", "trapper"];
        case "townInvestigative":
            return ["psychic", "lookout", "sheriff", "spy", "tracker", "seer"];
        case "townCommon":
            let out = getRolesFromRoleSet("townSupport")
            out = out.concat(getRolesFromRoleSet("townKilling"))
            out = out.concat(getRolesFromRoleSet("townProtective"))
            out = out.concat(getRolesFromRoleSet("townInvestigative"))
            return out;
        case "mafiaPower":
            return ["godfather", "mafioso"];
        case "mafiaSupport":
            return [
                "blackmailer", "consigliere", "consort", 
                "forger", "framer", "janitor", 
                "witch", "necromancer"
            ];
        case "neutralEvil":
            return ["jester", "executioner", "politician"];
        case "neutralKilling":
            return ["arsonist", "werewolf"];
        case "neutralChaos":
            return ["amnesiac"];
        case "neutralApocalypse":
            return ["death", "doomsayer"];
    }
}


export type RoleOutlineType = RoleOutline["type"];
export type RoleOutline = ({
    type: "any",
} | {
    type: "roleOutlineOptions",
    options: RoleOutlineOption[],
});


export type RoleOutlineOptionType = RoleOutlineOption["type"];
export type RoleOutlineOption = ({
    type: "roleSet",
    roleSet: RoleSet,
} | {
    type: "role",
    role: Role,
} | {
    type: "faction",
    faction: Faction,
});




export function translateRoleOutline(roleOutline: RoleOutline): string {
    switch(roleOutline.type){
        case "any":
            return translate("any");
        case "roleOutlineOptions":
            return roleOutline.options.map(translateRoleOutlineOption).join(" "+translate("add")+" ");
    }
}
export function translateRoleOutlineOption(roleOutlineOption: RoleOutlineOption): string {
    switch(roleOutlineOption.type){
        case "roleSet":
            return translate(roleOutlineOption.roleSet);
        case "role":
            return translate("role."+roleOutlineOption.role+".name");
        case "faction":
            return translate(roleOutlineOption.faction);
    }
}
export function getRolesFromOutline(roleOutline: RoleOutline): Role[] {
    switch(roleOutline.type){
        case "any":
            return Object.keys(ROLES) as Role[];
        case "roleOutlineOptions":
            return roleOutline.options.flatMap((option) => getRolesFromOutlineOption(option));
    }
}
function getRolesFromOutlineOption(roleOutlineOption: RoleOutlineOption): Role[] {
    switch(roleOutlineOption.type){
        case "roleSet":
            return getRolesFromRoleSet(roleOutlineOption.roleSet);
        case "role":
            return [roleOutlineOption.role];
        case "faction":
            return Object.keys(ROLES).filter((role) => {
                return ROLES[role as Role].faction === roleOutlineOption.faction;
            }) as Role[];
    }
}