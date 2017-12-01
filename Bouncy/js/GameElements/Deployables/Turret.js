class Turret extends ZoneEffect {
  constructor(x, y, owner, id, creatorAbilityID, owningPlayerID) {
    super(x, y, owner, id, creatorAbilityID, owningPlayerID);
    this.abilitiesLastUse = {};
    this.aimTarget = {x: this.x, y: this.y - Unit.UNIT_SIZE};
  }

  createSprite() {
    var sprite =
      new PIXI.Sprite(ImageLoader.getSquareTexture('deployables', 2));

    this.turretSprite =
      new PIXI.Sprite(ImageLoader.getSquareTexture('deployables',
        this.creatorAbility.getOptionalParam("turret_image", 3)
      ));

    sprite.addChild(this.turretSprite);
    this.turretSprite.anchor.set(0.5);
    sprite.anchor.set(0.5);
    this.createHealthBarSprite(sprite);
    this.setAimTarget(this.aimTarget);

    sprite.width = Unit.UNIT_SIZE;
    sprite.height = Unit.UNIT_SIZE;

    this.spriteScale = {x: sprite.scale.x, y: sprite.scale.y};

    return sprite;
  }

  dealDamage(boardState, amount) {
    return;
  }
  
  reduceCooldown() {
    var abilList = this.creatorAbility.getOptionalParam('unit_abilities', {});
    for (var i = 0; i < abilList.length; i++) {
      let abil = abilList[i].initializedAbilDef;
      this.abilitiesLastUse[abil.index] -= 1;
    }
  }
  
  doShootAction(boardState) {
    var abilList = this.creatorAbility.getOptionalParam('unit_abilities', {});
    for (var i = 0; i < abilList.length; i++) {
      let abil = abilList[i].initializedAbilDef;
      if (
        abil.index in this.abilitiesLastUse &&
        abil.chargeType == AbilityDef.CHARGE_TYPES.TURNS &&
        boardState.turn - this.abilitiesLastUse[abil.index] < abil.maxCharge
      ) {
        continue;
      }

      var angle = Math.atan2(this.aimTarget.y - this.y, this.aimTarget.x - this.x);
      var angX = Math.cos(angle) * 22;
      var angY = Math.sin(angle) * 22;
      var castPoint = new Victor(
        this.x + angX,
        this.y + angY
      );

      abilList[i].initializedAbilDef.doActionOnTick(this.owningPlayerID, 0, boardState, castPoint, this.aimTarget);
      this.abilitiesLastUse[abil.index] = boardState.turn;
    }
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (phase === TurnPhasesEnum.ALLY_ACTION) {
      this.doShootAction(boardState);
    }
  }

  getSize() {
    return this.size;
  }

  triggerHit(boardState, unit, intersection, projectile) {
    var projectileInteraction = this.creatorAbility.getOptionalParam(
      "projectile_interaction", null);

    if (projectileInteraction.destroy) {
      this.decreaseTime(boardState, this.timeLeft.current);
      this.createHealthBarSprite(this.gameSprite);
      projectile.readyToDel = true;
    }
  }

  setCreatorAbility(creatorAbilityID) {
    this.creatorAbility = AbilityDef.abilityDefList[creatorAbilityID];
    this.size = {
      left: 0, right: 0,
      top: 0, bottom: 0
    };
  }

  setAimTarget(targetPoint) {
    this.aimTarget = {x: targetPoint.x, y: targetPoint.y};

    if (this.turretSprite) {
      var angle = Math.atan2(this.aimTarget.y - this.y, this.aimTarget.x - this.x);
      this.turretSprite.rotation = angle + Math.PI / 2;
    }
  }

  otherUnitEntering(boardState, unit) {
    this.readyToDel = true;
    EffectFactory.createUnitDyingEffect(boardState, this);
    return true;
  }

  serializeData() {
    var serialized = super.serializeData();
    serialized.abilities_used = this.abilitiesLastUse;
    serialized.aim_target = this.aimTarget;

    return serialized;
  }

  loadSerializedData(data) {
    super.loadSerializedData(data);

    this.abilitiesLastUse = data.abilities_used;
    this.setAimTarget(data.aim_target);
  }
}

Turret.AddToTypeMap();
