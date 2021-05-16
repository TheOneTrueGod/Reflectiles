class PoisonStatusEffect extends StatusEffect {
  constructor(duration, damage, effect, playerID, abilityID) {
    super(duration, abilityID);
    this.damage = damage;
    this.effectList = {};
    this.effectList[abilityID] = {
      abilityID: abilityID,
      playerID: playerID,
      damage: damage,
    };
    this.effect = effect;
    this.playerID = playerID;
    this.abilityID = abilityID;
    this.duration = 99999;
  }

  isPositive() { return false; }
  isNegative() { return true; }

  turnStart(boardState, unit) {
    let damageMult = this.getDamageMultiplier();
    const hasDeadlyPoison = unit.hasStatusEffectByName(SpecialStatusEffect.SPECIAL_EFFECTS.DEADLY_POISON);
    if (damageMult != 0) {
      for (var abilityID in this.effectList) {
        let damage = this.effectList[abilityID].damage;
        unit.dealDamage(boardState, damage / damageMult, this.effectList[abilityID], Unit.DAMAGE_TYPE.POISON);
        if (!hasDeadlyPoison) {
          this.effectList[abilityID].damage = Math.ceil(this.effectList[abilityID].damage / 2);
        }
      }
    }
    this.duration -= 1;
  }

  getRemainingDamage() {
    let totalDamage = 0;
    for (var abilityID in this.effectList) {
      totalDamage += this.effectList[abilityID].damage;
    }
    return totalDamage;
  }

  mergeWithOtherEffect(otherEffect) {
    if (
      this.effectList[otherEffect.abilityID] &&
      this.effectList[otherEffect.abilityID].damage > otherEffect.effectList[otherEffect.abilityID].damage
    ) {
      return this;
    }
    this.effectList[otherEffect.abilityID] = otherEffect.effectList[otherEffect.abilityID];
    return this;
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
      'effect_data': this.serializeEffectData(),
    };
  }

  serializeEffectData() {
    const serialized = {};
    Object.keys(this.effectList).forEach((key) => {
      serialized[key] = { ...this.effectList[key] };
    })
    return serialized;
  }

  deserializeEffectData(serializedEffectData) {
    this.effectList = serializedEffectData;
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
  let poisonStatusEffect = new PoisonStatusEffect(
    server_data.duration,
    server_data.damage,
    server_data.effect,
    server_data.player_id,
    server_data.ability_id,
  );
  poisonStatusEffect.deserializeEffectData(server_data.effect_data);
  return poisonStatusEffect;
}

PoisonStatusEffect.AddToTypeMap();
