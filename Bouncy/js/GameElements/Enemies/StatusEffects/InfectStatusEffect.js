class InfectStatusEffect extends StatusEffect {
  constructor(duration, abilityDefIndex, playerID) {
    super(duration);
    this.abilityDefIndex = abilityDefIndex;
    this.playerID = playerID;
  }

  getEffectType() {
    return this.constructor.name;
  }

  onUnitDeleting(boardState, unit) {
    if (!unit.isAlive()) {
      var abilityDef = AbilityDef.abilityDefList[this.abilityDefIndex];
      abilityDef.doActionOnTick(this.playerID, 0, boardState, unit, unit);
    }
  }

  turnStart(unit) {}

  startOfPhase(boardState, phase, unit) {
    if (phase == TurnPhasesEnum.END_OF_TURN) {
      this.duration -= 1;
    }
  }

  serialize() {
    return {
      'effect_type': this.constructor.name,
      'duration': this.duration,
      'ability_def_index': this.abilityDefIndex,
      'player_id': this.playerID,
    };
  }

  static addEffectSprite(unit) {
    let sprite = new PIXI.Graphics();
    sprite.position.set(0, 0);
    var color = 0x6F256F;
    var alpha = 0.5;
    sprite.beginFill(color, alpha).lineStyle(0, 0, 1);

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

InfectStatusEffect.loadFromServerData = function(server_data) {
  return new InfectStatusEffect(
    server_data.duration,
    server_data.ability_def_index,
    server_data.player_id,
  );
}

InfectStatusEffect.AddToTypeMap();
