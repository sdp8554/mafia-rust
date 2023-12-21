
use serde::Serialize;

use crate::game::chat::ChatMessage;
use crate::game::chat::ChatGroup;
use crate::game::grave::GraveRole;
use crate::game::phase::PhaseType;
use crate::game::player::PlayerReference;
use crate::game::role_list::FactionAlignment;
use crate::game::end_game_condition::EndGameCondition;
use crate::game::visit::Visit;
use crate::game::team::Team;
use crate::game::Game;
use super::Role;
use super::{Priority, RoleState, RoleStateImpl};


#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Forger {
    forges_remaining: u8,
    forged_ref: Option<PlayerReference>,

    forged_will: String,
    forged_role: Role,
}

impl Default for Forger {
    fn default() -> Self {
        Forger {
            forges_remaining: 2,
            forged_ref: None,

            forged_role: Role::Jester,
            forged_will: "".to_owned(),
        }
    }
}

pub(super) const FACTION_ALIGNMENT: FactionAlignment = FactionAlignment::MafiaDeception;
pub(super) const MAXIMUM_COUNT: Option<u8> = Some(1);

impl RoleStateImpl for Forger {
    fn suspicious(&self, _game: &Game, _actor_ref: PlayerReference) -> bool {true}
    fn defense(&self, _game: &Game, _actor_ref: PlayerReference) -> u8 {0}
    fn control_immune(&self, _game: &Game, _actor_ref: PlayerReference) -> bool {false}
    fn roleblock_immune(&self, _game: &Game, _actor_ref: PlayerReference) -> bool {false}
    fn end_game_condition(&self, _game: &Game, _actor_ref: PlayerReference) -> EndGameCondition {EndGameCondition::Mafia}
    fn team(&self, _game: &Game, _actor_ref: PlayerReference) -> Option<Team> {Some(Team::Mafia)}


    fn do_night_action(self, game: &mut Game, actor_ref: PlayerReference, priority: Priority) {
        if actor_ref.night_jailed(game) {return}

        if self.forges_remaining == 0 {return}

        match priority {
            Priority::Deception=>{
                let Some(visit) = actor_ref.night_visits(game).first() else{return};

                let target_ref = visit.target;
                if target_ref.night_jailed(game) {
                    actor_ref.push_night_message(game, ChatMessage::TargetJailed);
                }else{
                    target_ref.set_night_grave_role(game, GraveRole::Role(self.forged_role));
                    target_ref.set_night_grave_will(game, self.forged_will.clone());
                    actor_ref.set_role_state(game, RoleState::Forger(
                        Forger{ 
                            forges_remaining: self.forges_remaining - 1, 
                            forged_ref: Some(target_ref),

                            forged_will: self.forged_will,
                            forged_role: self.forged_role,
                        }
                    ));
                }
            },
            Priority::Investigative=>{
                if let Some(forged_ref) = self.forged_ref {
                    if forged_ref.night_died(game) {
                        actor_ref.push_night_message(game, ChatMessage::PlayerRoleAndWill{
                            role: forged_ref.role(game),
                            will: forged_ref.will(game).to_string(),
                        });
                    }
                }
            },
            _ => {}
        }
    }
    fn can_night_target(self, game: &Game, actor_ref: PlayerReference, target_ref: PlayerReference) -> bool {
        crate::game::role::common_role::can_night_target(game, actor_ref, target_ref) && self.forges_remaining > 0
    }
    fn do_day_action(self, _game: &mut Game, _actor_ref: PlayerReference, _target_ref: PlayerReference) {
        
    }
    fn can_day_target(self, _game: &Game, _actor_ref: PlayerReference, _target_ref: PlayerReference) -> bool {
        false
    }
    fn convert_targets_to_visits(self, game: &Game, actor_ref: PlayerReference, target_refs: Vec<PlayerReference>) -> Vec<Visit> {
        crate::game::role::common_role::convert_targets_to_visits(game, actor_ref, target_refs, false, false)
    }
    fn get_current_send_chat_groups(self, game: &Game, actor_ref: PlayerReference) -> Vec<ChatGroup> {
        crate::game::role::common_role::get_current_send_chat_groups(game, actor_ref, vec![ChatGroup::Mafia])
    }
    fn get_current_receive_chat_groups(self, game: &Game, actor_ref: PlayerReference) -> Vec<ChatGroup> {
        crate::game::role::common_role::get_current_receive_chat_groups(game, actor_ref)
    }
    fn get_won_game(self, game: &Game, actor_ref: PlayerReference) -> bool {
        crate::game::role::common_role::get_won_game(game, actor_ref)
    }
    fn on_phase_start(self, game: &mut Game, actor_ref: PlayerReference, _phase: PhaseType){
        actor_ref.set_role_state(game, RoleState::Forger(
            Forger{
                forges_remaining: self.forges_remaining, 
                forged_ref: None,
                forged_will: self.forged_will,
                forged_role: self.forged_role,
            }));
    }
    fn on_role_creation(self, _game: &mut Game, _actor_ref: PlayerReference){
        
    }
    fn on_any_death(self, _game: &mut Game, _actor_ref: PlayerReference, _dead_player_ref: PlayerReference){
    }
    fn on_game_ending(self, _game: &mut Game, _actor_ref: PlayerReference){
    }
}
