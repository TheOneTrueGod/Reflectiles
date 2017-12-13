class PoisonStatusEffect extends StatusEffect {
  constructor(duration, damage, effect, playerID, abilityID) {
    super(duration);
    this.damage = damage;
    this.effect = effect;
    this.playerID = playerID;
    this.abilityID = abilityID;
  }

  turnStart(boardState, unit) {
    if (this.getDamageMultiplier() != 0) {
      unit.dealDamage(boardState, this.damage / this.getDamageMultiplier(), this);
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
      'effect': this.effect,
      'player_id': this.playerID,
      'ability_id': this.abilityID,
    };
  }
}

PoisonStatusEffect.loadFromServerData = function(server_data) {
  return new PoisonStatusEffect(
    server_data.duration,
    server_data.damage,
    server_data.effect,
    server_data.player_id,
    server_data.ability_id,
  );
}

PoisonStatusEffect.AddToTypeMap();
