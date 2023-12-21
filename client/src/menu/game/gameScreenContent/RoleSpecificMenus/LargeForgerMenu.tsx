import React from "react"
import GameState from "../../../../game/gameState.d"
import GAME_MANAGER from "../../../.."
import { StateEventType } from "../../../../game/gameManager.d"
import RolePicker from "../../../../components/RolePicker"
import { Role } from "../../../../game/roleState.d"

type LargeForgerMenuProps = {
}
type LargeForgerMenuState = {
    gameState: GameState,
    localRole: Role,
    localForgedWill: string,
}
export default class LargeForgerMenu extends React.Component<LargeForgerMenuProps, LargeForgerMenuState> {
    listener: (type?: StateEventType) => void;
    constructor(props: LargeForgerMenuState) {
        super(props);

        if(GAME_MANAGER.state.stateType === "game")
            this.state = {
                gameState : GAME_MANAGER.state,
                localRole: "jester",
                localForgedWill: ""
            };
        this.listener = (type)=>{
            if(GAME_MANAGER.state.stateType === "game")
                this.setState({
                    gameState: GAME_MANAGER.state
                });
            if(GAME_MANAGER.state.stateType === "game" && type ==="yourRoleState" && GAME_MANAGER.state.roleState?.role === "forger")
                this.setState({
                    localRole: GAME_MANAGER.state.roleState.forgedRole,
                    localForgedWill: GAME_MANAGER.state.roleState.forgedWill
                });
            
        };  
    }
    componentDidMount() {
        GAME_MANAGER.addStateListener(this.listener);
    }
    componentWillUnmount() {
        GAME_MANAGER.removeStateListener(this.listener);
    }

    sendAndSetRole(role: Role){
        this.setState({
            localRole: role
        });
        
        // GAME_MANAGER.sendSetAmnesiacRoleOutline(roleOutline);
    }
    render(){
        return <div>
        </div>
    }
}