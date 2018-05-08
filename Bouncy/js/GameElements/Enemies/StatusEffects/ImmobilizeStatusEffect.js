class ImmobilizeStatusEffect extends StatusEffect {
  constructor(duration, abilityID) {
    super(duration, abilityID);
  }

  isPositive() { return false; }
  isNegative() { return true; }

  turnStart(unit) {

  }

  turnEnd(unit) {
    this.duration -= 1;
  }

  getEffectType() {
    return this.constructor.name;
  }
}

ImmobilizeStatusEffect.loadFromServerData = function(server_data) {
  return new ImmobilizeStatusEffect(
    server_data.duration,
    server_data.ability_id,
  );
}

ImmobilizeStatusEffect.AddToTypeMap();
