use serde::{Serialize, Deserialize};

use crate::game::chat::{ChatGroup, ChatMessage};
use crate::game::chat::night_message::NightInformation;
use crate::game::phase::PhaseType;
use crate::game::player::{Player, PlayerReference};
use crate::game::role_list::FactionAlignment;
use crate::game::end_game_condition::EndGameCondition;
use crate::game::visit::Visit;
use crate::game::Game;
use crate::game::team::Team;
use super::Priority;
use super::Role;

pub(super) const DEFENSE: u8 = 0;
pub(super) const ROLEBLOCKABLE: bool = true;
pub(super) const WITCHABLE: bool = true;
pub(super) const SUSPICIOUS: bool = false;
pub(super) const FACTION_ALIGNMENT: FactionAlignment = FactionAlignment::TownInvestigative;
pub(super) const MAXIUMUM_COUNT: Option<u8> = None;
pub(super) const END_GAME_CONDITION: EndGameCondition = EndGameCondition::Faction;
pub(super) const TEAM: Option<Team> = None;

#[derive(Debug, PartialEq, Eq, Clone, Serialize, Deserialize)]
pub enum InvestigativeResult{
    VigilanteVeteranMafiosoPirateAmbusher,
    MediumJanitorRetributionistNecromancerTrapper,
    AmnesiacMedusaPsychic,
    SpyBlackmailerJailorVoodooMaster,
    SheriffExecutionerWerewolf,
    FramerVampireJesterHexMaster,
    LookoutForgerWitchCovenLeader,
    EscortTransportConsortHypnotist,
    DoctorDisguiserSerialKiller,
    InvestigatorConsigliereMayor,
    BodyguardGodfatherArsonistCrusader,
}

pub(super) fn do_night_action(game: &mut Game, actor_ref: PlayerReference, priority: Priority) {
    if *actor_ref.night_jailed(game) {return;}
    if *actor_ref.night_roleblocked(game) {return;}
    if priority != Priority::Investigative {return;}

    if let Some(visit) = actor_ref.night_visits(game).first(){
        
        if *visit.target.night_jailed(game){
            actor_ref.push_night_messages(game, NightInformation::TargetJailed );
            return
        }

        //TODO, Frames, Hexes, Douses, Enchants
        let result = match visit.target.role(game){
            Role::Jailor => InvestigativeResult::SpyBlackmailerJailorVoodooMaster,
            Role::VoodooMaster => InvestigativeResult::SpyBlackmailerJailorVoodooMaster,

            Role::Sheriff => InvestigativeResult::SheriffExecutionerWerewolf,

            Role::Investigator => InvestigativeResult::InvestigatorConsigliereMayor,

            Role::Doctor => InvestigativeResult::DoctorDisguiserSerialKiller,

            Role::Veteran => InvestigativeResult::VigilanteVeteranMafiosoPirateAmbusher,
            Role::Mafioso => InvestigativeResult::VigilanteVeteranMafiosoPirateAmbusher,

            Role::Consort => InvestigativeResult::EscortTransportConsortHypnotist,

            Role::CovenLeader => InvestigativeResult::LookoutForgerWitchCovenLeader,
        };

        let message = NightInformation::InvestigatorResult { result };
        
        actor_ref.push_night_messages(game, message);
    }
}
pub(super) fn can_night_target(game: &Game, actor_ref: PlayerReference, target_ref: PlayerReference) -> bool {
    crate::game::role::common_role::can_night_target(game, actor_ref, target_ref)
}
pub(super) fn do_day_action(game: &mut Game, actor_ref: PlayerReference, target_ref: PlayerReference) {
    
}
pub(super) fn can_day_target(game: &Game, actor_ref: PlayerReference, target_ref: PlayerReference) -> bool {
    false
}
pub(super) fn convert_targets_to_visits(game: &Game, actor_ref: PlayerReference, target_refs: Vec<PlayerReference>) -> Vec<Visit> {
    crate::game::role::common_role::convert_targets_to_visits(game, actor_ref, target_refs, false, false)
}
pub(super) fn get_current_send_chat_groups(game: &Game, actor_ref: PlayerReference) -> Vec<ChatGroup> {
    crate::game::role::common_role::get_current_send_chat_groups(game, actor_ref, vec![])
}
pub(super) fn get_current_recieve_chat_groups(game: &Game, actor_ref: PlayerReference) -> Vec<ChatGroup> {
    crate::game::role::common_role::get_current_recieve_chat_groups(game, actor_ref)
}
pub(super) fn on_phase_start(game: &mut Game, actor_ref: PlayerReference, phase: PhaseType){
}
pub(super) fn on_role_creation(game: &mut Game, actor_ref: PlayerReference){
    crate::game::role::common_role::on_role_creation(game, actor_ref);
}