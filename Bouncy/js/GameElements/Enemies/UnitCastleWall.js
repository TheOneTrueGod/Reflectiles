class UnitCastleWall extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.FROST_IMMUNE] = true;
    this.traits[Unit.UNIT_TRAITS.POISON_IMMUNE] = true;
    this.sortIndex = 1000;
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

  createSprite(hideHealthBar) {
    let sprite = this.createSpriteFromResource('enemy_castle_wall', hideHealthBar);
    return sprite;
  }

  isRealUnit() {
    return false;
  }

  canMove() {
    return false;
  }

  preventsUnitEntry(unit) {
    return (unit instanceof UnitCore);
  }

  addToBackOfStage() {
    return true;
  }

  onDelete(boardState) {
    super.onDelete(boardState);

    const TURNS_UNTIL_SPAWN = NumbersBalancer.getUnitAbilityNumber(
      this,
      NumbersBalancer.UNIT_ABILITIES.CASTLE_WALL_REVIVE_TURNS
    );
    //let newUnit = new dyingUnit.constructor(dyingUnit.x, dyingUnit.y, this.owner);
    let newUnit = new UnitSpawningPlaceholder(
      this.x,
      this.y,
      this.owner,
      null,
      TURNS_UNTIL_SPAWN,
      this.constructor.name
    );
    boardState.addUnit(newUnit);
    newUnit.playSpawnEffect(boardState, this, 20);
  }

  createHealthBarSprite(sprite) {
    return null;
  }
}

UnitCastleWall.AddToTypeMap();
