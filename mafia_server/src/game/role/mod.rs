#[macro_use]
mod macros;

// Creates the Role enum
make_role_enum! {
    Consigliere : consigliere,
    Consort : consort,
    Doctor : doctor,
    Escort : escort,
    Godfather : godfather,
    Sheriff : sheriff,
    Veteran : veteran {
        alerts_remaining: u8 = 3
    },
    Vigilante : vigilante {
        bullets_remaining: u8 = 3,
        killed_townie: bool = false
    }
}

 /*
 new code

 visit objects created
key
    nv = no visit
    av = astral visit
    v = visit
    
    +1: Jester(Kill, av) Vigilante(Suicide, nv) Arsonist(Clear self, nv) Vampire(Choose Leader, nv) Witch(Activate sheild, nv) Veteran(Decide, av) Retributionist(Decide and witch, av, av) //non transportable or witchable
 +2: Transporter(Swaps, v, v)
 +3: Witch(Swap, v, av) 
 +4: Escort/Consort(Roleblock, v)
 +5: Godfather("witch mafioso if not rbd, unwitch self", av)
 +6: Doctor(Heal, v) Bodyguard("Witch attacker", v) //all attacks should happen after this
 +7: Blackmailer, Arsonist(Douse&visitors, v&nv), Framer(Frame&visitors, v&nv), Disguiser("Swap", v, v) Werewolf("unframe", nv) Forger(Frame, v) Janitor(Frame, v)   //investigations happen after this
 +8: Invest, Sheriff, Lookout, Tracker, Consig
 +9: Mafioso/Godfather/Sk/Ww/Vet/Vig/Vamp/Arso/Bg/Vig("Kill")
 +10: Doc(Notify both, nv) Bg(Notify both, nv) Janitor(notify, nv), Forger(notify, nv) Vamp(Inform Leader & new vamp, nv) Arsonist(Inform who is doused, nv)
 +11: Exe/Amne/Vamp(Convert), spy(bug, v)
 +12: Witch(bug)
 
 */

 /*
old code
-12: Veteran(Decides Alert) Vigilante(Suicide) Jester(Kill) Arsonist(Clean self) Vampire(Choose Leader)
-10: Transporter(Swaps)
-8: Witch(Swaps, Activate sheild)
    -7: Retributionist(Choose to revive)
-6: Escort / Consort(Roleblock)
-4: Godfather(Swap mafioso target and clear self)
-2 bodyguard(swap)
 0: visits happen here
+2: Doctor(Heal), Blackmailer(Decide), Crusader(Heal), Arsonist(Douse), Framer, Disguiser Werewolf(innos themself)
+4: Sheriff, Invest, Consig, Lookout, Tracker, Arsonist(Find who visited)
+6: Mafioso/Godfather, SerialKiller, Werewolf, Veteran, Vampire, Arsonist, Crusader, Bodyguard, Vigilante (All kill)
+8: Forger(Change info), Janitor(Clean & info), Doctor(Notify) Bodyguard(Notify) 
+10: Spy(Collect info) Vampire(Inform of leader) Arsonist(Inform who is doused)
    +11: Amnesiac(Convert) Vampire(Convert) Executioner(convert)
+12: Witch(Steal info & Remove sheild)
 */