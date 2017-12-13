class InfectStatusEffect extends StatusEffect {
  constructor(duration, abilityDefIndex, playerID) {
    super(duration);
    this.abilityDefIndex = abilityDefIndex;
    this.playerID = playerID;
  }

  getEffectType() {
    return this.constructor.name;
  }

  onUnitDeleting(boardState, unit) {
    if (!unit.isAlive()) {
      var abilityDef = AbilityDef.abilityDefList[this.abilityDefIndex];
      abilityDef.doActionOnTick(this.playerID, 0, boardState, unit, unit);
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
      'ability_def_index': this.abilityDefIndex,
      'player_id': this.playerID,
    };
  }
}

InfectStatusEffect.loadFromServerData = function(server_data) {
  return new InfectStatusEffect(
    server_data.duration,
    server_data.ability_def_index,
    server_data.player_id,
  );
}

InfectStatusEffect.AddToTypeMap();
