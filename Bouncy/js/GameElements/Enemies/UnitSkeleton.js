class UnitSkeleton extends UnitBasic {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
    this.traits[Unit.UNIT_TRAITS.RESILIANT] =
      NumbersBalancer.getUnitAbilityNumber(this,
        NumbersBalancer.UNIT_ABILITIES.SKELETON_MAX_DAMAGE);
  }

  createCollisionBox() {
    var s = Unit.UNIT_SIZE / 2 * 0.8;
    // Octagonal
    this.collisionBox = [
      new UnitLine(-s, s / 2, -s, -s / 2, this), // Left
      new UnitLine(-s, -s / 2, -s / 2, -s, this), // TL

      new UnitLine(-s / 2, -s, s / 2, -s, this), // Top
      new UnitLine(s / 2, -s, s, -s / 2, this), // TR

      new UnitLine(s, -s / 2, s, s / 2, this), // Right
      new UnitLine(s, s / 2, s / 2, s, this), // BR

      new UnitLine(s / 2, s, -s / 2, s, this), // Bottom
      new UnitLine(-s / 2, s, -s, s / 2, this) // BL
    ];
  }

  createSprite() {
    return this.createSpriteFromResource('enemy_skeleton');
  }
}

UnitSkeleton.AddToTypeMap();
