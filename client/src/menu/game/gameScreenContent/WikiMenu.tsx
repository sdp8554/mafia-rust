import React from "react";
import GAME_MANAGER from "../../../index";
import { ContentMenus, ContentTab } from "../GameScreen";
import "./wikiMenu.css"
import GameState from "../../../game/gameState.d";
import translate from "../../../game/lang";
import WikiSearch from "../../../components/WikiSearch";

interface WikiMenuProps {
}
interface WikiMenuState {
    gameState: GameState,
}

export default class WikiMenu extends React.Component<WikiMenuProps, WikiMenuState> {
    listener: () => void;
    
    constructor(props : WikiMenuProps) {
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
                gameState: GAME_MANAGER.gameState,
            })
        };  
    }
    componentDidMount() {
        GAME_MANAGER.addStateListener(this.listener);
    }
    componentWillUnmount() {
        GAME_MANAGER.removeStateListener(this.listener);
    }

    render(){return(<div className="wiki-menu">
        <ContentTab close={ContentMenus.WikiMenu}>{translate("menu.wiki.title")}</ContentTab>
        
        <div className="wiki-menu-search">
            <WikiSearch/>
        </div>
    </div>)}
}