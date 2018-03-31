class PoisonStatusEffect extends StatusEffect {
  constructor(duration, damage, effect, playerID, abilityID) {
    super(duration, abilityID);
    this.damage = damage;
    this.effect = effect;
    this.playerID = playerID;
  }

  turnStart(boardState, unit) {
    if (this.getDamageMultiplier() != 0) {
      unit.dealDamage(boardState, this.damage / this.getDamageMultiplier(), this, Unit.DAMAGE_TYPE.POISON);
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

  static addEffectSprite(unit) {
    let sprite = new PIXI.Graphics();
    sprite.position.set(0, 0);
    var color = 0x00AA00;
    var alpha = 0.5;
    sprite.lineStyle(0, 0, 0)
      .beginFill(color, alpha);

    var path = [];
    for (var i = 0; i < unit.collisionBox.length; i++) {
      path.push(new PIXI.Point(
        unit.collisionBox[i].x1 / unit.gameSprite.scale.x,
        unit.collisionBox[i].y1 / unit.gameSprite.scale.y
      ));
    }

    sprite.drawPolygon(path);
    unit.gameSprite.addChildAt(sprite, 0);
    return sprite;
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
