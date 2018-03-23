class UnitNecromancer extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.unitsReincarnated = 0;
    this.unitsToReincarnate = NumbersBalancer.getUnitAbilityNumber(
      this,
      NumbersBalancer.UNIT_ABILITIES.NECROMANCER_MAX_SKELETONS_PER_TURN
    );
  }

  createCollisionBox() {
    var s = Unit.UNIT_SIZE / 2;

    var t = 0;
    var b = this.physicsHeight / 2;
    var r = this.physicsWidth / 2;
    var l = -this.physicsWidth / 2;

    var offset = 0;
    // Octagonal

    this.collisionBox = [
      new UnitLine(0, -this.physicsHeight / 2, this.physicsWidth / 2, 0, this), // Top Right
      new UnitLine(r, t - offset, r, b + offset, this), // Right
      new UnitLine(r + offset, b, l - offset, b, this), // Bottom
      new UnitLine(l, b + offset, l, t - offset, this), // Left
      new UnitLine(-this.physicsWidth / 2, 0, 0, -this.physicsHeight / 2, this), // Top Left
    ];
  }

  onUnitDying(boardState, dyingUnit) {
    if (
      this.unitsReincarnated < this.unitsToReincarnate &&
      !(dyingUnit instanceof UnitSkeleton) &&
      dyingUnit.getHealth().current <= 0
    ) {
      this.unitsReincarnated += 1;
      let newUnit = new UnitSkeleton(dyingUnit.x, dyingUnit.y, this.owner);
      boardState.addUnit(newUnit);
      newUnit.playSpawnEffect(boardState, dyingUnit, 20);
      return false;
    }
    return super.onUnitDying(boardState, dyingUnit);
  }

  createSprite() {
    return this.createSpriteFromResource('enemy_necromancer');
  }

  startOfPhase(boardState, phase) {
    super.startOfPhase(boardState, phase);
    if (phase == TurnPhasesEnum.NEXT_TURN || phase == TurnPhasesEnum.START_TURN) {
      this.unitsReincarnated = 0;
    }
  }
}

UnitNecromancer.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}


UnitNecromancer.AddToTypeMap();