class ShieldStatusEffect extends StatusEffect {
  constructor(health) {
    super(1000);
    if (health.current && health.max) {
      this.health = { current: health.current, max: health.max };
    } else {
      this.health = { current: health, max: health };
    }
  }

  isPositive() {
    return true;
  }
  isNegative() {
    return false;
  }

  dealDamage(amount) {
    if (amount >= this.health.current) {
      var health = this.health.current;
      this.health.current = 0;
      return health;
    }

    this.health.current -= amount;
    return amount;
  }

  canBeRefreshed() {
    return this.health.current < this.health.max;
  }

  turnStart(unit) {}

  turnEnd(unit) {}

  readyToDelete() {
    return this.health.current <= 0;
  }

  getEffectType() {
    return this.constructor.name;
  }

  serialize() {
    var superSerial = super.serialize();
    superSerial.health = this.health;
    return superSerial;
  }

  static addEffectSprite(unit) {
    if (!UnitBasic.OUTLINE_FILTER_PURPLE) {
      UnitBasic.OUTLINE_FILTER_PURPLE = new PIXI.filters.OutlineFilter(
        2,
        0xc119b9
      );
    }
    unit.gameSprite.filters = [UnitBasic.OUTLINE_FILTER_PURPLE];
    unit.createHealthBarSprite(unit.gameSprite);
    return null;
  }
}

ShieldStatusEffect.loadFromServerData = function (server_data) {
  return new ShieldStatusEffect(server_data.health);
};

ShieldStatusEffect.AddToTypeMap();
