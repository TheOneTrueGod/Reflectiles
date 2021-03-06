class UnitBossKing extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;

    this.personalSpaceAbility = new EnemyAbilityPersonalSpace(
      this,
      NumbersBalancer.getUnitAbilityNumber(this, NumbersBalancer.UNIT_ABILITIES.WIZARD_PROJECTILE_DAMAGE),
      7,
    );
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
    return this.createSpriteFromResource('enemy_boss_king', hideHealthBar);
  }

  doMovement(boardState) {
    return;
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

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (phase != TurnPhasesEnum.ENEMY_ACTION) { return; }
    boardState.callOnAllUnits((unit) => {
      unit.addStatusEffect(new ImmobilizeStatusEffect(1, null));
    });

    this.personalSpaceAbility.doEffects(boardState);
  }

  onUnitDying(boardState, dyingUnit) {
    const TURNS_UNTIL_SPAWN = NumbersBalancer.getUnitAbilityNumber(
      this,
      NumbersBalancer.UNIT_ABILITIES.KING_REVIVE_TURNS,
    );
    //let newUnit = new dyingUnit.constructor(dyingUnit.x, dyingUnit.y, this.owner);
    let newUnit = new UnitSpawningPlaceholder(
      dyingUnit.x,
      dyingUnit.y,
      this.owner,
      null,
      TURNS_UNTIL_SPAWN,
      dyingUnit.constructor.name,
      Unit.SpawnEffects.DEFAULT,
    );
    boardState.addUnit(newUnit);
    newUnit.playSpawnEffect(boardState, this, 20);
    return false;
  }
}

UnitBossKing.AddToTypeMap();
