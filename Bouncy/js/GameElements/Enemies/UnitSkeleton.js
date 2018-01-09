class UnitSkeleton extends UnitBasic {
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

  dealDamage(boardState, amount, source) {
    let damageToDeal = this.health.max / NumbersBalancer.getUnitAbilityNumber(
      NumbersBalancer.UNIT_ABILITIES.SKELETON_HITS_TO_KILL);

    super.dealDamage(boardState, damageToDeal, source);
    return damageToDeal;
  }

  createSprite() {
    return this.createSpriteFromResource('enemy_skeleton');
  }
}

UnitSkeleton.loadFromServerData = function(serverData) {
  return UnitBasic.loadFromServerData(serverData);
}

UnitSkeleton.AddToTypeMap();
