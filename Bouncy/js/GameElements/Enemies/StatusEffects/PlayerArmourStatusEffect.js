class PlayerArmourStatusEffect extends StatusEffect {
  constructor(duration, amount) {
    super(duration);
    this.armourAmount = amount;
  }

  isPositive() {
    return true;
  }
  isNegative() {
    return false;
  }

  dealDamage(amount) {
    if (amount >= this.armourAmount) {
      var health = this.armourAmount;
      this.armourAmount = 0;
      return amount - health;
    }

    this.armourAmount -= amount;
    return 0;
  }

  turnStart(unit) {}

  turnEnd(unit) {
    this.duration -= 1;
  }

  serialize() {
    return {
      effect_type: this.getEffectType(),
      duration: this.duration,
      amount: this.amount,
    };
  }

  getEffectType() {
    return this.constructor.name;
  }
}

PlayerArmourStatusEffect.loadFromServerData = function (server_data) {
  return new PlayerArmourStatusEffect(server_data.duration, server_data.amount);
};

PlayerArmourStatusEffect.AddToTypeMap();
