class UnitBossHealer extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;
    this.traits[Unit.UNIT_TRAITS.RESILIANT] = 500;
  }

  getUnitSize() {
    return {x: Unit.UNIT_SIZE * 3, y: Unit.UNIT_SIZE * 3};
  }

  getSize() {
    return {
      left: 1, right: 1, top: 1, bottom: 1
    };
  }

  createCollisionBox() {
    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var offset = 0;
    this.collisionBox = [
      new UnitLine(l - offset, t, r + offset, t, this), // Top
      new UnitLine(r, t - offset, r, b + offset, this), // Right
      new UnitLine(r + offset, b, l - offset, b, this), // Bottom
      new UnitLine(l, b + offset, l, t - offset, this), // Left
    ];
  }

  createSprite() {
    return this.createSpriteFromResource('enemy_boss_healer');
  }

  canHealTarget(targetUnit) {
    if (targetUnit.hasStatusEffect(PoisonStatusEffect)) {
      return false;
    }

    return targetUnit instanceof UnitBasic && targetUnit.id != this.id;
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (!this.canUseAbilities()) { return; }
    if (phase != TurnPhasesEnum.END_OF_TURN) { return; }

    var validTargets = [];
    var range = NumbersBalancer.getUnitAbilityNumber(
      NumbersBalancer.UNIT_ABILITIES.UNIT_BOSS_HEALER_RANGE
    );
    for (var x = -range; x <= range; x++) {
      for (var y = -range; y <= range; y++) {
        var shieldTargets = boardState.sectors.getUnitsAtPosition(
          this.x + x * Unit.UNIT_SIZE,
          this.y + y * Unit.UNIT_SIZE
        );
        for (var i = 0; i < shieldTargets.length; i++) {
          var targetUnit = boardState.findUnit(shieldTargets[i]);
          if (this.canHealTarget(targetUnit)) {
            if (targetUnit.getHealth().current < targetUnit.getHealth().max) {
              validTargets.push(targetUnit);
            }
          }
        }
      }
    }

    var numTargets = NumbersBalancer.getUnitAbilityNumber(
      NumbersBalancer.UNIT_ABILITIES.UNIT_BOSS_HEALER_NUM_TARGETS
    );

    for (var i = 0; i < numTargets; i++) {
      if (validTargets.length == 0) {
        continue;
      }
      var randIndex = Math.floor(boardState.getRandom() * validTargets.length);
      var targetUnit = validTargets.splice(randIndex, 1)[0];
      boardState.addProjectile(
        new SpriteLerpProjectile(
          this, targetUnit,
          0.1, 1,
          20,
          'effect_heal',
          this.projectileAnimationOver.bind(this, targetUnit)
        )
      );
    }
  }

  doMovement(boardState) {
    if (this.hasStatusEffect(FreezeStatusEffect)) {
      return;
    }
    this.movementCredits += this.movementSpeed;
    if (this.movementCredits < 1) {
      this.doHorizontalMovement(boardState);
    } else {
      this.moveForward(boardState);
    }
  }

  projectileAnimationOver(targetUnit) {
    targetUnit.heal(
      NumbersBalancer.getUnitAbilityNumber(
        NumbersBalancer.UNIT_ABILITIES.UNIT_BOSS_HEALER_AMOUNT
      )
    );
  }

  getTopLeftOffset() {
    return {x: -1, y: -1};
  }

  getBottomRightOffset() {
    return {x: 1, y: 1};
  }

  isBoss() {
    return true;
  }
}

UnitBossHealer.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}


UnitBossHealer.createAbilityDef = function() {
}

UnitBossHealer.AddToTypeMap();
