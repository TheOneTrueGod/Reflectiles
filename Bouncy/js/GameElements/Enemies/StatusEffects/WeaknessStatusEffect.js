class WeaknessStatusEffect extends StatusEffect {
  constructor(duration, amount) {
    super(duration, amount);
    this.amount = amount === undefined ? 1.5 : amount;
  }

  isPositive() { return false; }
  isNegative() { return true; }

  turnStart(unit) {

  }

  turnEnd(unit) {
    this.duration -= 1;
  }

  getDamageMultiplier() {
    return this.amount;
  }

  getEffectType() {
    return this.constructor.name;
  }

  serialize() {
    return {
      'effect_type': this.getEffectType(),
      'duration': this.duration,
      'amount': this.amount,
    };
  }

  static addEffectSprite(unit) {
    let sprite = new PIXI.Graphics();
    sprite.position.set(0, 0);
    var color = 0x8F4F58;
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

WeaknessStatusEffect.loadFromServerData = function(server_data) {
  return new WeaknessStatusEffect(
    server_data.duration,
    server_data.amount,
  );
}

WeaknessStatusEffect.AddToTypeMap();
