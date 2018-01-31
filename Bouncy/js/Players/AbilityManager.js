class AbilityManager {
  constructor() {
    this.reinitializeAbilities();
  }

  reinitializeAbilities() {
    AbilityDef.ABILITY_DEF_INDEX = 0;
    AbilityDef.SUB_ABILITY_DEF_INDEX = 0;
    AbilityDef.abilityDefList = {};

    this.tjDeck = TJDeck();
    this.chipDeck = ChipDeck();
    this.tabithaDeck = TabithaDeck();
    this.seanDeck = SeanDeck();
    this.clarenceDeck = ClarenceDeck();
  }

  getAbility(abilityID, perks) {
    let rawDef = AbilityDef.abilityDefList[abilityID].rawDef;
    return AbilityDef.createFromJSON(rawDef);
  }
}

AbilityManager = new AbilityManager();
