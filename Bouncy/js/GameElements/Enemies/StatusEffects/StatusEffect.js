class StatusEffect {
  constructor(duration, abilityID) {
    this.duration = duration;
    this.abilityID = abilityID;
  }

  startOfPhase(boardState, phase, unit) {
  }

  readyToDelete() {
    return this.duration <= 0;
  }

  turnStart(unit) {
    this.duration -= 1;
  }

  getDamageMultiplier() {
    return 1;
  }

  turnEnd(unit) {

  }

  onUnitDeleting(boardState, unit) {
    if (!unit.isAlive() && this.abilityID) {
      var abilityDef = AbilityDef.abilityDefList[this.abilityID];
      if (abilityDef) {
        abilityDef.onStatusEffectUnitDying(boardState, unit, this);
      }
    }
  }

  serialize() {
    return {
      'effect_type': this.getEffectType(),
      'ability_id': this.abilityID,
      'duration': this.duration,
      'ability_id': this.abilityID,
    };
  }
}

StatusEffect.getEffectType = function() {
  return this.name;
}

StatusEffect.fromServerData = function(serverData) {
  if (serverData.effect_type) {
    var EffectClass = null;
    if (!(serverData.effect_type in StatusEffect.StatusEffectTypeMap)) {
      alert(serverData.effect_type + " not in Unit.StatusEffectTypeMap.");
    } else {
      EffectClass = StatusEffect.StatusEffectTypeMap[serverData.effect_type];
    }
    if (EffectClass) {
      return EffectClass.loadFromServerData(serverData);
    }
  }
  throw new Error("No effect type when creating status effect.  No idea what to do.");
}

StatusEffect.StatusEffectTypeMap = {
};
StatusEffect.AddToTypeMap = function() {
  StatusEffect.StatusEffectTypeMap[this.name] = this;
}
