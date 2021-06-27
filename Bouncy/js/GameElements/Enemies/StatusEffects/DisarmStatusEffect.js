class DisarmStatusEffect extends StatusEffect {
  constructor(duration, abilityID) {
    super(duration, abilityID);
  }

  isPositive() { return false; }
  isNegative() { return true; }

  turnStart(unit) {

  }

  turnEnd(unit) {
    this.duration -= 1;
  }

  getEffectType() {
    return this.constructor.name;
  }

  static addEffectSprite(unit) {
    let sprite = new PIXI.Graphics();
    sprite.position.set(-unit.physicsWidth / 2, -unit.physicsHeight / 2);
    sprite.lineStyle(3, 0x0000FF)
       .moveTo(0, 0)
       .lineTo(unit.physicsWidth, unit.physicsHeight)
       .moveTo(unit.physicsWidth, 0)
       .lineTo(0, unit.physicsHeight)
       .moveTo(0, 0)
       .lineTo(unit.physicsWidth, 0)
       .lineTo(unit.physicsWidth, unit.physicsHeight)
       .lineTo(0, unit.physicsHeight)
       .lineTo(0, 0);
    if (unit.gameSprite.children.length > 0) {
      unit.gameSprite.addChildAt(sprite, unit.gameSprite.children.length - 1);
    } else {
      unit.gameSprite.addChild(sprite);
    }

    return sprite;
  }
}

DisarmStatusEffect.loadFromServerData = function(server_data) {
  return new DisarmStatusEffect(
    server_data.duration,
    server_data.ability_id,
  );
}

DisarmStatusEffect.AddToTypeMap();
