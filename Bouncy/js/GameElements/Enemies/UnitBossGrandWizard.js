// Grand wizard will have access to a series of different abilities

// Summon a [2] square thick barrier between him and the players.  Lasts until destroyed
// Summon [4] orbs that charge up over the next [2] turns.  If they're still around after that, they explode into a fireball.

class UnitBossGrandWizard extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.animationFrames = 20;
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;
    // Ability Stuff.  Move to UnitBasic eventually.
    this.personalSpaceAbility = this.addAbility(0, new EnemyAbilityPersonalSpace(
      this,
      NumbersBalancer.getUnitAbilityNumber(this, NumbersBalancer.UNIT_ABILITIES.WIZARD_PROJECTILE_DAMAGE),
      4,
    ));
    this.addAbility(40, new EnemyAbilitySummonFireShards(
      this,
      NumbersBalancer.getUnitAbilityNumber(this, NumbersBalancer.UNIT_ABILITIES.WIZARD_NUM_SHARDS)
    ));
    this.addAbility(40, new EnemyAbilitySummonIceWall(
      this,
      NumbersBalancer.getUnitAbilityNumber(this, NumbersBalancer.UNIT_ABILITIES.WIZARD_NUM_WALLS)
    ));
    this.addAbility(20, new EnemyAbilityBossShootProjectile(
      this,
      NumbersBalancer.getUnitAbilityNumber(this, NumbersBalancer.UNIT_ABILITIES.WIZARD_PROJECTILE_DAMAGE)
    ));
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
    var hatTop = -this.physicsHeight / 2;
    var t = -this.physicsHeight / 2 + 30;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2 - 10;
    var l = -this.physicsWidth / 2 + 10;

    this.collisionBox = [
       // Top Left
      new UnitLine(l, t, l + 10, t, this),
      new UnitLine(l + 10, t, -10, hatTop, this),
      // Top Center
      new UnitLine(-10, hatTop, 10, hatTop, this),
      // Top Right
      new UnitLine(10, hatTop, r - 10, t, this),
      new UnitLine(r - 10, t, r, t, this),
      // Right
      new UnitLine(r, t, r, b, this),
      // Bottom
      new UnitLine(r, b, r - 20, b, this),
      new UnitLine(r - 20, b, r - 35, b - 15, this),
      new UnitLine(r - 35, b - 15, l + 35, b - 15, this),
      new UnitLine(l + 35, b - 15, l + 20, b, this),
      new UnitLine(l + 20, b, l, b, this),
      // Left
      new UnitLine(l, b, l, t, this),
    ];
  }

  createSprite(hideHealthBar) {
    return this.createSpriteListFromResourceList([
      'enemy_boss_wizard',
      'enemy_boss_wizard_2'
    ], hideHealthBar);
  }

  doMovement(boardState) {
    if (!this.canMove()) {
      return;
    }
    this.movementCredits += this.movementSpeed;
    if (this.movementCredits >= 1) {
      this.doHorizontalMovement(boardState);
    }
  }

  isFinishedDoingAction(boardState, phase) {
    if (
      phase === TurnPhasesEnum.ENEMY_ACTION &&
      boardState.tick / this.animationFrames < this.getNumAbilitiesToUse()
    ) {
      return false;
    }
    return super.isFinishedDoingAction(boardState, phase);
  }

  getNumAbilitiesToUse() {
    let healthPercent = this.getTotalHealthPercent();
    if (healthPercent > 0.75) {
      return 2;
    } else if (healthPercent > 0.5) {
      return 3;
    }
    return 4;
  }

  doAbilityForecasting(boardState) {
    super.doAbilityForecasting(boardState);
    this.abilityForecasts.push(this.personalSpaceAbility.createForecast(boardState, this, 0))
  }

  runTick(boardState, phase) {
    super.runTick(boardState, phase);
    if (this.canUseAbilities() && this.abilityForecasts.length > 0 && phase === TurnPhasesEnum.ENEMY_ACTION) {
      if (boardState.tick === 0) {
        this.abilityForecasts.forEach((forecast) => forecast.removeFromStage());
        
        const personalSpaceAbility = this.abilityForecasts.pop();
        personalSpaceAbility.useAbility(boardState);
      }
      if (boardState.tick / this.animationFrames < this.getNumAbilitiesToUse()) {
        if (boardState.tick % this.animationFrames < this.animationFrames / 2) {
          this.setSpriteVisible('enemy_boss_wizard_2');
        } else {
          this.setSpriteVisible('enemy_boss_wizard');
        }
        if (boardState.tick % this.animationFrames == this.animationFrames / 2) {
          this.useForecastAbilities(boardState, 0);
          this.abilityForecasts.unshift();
        }
      }
    }
  }

  isBoss() {
    return true;
  }
}

UnitBossGrandWizard.AddToTypeMap();
