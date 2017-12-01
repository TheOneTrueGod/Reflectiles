class FreezeStatusEffect extends StatusEffect {
  constructor(duration) {
    super(duration);
  }

  turnStart(unit) {

  }

  turnEnd(unit) {
    this.duration -= 1;
  }

  getDamageMultiplier() {
    return 0.5;
  }

  getEffectType() {
    return this.constructor.name;
  }
}

FreezeStatusEffect.loadFromServerData = function(server_data) {
  return new FreezeStatusEffect(
    server_data.duration,
  );
}

FreezeStatusEffect.AddToTypeMap();
