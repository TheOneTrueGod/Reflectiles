// Grand wizard will have access to a series of different abilities

// Summon a [2] square thick barrier between him and the players.  Lasts until destroyed
// Summon [4] orbs that charge up over the next [2] turns.  If they're still around after that, they explode into a fireball.

class UnitBossGrandWizard extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;
    // Ability Stuff.  Move to UnitBasic eventually.
    this.abilities = [];
    this.abilities.push(new EnemyAbilitySummonFireShards(this,
      NumbersBalancer.getUnitAbilityNumber(this, NumbersBalancer.UNIT_ABILITIES.WIZARD_NUM_SHARDS)
    ));
    this.abilities.push(new EnemyAbilitySummonIceWall(this,
      NumbersBalancer.getUnitAbilityNumber(this, NumbersBalancer.UNIT_ABILITIES.WIZARD_NUM_WALLS)
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
    var t = -this.physicsHeight / 2 + 30;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2 - 15;
    var l = -this.physicsWidth / 2 + 15;

    var offset = 0;
    this.collisionBox = [
      new UnitLine(l, t, 0, t - 20, this), // Top Left
      new UnitLine(0, t - 20, r, t, this), // Top Right
      new UnitLine(r, t, r, b, this), // Right
      new UnitLine(r, b, l, b, this), // Bottom
      new UnitLine(l, b, l, t, this), // Left
    ];
  }

  createSprite(hideHealthBar) {
    return this.createSpriteFromResource('enemy_boss_wizard', hideHealthBar);
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

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (phase == TurnPhasesEnum.END_OF_TURN) {
      this.useAbility(boardState);
    }
  }

  doSpawnEffect(boardState) {
    this.useAbility(boardState);
  }

  useAbility(boardState) {
    let rand = boardState.getRandom();
    let abilToUse = this.abilities[Math.floor(this.abilities.length * rand)];
    abilToUse.doEffects(boardState);
  }

  isBoss() {
    return true;
  }
}

UnitBossGrandWizard.AddToTypeMap();
