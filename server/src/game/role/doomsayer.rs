use std::vec;

use serde::{Serialize, Deserialize};

use crate::game::chat::{ChatGroup, ChatMessage};
use crate::game::grave::GraveKiller;
use crate::game::phase::PhaseType;
use crate::game::player::PlayerReference;
use crate::game::role_list::Faction;
use crate::game::visit::Visit;
use crate::game::Game;
use crate::game::team::Team;
use super::jester::Jester;
use super::{Priority, RoleStateImpl, Role, RoleState};

#[derive(Clone, Debug, Serialize, Default)]
pub struct Doomsayer {
    pub guesses: [(PlayerReference, DoomsayerGuess); 3],
    pub won: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub enum DoomsayerGuess{
    Mafia, #[default] Neutral, Vampire,

    Jailor, 
    // No TI
    Doctor, Bodyguard, Crusader, Reveler, Trapper,
    Vigilante, Veteran, Deputy,
    Escort, Medium, Retributionist, Journalist, Mayor, Transporter
}
impl DoomsayerGuess{
    fn convert_to_guess(role: Role)->Option<DoomsayerGuess>{
        match role {
            Role::Jailor => Some(DoomsayerGuess::Jailor),
            Role::Sheriff | Role::Lookout | Role::Spy | Role::Tracker | Role::Seer | Role::Psychic => None, 
            Role::Doctor => Some(DoomsayerGuess::Doctor),
            Role::Bodyguard => Some(DoomsayerGuess::Bodyguard),
            Role::Crusader => Some(DoomsayerGuess::Crusader),
            Role::Reveler => Some(DoomsayerGuess::Reveler),
            Role::Trapper => Some(DoomsayerGuess::Trapper),
            Role::Vigilante => Some(DoomsayerGuess::Vigilante),
            Role::Veteran => Some(DoomsayerGuess::Veteran),
            Role::Deputy => Some(DoomsayerGuess::Deputy),
            Role::Escort => Some(DoomsayerGuess::Escort),
            Role::Medium => Some(DoomsayerGuess::Medium),
            Role::Retributionist => Some(DoomsayerGuess::Retributionist),
            Role::Journalist => Some(DoomsayerGuess::Journalist),
            Role::Mayor => Some(DoomsayerGuess::Mayor),
            Role::Transporter => Some(DoomsayerGuess::Transporter),
            //Mafia
            Role::Godfather | Role::Mafioso | 
            Role::Consort | Role::Blackmailer | Role::Consigliere | 
            Role::Witch | Role::Necromancer |
            Role::Janitor | Role::Framer | Role::Forger => Some(DoomsayerGuess::Mafia),
            //Neutral
            Role::Jester | Role::Executioner | Role::Politician |
            Role::Arsonist | Role::Werewolf | 
            Role::Doomsayer | Role::Death |
            Role::Amnesiac => Some(DoomsayerGuess::Neutral),
            Role::Dracula | Role::Thrall | Role::Renfield => Some(DoomsayerGuess::Vampire),
        }
    }
    fn guess_matches_role(&self, role: Role)->bool{
        if let Some(guess) = Self::convert_to_guess(role) {
            *self == guess
        }else{
            false
        }
    }
}

pub(super) const FACTION: Faction = Faction::Neutral;
pub(super) const MAXIMUM_COUNT: Option<u8> = Some(1);

impl RoleStateImpl for Doomsayer {
    fn defense(&self, _game: &Game, _actor_ref: PlayerReference) -> u8 {0}
    fn team(&self, _game: &Game, _actor_ref: PlayerReference) -> Option<Team> {None}


    fn do_night_action(self, game: &mut Game, actor_ref: PlayerReference, priority: Priority) {
        if priority != Priority::TopPriority {return;}

        if actor_ref.night_roleblocked(game) {return;}
        if !actor_ref.alive(game) {return;}


        let mut won = true;
        for (player, guess) in self.guesses.iter(){
            if 
                *player == actor_ref || //cant guess yourself
                !player.alive(game) || //cant guess dead player
                !guess.guess_matches_role(player.role(game)) || //cant guess wrong
                self.guesses.iter().filter(|(other_p, _other_g)|{
                    *other_p == *player
                }).count() != 1 //cant guess a player more than once
            {
                won = false;
                break;
            }
        };

        if won{
            actor_ref.add_chat_message(game, ChatMessage::DoomsayerWon);
            self.guesses[0].0.try_night_kill(actor_ref, game, GraveKiller::Role(super::Role::Doomsayer), 3, true);
            self.guesses[1].0.try_night_kill(actor_ref, game, GraveKiller::Role(super::Role::Doomsayer), 3, true);
            self.guesses[2].0.try_night_kill(actor_ref, game, GraveKiller::Role(super::Role::Doomsayer), 3, true);
            actor_ref.try_night_kill(actor_ref, game, GraveKiller::Suicide, 3, false);
            actor_ref.set_role_state(game, RoleState::Doomsayer(Doomsayer { guesses: self.guesses, won: true }));
        }else{
            actor_ref.add_chat_message(game, ChatMessage::DoomsayerFailed);
        }
    
    }
    fn do_day_action(self, _game: &mut Game, _actor_ref: PlayerReference, _target_ref: PlayerReference) {
    }
    fn can_night_target(self, _game: &Game, _actor_ref: PlayerReference, _target_ref: PlayerReference) -> bool {
        false
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
    fn get_won_game(self, _game: &Game, _actor_ref: PlayerReference) -> bool {
        self.won
    }
    fn on_phase_start(self, game: &mut Game, actor_ref: PlayerReference, _phase: PhaseType) {
        Doomsayer::check_and_convert_to_jester(game, self, actor_ref);
    }
    fn on_role_creation(self, game: &mut Game, actor_ref: PlayerReference) {
        Doomsayer::check_and_convert_to_jester(game, self, actor_ref);
    }
    fn on_any_death(self, game: &mut Game, actor_ref: PlayerReference, _dead_player_ref: PlayerReference){
        Doomsayer::check_and_convert_to_jester(game, self, actor_ref);
    }
    fn on_game_ending(self, _game: &mut Game, _actor_ref: PlayerReference){
    }
}
impl Doomsayer{
    pub fn check_and_convert_to_jester(game: &mut Game, doomsayer: Doomsayer, actor_ref: PlayerReference){
        if
            !doomsayer.won && actor_ref.alive(game) &&
            PlayerReference::all_players(game).filter(|player|
                player.alive(game) && DoomsayerGuess::convert_to_guess(player.role(game)).is_some() && *player != actor_ref
            ).count() < 3
        {
            actor_ref.set_role(game, RoleState::Jester(Jester::default()));
        }
    }
}