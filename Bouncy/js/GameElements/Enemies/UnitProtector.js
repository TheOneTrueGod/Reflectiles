class UnitProtector extends UnitBasic {
  createCollisionBox() {
    var t = -this.physicsHeight / 2;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var offset = 0;
    this.collisionBox = [
      new UnitLine(l - offset, t, r + offset, t, this), // Top
      new UnitLine(r, t - offset, r, 0, this), // Right
      new UnitLine(r, 0, 0, b, this), // Bottom Right
      new UnitLine(0, b, l, 0, this), // Bottom Left
      new UnitLine(l, 0, l, t - offset, this), // Left
    ];
  }

  createSprite() {
    var sprite;
    sprite = new PIXI.Sprite(
      PIXI.loader.resources['enemy_protector'].texture
    );

    //this.addPhysicsLines(sprite);
    this.createHealthBarSprite(sprite);

    sprite.anchor.set(0.5);

    sprite.width = Unit.UNIT_SIZE;
    sprite.height = Unit.UNIT_SIZE;
    return sprite;
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (!this.canUseAbilities()) { return; }
    if (phase != TurnPhasesEnum.END_OF_TURN) { return; }

    var validTargets = [];
    var secondaryTargets = [];
    var range = NumbersBalancer.getUnitAbilityNumber(
      NumbersBalancer.UNIT_ABILITIES.PROTECTOR_SHIELD_RANGE
    );
    for (var x = -range; x <= range; x++) {
      for (var y = -range; y <= range; y++) {
        var shieldTargets = boardState.sectors.getUnitsAtPosition(
          this.x + x * Unit.UNIT_SIZE,
          this.y + y * Unit.UNIT_SIZE
        );
        for (var i = 0; i < shieldTargets.length; i++) {
          var targetUnit = boardState.findUnit(shieldTargets[i]);
          if (
            targetUnit instanceof UnitBasic &&
            !(targetUnit instanceof UnitProtector)
          ) {
            if (targetUnit.hasStatusEffect(ShieldStatusEffect)) {
              var effect = targetUnit.getStatusEffect(ShieldStatusEffect);
              if (effect.canBeRefreshed()) {
                secondaryTargets.push(targetUnit);
              }
            } else {
              validTargets.push(targetUnit);
            }
          }
        }
      }
    }
    var numTargets = NumbersBalancer.getUnitAbilityNumber(
      NumbersBalancer.UNIT_ABILITIES.PROTECTOR_SHIELD_NUM_TARGETS
    );
    for (var i = 0; i < numTargets; i++) {
      if (validTargets.length == 0 && secondaryTargets) {
        validTargets = secondaryTargets;
        secondaryTargets = null;
      }
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
          'zone_energy_shield',
          this.projectileAnimationOver.bind(this, targetUnit)
        )
      );
    }
  }

  projectileAnimationOver(targetUnit) {
    targetUnit.addStatusEffect(
      new ShieldStatusEffect(NumbersBalancer.getUnitAbilityNumber(
        NumbersBalancer.UNIT_ABILITIES.PROTECTOR_SHIELD
      ))
    );
  }
}

UnitProtector.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}


UnitProtector.createAbilityDef = function() {
  //UnitKnight.abilityDef = Abi
}

UnitProtector.AddToTypeMap();
