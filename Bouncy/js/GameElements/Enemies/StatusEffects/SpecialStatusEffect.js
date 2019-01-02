class SpecialStatusEffect extends StatusEffect {
  constructor(duration, specialType) {
    super(duration, 0);
    this.specialType = specialType;
  }

  isPositive() { return false; }
  isNegative() { return true; }

  turnEnd(boardState, unit) {
    this.duration -= 1;
  }

  getEffectType() {
    return this.specialType;
  }

  serialize() {
    return {
      'effect_type': this.constructor.name,
      'special_type': this.specialType,
      'duration': this.duration,
    };
  }

  static addEffectSprite(unit) {
    return null;
  }
}

// When adding to this;  Modify isPositive or isNegative.
SpecialStatusEffect.SPECIAL_EFFECTS = {
  DISABLE_SHIELD: 'DISABLE_SHIELD',
  DEADLY_POISON: 'DEADLY_POISON',
}

SpecialStatusEffect.loadFromServerData = function(server_data) {
  return new SpecialStatusEffect(server_data.duration, server_data.special_type);
}

SpecialStatusEffect.AddToTypeMap();
