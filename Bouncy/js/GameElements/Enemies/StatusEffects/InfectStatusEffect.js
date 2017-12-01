class InfectStatusEffect extends StatusEffect {
  constructor(duration, abilityDefIndex) {
    super(duration);
    this.abilityDefIndex = abilityDefIndex;
  }

  getEffectType() {
    return this.constructor.name;
  }

  onUnitDeleting(boardState, unit) {
    if (!unit.isAlive()) {
      var abilityDef = AbilityDef.abilityDefList[this.abilityDefIndex];
      abilityDef.doActionOnTick(null, 0, boardState, unit, unit);
    }
  }

  turnStart(unit) {}

  startOfPhase(boardState, phase, unit) {
    if (phase == TurnPhasesEnum.END_OF_TURN) {
      this.duration -= 1;
    }
  }

  serialize() {
    return {
      'effect_type': this.constructor.name,
      'duration': this.duration,
      'ability_def_index': this.abilityDefIndex
    };
  }
}

InfectStatusEffect.loadFromServerData = function(server_data) {
  return new InfectStatusEffect(
    server_data.duration,
    server_data.ability_def_index,
  );
}

InfectStatusEffect.AddToTypeMap();
