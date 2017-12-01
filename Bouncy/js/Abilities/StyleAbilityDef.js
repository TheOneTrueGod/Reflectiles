class StyleAbilityDef extends AbilityDef {
  constructor(styleJSON) {
    super({'ability_type': 'StylePlaceholder'});
    this.abilityStyle = AbilityStyle.loadFromJSON(styleJSON);
    this.rawDef = {};
  }
}
