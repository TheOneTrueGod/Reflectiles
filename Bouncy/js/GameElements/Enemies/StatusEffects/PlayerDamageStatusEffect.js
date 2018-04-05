class PlayerDamageStatusEffect extends StatusEffect {
  constructor(duration, amount) {
    super(duration);
    this.amount = amount;
  }

  isPositive() { return true; }
  isNegative() { return false; }

  turnStart(unit) {

  }

  turnEnd(unit) {
    this.duration -= 1;
  }

  serialize() {
    return {
      'effect_type': this.getEffectType(),
      'duration': this.duration,
      'amount': this.amount,
    };
  }

  getEffectType() {
    return this.constructor.name;
  }
}

PlayerDamageStatusEffect.loadFromServerData = function(server_data) {
  return new PlayerDamageStatusEffect(
    server_data.duration,
    server_data.amount
  );
}

PlayerDamageStatusEffect.AddToTypeMap();
