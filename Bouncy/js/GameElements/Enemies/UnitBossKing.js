class UnitBossKing extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;
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
  }

  onUnitDying(boardState, dyingUnit) {
    const TURNS_UNTIL_SPAWN = 3;
    //let newUnit = new dyingUnit.constructor(dyingUnit.x, dyingUnit.y, this.owner);
    let newUnit = new UnitSpawningPlaceholder(
      dyingUnit.x,
      dyingUnit.y,
      this.owner,
      null,
      TURNS_UNTIL_SPAWN,
      dyingUnit.constructor.name
    );
    boardState.addUnit(newUnit);
    newUnit.playSpawnEffect(boardState, this, 20);
    return false;
  }
}

UnitBossKing.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitBossKing.AddToTypeMap();
