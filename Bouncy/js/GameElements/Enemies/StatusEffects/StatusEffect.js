class StatusEffect {
  constructor(duration, abilityID) {
    this.duration = duration;
    this.abilityID = abilityID;
    this.durationIncreased = 0;
  }

  startOfPhase(boardState, phase, unit) {
  }

  increaseDuration(amount) {
    if (amount > this.durationIncreased) {
      let amountToIncrease = amount - this.durationIncreased;
      this.durationIncreased = amountToIncrease;
      this.duration += amountToIncrease;
    }
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

  isPositive() {
    console.warn("Status effect didn't override isPositive.", this);
    return false;
  }

  isNegative() {
    console.warn("Status effect didn't override isNegative.", this);
    return false;
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
      'duration_increased': this.durationIncreased,
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
      let newEffect = EffectClass.loadFromServerData(serverData);
      newEffect.durationIncreased = serverData.duration_increased;
      return newEffect;
    }
  }
  throw new Error("No effect type when creating status effect.  No idea what to do.");
}

StatusEffect.StatusEffectTypeMap = {
};
StatusEffect.AddToTypeMap = function() {
  StatusEffect.StatusEffectTypeMap[this.name] = this;
}
