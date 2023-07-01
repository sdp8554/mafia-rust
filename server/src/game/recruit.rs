use serde::{Serialize, Deserialize};


#[derive(Serialize, Deserialize, Clone, PartialEq, Eq)]
pub enum Recruit{
    Mafia,
    Vampire
}

