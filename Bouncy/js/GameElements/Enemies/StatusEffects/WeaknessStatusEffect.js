class WeaknessStatusEffect extends StatusEffect {
  constructor(duration) {
    super(duration);
  }

  turnStart(unit) {

  }

  turnEnd(unit) {
    this.duration -= 1;
  }

  getDamageMultiplier() {
    return 1.5;
  }

  getEffectType() {
    return this.constructor.name;
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
  );
}

WeaknessStatusEffect.AddToTypeMap();
