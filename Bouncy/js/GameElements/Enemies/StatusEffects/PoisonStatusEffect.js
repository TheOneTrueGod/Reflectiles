class PoisonStatusEffect extends StatusEffect {
  constructor(duration, damage, effect) {
    super(duration);
    this.damage = damage;
    this.effect = effect;
  }

  turnStart(boardState, unit) {
    if (this.getDamageMultiplier() != 0) {
      unit.dealDamage(boardState, this.damage / this.getDamageMultiplier());
    }
    this.duration -= 1;
  }

  getDamageMultiplier() {
    return 1;
  }

  getEffectType() {
    return this.constructor.name;
  }

  serialize() {
    return {
      'effect_type': this.getEffectType(),
      'duration': this.duration,
      'damage': this.damage,
      'effect': this.effect
    };
  }
}

PoisonStatusEffect.loadFromServerData = function(server_data) {
  return new PoisonStatusEffect(
    server_data.duration,
    server_data.damage,
    server_data.effect,
  );
}

PoisonStatusEffect.AddToTypeMap();
