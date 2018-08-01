class AbilityManager {
  constructor() {
    this.reinitializeAbilities();
  }

  reinitializeAbilities() {
    AbilityDef.ABILITY_DEF_INDEX = 0;
    AbilityDef.SUB_ABILITY_DEF_INDEX = 0;
    AbilityDef.abilityDefList = {};
  }

  getAbility(playerCard) {
    let rawDef = AbilityDef.abilityDefList[playerCard.cardID].rawDef;
    return AbilityDef.createFromJSON(rawDef);
  }
}

AbilityManager = new AbilityManager();
