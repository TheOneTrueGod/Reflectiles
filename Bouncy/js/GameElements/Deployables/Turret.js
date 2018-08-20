class Turret extends ZoneEffect {
  constructor(x, y, owner, id, creatorAbilityID, owningPlayerID) {
    super(x, y, owner, id, creatorAbilityID, owningPlayerID);
    this.abilitiesLastUse = {};
    this.aimTarget = null;
    this.forceAimTarget = null;
  }

  createSprite(hideHealthBar) {
    var sprite =
      new PIXI.Sprite(ImageLoader.getSquareTexture('deployables', 2));

    this.turretSprite =
      new PIXI.Sprite(ImageLoader.getSquareTexture('deployables',
        this.creatorAbility.getOptionalParam("turret_image", 3)
      ));

    sprite.addChild(this.turretSprite);
    this.turretSprite.anchor.set(0.5);
    sprite.anchor.set(0.5);
    if (!hideHealthBar) {
      this.createHealthBarSprite(sprite);
    }
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

      let aimTarget = this.getAimTarget(boardState);
      this.setAimTargetGraphic(aimTarget);
      var angle = Math.atan2(aimTarget.y - this.y, aimTarget.x - this.x);
      var angX = Math.cos(angle) * 19;
      var angY = Math.sin(angle) * 19;
      var castPoint = new Victor(
        this.x + angX,
        this.y + angY
      );

      abilList[i].initializedAbilDef.doActionOnTick(this.owningPlayerID, 0, boardState, castPoint, aimTarget);
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

  hitByProjectile(boardState, unit, intersection, projectile) {
    if (!this.creatorAbility.getOptionalParam('invulnerable', false)) {
      this.decreaseTime(boardState, Math.floor(this.timeLeft.max / 2));
    }
  }

  setCreatorAbility(creatorAbilityID) {
    this.creatorAbility = AbilityDef.abilityDefList[creatorAbilityID];
    this.size = {
      left: 0, right: 0,
      top: 0, bottom: 0
    };
  }

  getAimTarget(boardState) {
    if (this.forceAimTarget) { return this.forceAimTarget; }
    if (boardState) {
      let y = this.y - Unit.UNIT_SIZE;
      while (y > 0) {
        let units = boardState.sectors.getUnitsAtPosition(this.x, y);
        for (let i = 0; i < units.length; i++) {
          let unit = boardState.findUnit(units[i]);
          if (unit.isRealUnit() && boardState.isEnemyUnit(unit)) {
            this.setAimTarget({x: this.x, y: this.y - Unit.UNIT_SIZE});
            return this.aimTarget;
          }
        }
        y -= Unit.UNIT_SIZE;
      }

      let units = boardState.getAllUnitsByCondition(unit => {
        return boardState.isEnemyUnit(unit) && unit.isRealUnit();
      });
      if (!units) {
        this.setAimTarget({x: this.x, y: this.y - Unit.UNIT_SIZE});
        return this.aimTarget;
      }
      let unit = units[Math.floor(boardState.getRandom() * units.length)];
      this.setAimTarget(unit);
      return this.aimTarget;
    }

    if (this.aimTarget) { return this.aimTarget; }

    return {x: this.x, y: this.y - Unit.UNIT_SIZE};
  }

  setAimTarget(targetPoint, forceAim) {
    if (forceAim) {
      this.forceAimTarget = forceAim;
    } else {
      this.aimTarget = targetPoint ? {x: targetPoint.x, y: targetPoint.y} : null;
    }

    if (this.turretSprite) {
      this.setAimTargetGraphic(this.getAimTarget());
    }
  }

  setAimTargetGraphic(targetPoint) {
    var angle = Math.atan2(targetPoint.y - this.y, targetPoint.x - this.x);
    this.turretSprite.rotation = angle + Math.PI / 2;
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

  preventsUnitEntry(unit) {
    return unit instanceof UnitCore;
  }

  loadSerializedData(data) {
    super.loadSerializedData(data);

    this.abilitiesLastUse = data.abilities_used;
    this.setAimTarget(data.aim_target);
  }
}

Turret.AddToTypeMap();
