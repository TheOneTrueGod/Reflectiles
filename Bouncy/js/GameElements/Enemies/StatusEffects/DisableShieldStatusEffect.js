class DisableShieldStatusEffect extends StatusEffect {
  constructor(duration) {
    super(duration, 0);
  }

  isPositive() { return false; }
  isNegative() { return true; }

  turnStart(unit) {

  }

  turnEnd(boardState, unit) {
    this.duration -= 1;
  }

  getEffectType() {
    return this.constructor.name;
  }

  serialize() {
    return {
      'effect_type': this.getEffectType(),
      'duration': this.duration,
    };
  }

  static addEffectSprite(unit) {
    return null;
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

DisableShieldStatusEffect.loadFromServerData = function(server_data) {
  return new DisableShieldStatusEffect(server_data.duration);
}

DisableShieldStatusEffect.AddToTypeMap();
