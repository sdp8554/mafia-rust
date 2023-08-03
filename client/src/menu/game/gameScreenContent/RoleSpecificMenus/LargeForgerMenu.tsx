import React from "react"
import GameState from "../../../../game/gameState.d"
import GAME_MANAGER from "../../../.."

type LargeForgerMenuProps = {
}
type LargeForgerMenuState = {
    gameState: GameState
}
export default class LargeForgerMenu extends React.Component<LargeForgerMenuProps, LargeForgerMenuState> {
    listener: () => void;
    constructor(props: LargeForgerMenuState) {
        super(props);

        if(GAME_MANAGER.gameState?.type !== "game")
            throw new Error("type = game expected");

        this.state = {
            gameState : GAME_MANAGER.gameState,
        };
        this.listener = ()=>{
            
            if(GAME_MANAGER.gameState?.type !== "game")
                throw new Error("type = game expected");
            this.setState({
                gameState: GAME_MANAGER.gameState
            })
        };  
    }
    componentDidMount() {
        GAME_MANAGER.addStateListener(this.listener);
    }
    componentWillUnmount() {
        GAME_MANAGER.removeStateListener(this.listener);
    }

    render(){
        return <div>TODO forger menu</div>
    }
}