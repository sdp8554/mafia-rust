use rand::seq::SliceRandom;
use serde::Serialize;

use crate::game::chat::{ChatGroup, ChatMessage};
use crate::game::phase::PhaseType;
use crate::game::player::PlayerReference;
use crate::game::role_list::Faction;
use crate::game::visit::Visit;
use crate::game::team::Team;
use crate::game::Game;
use super::{Priority, RoleStateImpl};


#[derive(Debug, Clone, Serialize, Default)]
pub struct Psychic;

pub(super) const FACTION: Faction = Faction::Town;
pub(super) const MAXIMUM_COUNT: Option<u8> = None;

impl RoleStateImpl for Psychic {
    fn defense(&self, _game: &Game, _actor_ref: PlayerReference) -> u8 {0}
    fn team(&self, _game: &Game, _actor_ref: PlayerReference) -> Option<Team> {None}


    fn do_night_action(self, game: &mut Game, actor_ref: PlayerReference, priority: Priority) {
        if actor_ref.night_roleblocked(game) {return;}

        if priority != Priority::Investigative {return}
        
        actor_ref.push_night_message(game, match game.day_number() % 2 {
            1=>{
                Psychic::get_psychic_result_evil(game, actor_ref)
            },
            _=>{
                Psychic::get_psychic_result_good(game, actor_ref)
            },
        });
    }
    fn can_night_target(self, _game: &Game, _actor_ref: PlayerReference, _target_ref: PlayerReference) -> bool {
        false
    }
    fn do_day_action(self, _game: &mut Game, _actor_ref: PlayerReference, _target_ref: PlayerReference) {
    
    }
    fn can_day_target(self, _game: &Game, _actor_ref: PlayerReference, _target_ref: PlayerReference) -> bool {
        false
    }
    fn convert_targets_to_visits(self, _game: &Game, _actor_ref: PlayerReference, _target_refs: Vec<PlayerReference>) -> Vec<Visit> {
        vec![]
    }
    fn get_current_send_chat_groups(self, game: &Game, actor_ref: PlayerReference) -> Vec<ChatGroup> {
        crate::game::role::common_role::get_current_send_chat_groups(game, actor_ref, vec![])
    }
    fn get_current_receive_chat_groups(self, game: &Game, actor_ref: PlayerReference) -> Vec<ChatGroup> {
        crate::game::role::common_role::get_current_receive_chat_groups(game, actor_ref)
    }
    fn get_won_game(self, game: &Game, actor_ref: PlayerReference) -> bool {
        crate::game::role::common_role::get_won_game(game, actor_ref)
    }
    fn on_phase_start(self, _game: &mut Game, _actor_ref: PlayerReference, _phase: PhaseType){
    }
    fn on_role_creation(self, _game: &mut Game, _actor_ref: PlayerReference){
    }
    fn on_any_death(self, _game: &mut Game, _actor_ref: PlayerReference, _dead_player_ref: PlayerReference){
    }
    fn on_game_ending(self, _game: &mut Game, _actor_ref: PlayerReference){
    }
}

impl Psychic {
    fn get_psychic_result_evil(game: &Game, actor_ref: PlayerReference)->ChatMessage{
        
        let mut rng = rand::thread_rng();

        let all_non_townies: Vec<_> = Psychic::get_valid_players(game, actor_ref).into_iter()
            .filter(|player_ref|!Psychic::player_is_evil(game, *player_ref)).collect();

        let Some(selected_ref) = all_non_townies.choose(&mut rng) else {return ChatMessage::PsychicFailed};

        let random_players: Vec<PlayerReference> = Psychic::get_valid_players(game, actor_ref).into_iter()
            .filter(|p|p!=selected_ref).collect::<Vec<_>>()
            .choose_multiple(&mut rng, 2).copied().collect();
        
        let Some(random_player0) = random_players.get(0) else {return ChatMessage::PsychicFailed};
        let Some(random_player1) = random_players.get(1) else {return ChatMessage::PsychicFailed};

        let mut out = [selected_ref, random_player0, random_player1];
        out.shuffle(&mut rng);
        ChatMessage::PsychicEvil { players: [out[0].index(), out[1].index(), out[2].index()] }

    }
    fn get_psychic_result_good(game: &Game, actor_ref: PlayerReference)->ChatMessage{
        let mut rng = rand::thread_rng();

        let all_townies: Vec<_> = Psychic::get_valid_players(game, actor_ref).into_iter()
            .filter(|player_ref|!Psychic::player_is_evil(game, *player_ref)).collect();

        let Some(selected_ref) = all_townies.choose(&mut rng) else {return ChatMessage::PsychicFailed};

        let random_players: Vec<_> = Psychic::get_valid_players(game, actor_ref).into_iter()
            .filter(|p|p!=selected_ref).collect::<Vec<_>>();
        
        let Some(random_player) = random_players.choose(&mut rng) else {return ChatMessage::PsychicFailed};

        let mut out = [selected_ref, random_player];
        out.shuffle(&mut rng);
        ChatMessage::PsychicGood { players: [out[0].index(), out[1].index()] }
    }


    fn get_valid_players(game: &Game, actor_ref: PlayerReference)->Vec<PlayerReference>{
        PlayerReference::all_players(game)
            .filter(|player_ref|player_ref.alive(game) && *player_ref!=actor_ref)
            .collect()
    }

    fn player_is_evil(game: &Game, player_ref: PlayerReference)-> bool {
        if player_ref.has_suspicious_aura(game){
            true
        }else if player_ref.has_innocent_aura(game){
            false
        }else{
            player_ref.role(game).faction() != Faction::Town
        }        
    }
}