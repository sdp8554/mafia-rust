use crate::game::chat::{ChatGroup, ChatMessage};
use crate::game::chat::night_message::NightInformation;
use crate::game::grave::GraveKiller;
use crate::game::phase::PhaseType;
use crate::game::player::{Player, PlayerReference};
use crate::game::role_list::FactionAlignment;
use crate::game::end_game_condition::EndGameCondition;
use crate::game::visit::Visit;
use crate::game::Game;
use crate::game::team::Team;
use super::{Priority, RoleData, Role};

pub(super) const DEFENSE: u8 = 0;
pub(super) const ROLEBLOCKABLE: bool = true;
pub(super) const WITCHABLE: bool = true;
pub(super) const SUSPICIOUS: bool = false;
pub(super) const FACTION_ALIGNMENT: FactionAlignment = FactionAlignment::TownPower;
pub(super) const MAXIUMUM_COUNT: Option<u8> = Some(1);
pub(super) const END_GAME_CONDITION: EndGameCondition = EndGameCondition::Faction;
pub(super) const TEAM: Option<Team> = None;


pub(super) fn do_night_action(game: &mut Game, actor_ref: PlayerReference, priority: Priority) {
    match priority{
        Priority::TopPriority=>{
        }
        Priority::Kill=>{
            if *actor_ref.night_roleblocked(game) {return}
            
            if let Some(visit) = actor_ref.night_visits(game).first(){

                let target_ref = visit.target;
                if *target_ref.night_jailed(game){
                    let killed = target_ref.try_night_kill(game, GraveKiller::Role(Role::Jailor), 3);
        
                    if !killed {
                        actor_ref.push_night_messages(game, NightInformation::TargetSurvivedAttack);
                    }
                }
            }
        }
        _=>{}
    }
}
pub(super) fn can_night_target(game: &Game, actor_ref: PlayerReference, target_ref: PlayerReference) -> bool {
    target_ref.night_jailed(game).clone()
}
pub(super) fn do_day_action(game: &mut Game, actor_ref: PlayerReference, target_ref: PlayerReference) {
    let RoleData::Jailor{ jailed_target_ref } = actor_ref.role_data(game) else {unreachable!()};
    if let Some(old_target_ref) = jailed_target_ref {
        if *old_target_ref == target_ref {
            actor_ref.set_role_data(game, RoleData::Jailor{ jailed_target_ref: None });
        } else {
            actor_ref.set_role_data(game, RoleData::Jailor{ jailed_target_ref: Some(target_ref) })
        }
    } else {
        actor_ref.set_role_data(game, RoleData::Jailor{ jailed_target_ref: Some(target_ref) })
    }
}
pub(super) fn can_day_target(game: &Game, actor_ref: PlayerReference, target_ref: PlayerReference) -> bool {
    actor_ref != target_ref &&
    *actor_ref.alive(game) && *target_ref.alive(game)
}
pub(super) fn convert_targets_to_visits(game: &Game, actor_ref: PlayerReference, target_refs: Vec<PlayerReference>) -> Vec<Visit> {
    crate::game::role::common_role::convert_targets_to_visits(game, actor_ref, target_refs, false, true)
}
pub(super) fn get_current_send_chat_groups(game: &Game, actor_ref: PlayerReference) -> Vec<ChatGroup> {
    crate::game::role::common_role::get_current_send_chat_groups(game, actor_ref, vec![])
}
pub(super) fn get_current_recieve_chat_groups(game: &Game, actor_ref: PlayerReference) -> Vec<ChatGroup> {
    crate::game::role::common_role::get_current_recieve_chat_groups(game, actor_ref)
}
pub(super) fn on_phase_start(game: &mut Game, actor_ref: PlayerReference, phase: PhaseType){
    let RoleData::Jailor{ jailed_target_ref } = actor_ref.role_data(game) else {unreachable!()};
    
    match phase{
        PhaseType::Night=>{
            if let Some(jailed_ref) = jailed_target_ref {
                jailed_ref.clone().set_night_jailed(game, true);
            }
            actor_ref.set_role_data(game, RoleData::Jailor{ jailed_target_ref: None });
        },
        _=>{}
    }
}
pub(super) fn on_role_creation(game: &mut Game, actor_ref: PlayerReference){
    crate::game::role::common_role::on_role_creation(game, actor_ref);
}