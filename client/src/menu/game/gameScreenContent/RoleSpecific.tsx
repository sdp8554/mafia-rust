import React from "react";
import translate from "../../../game/lang";
import GAME_MANAGER from "../../../index";
import GameScreen, { ContentMenus } from "../GameScreen";
import "./graveyardMenu.css";
import GameState from "../../../game/gameState.d";
import StyledText from "../../../components/StyledText";

type RoleSpecifcMenuProps = {
}
type RoleSpecifcMenuState = {
    gameState: GameState,
}

export default class RoleSpecifcMenu extends React.Component<RoleSpecifcMenuProps, RoleSpecifcMenuState> {
    listener: () => void;
    constructor(props: RoleSpecifcMenuProps) {
        super(props);

        this.state = {
            gameState : GAME_MANAGER.gameState,
        };
        this.listener = ()=>{
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

    render(){return(<div>
        <button onClick={()=>{GameScreen.instance.closeMenu(ContentMenus.RoleSpecificMenu)}}>
            <StyledText>{translate("role."+this.state.gameState.role+".name")}</StyledText>
        </button>
        <div>
            TODO actual menu and everything
        </div>
    </div>)}
}