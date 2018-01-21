class PassthroughProjectile extends Projectile {
  constructor(playerID, startPoint, targetPoint, angle, abilityDef, hitsLeft, projectileOptions) {
    super(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions);
    this.hitsLeft = hitsLeft ? hitsLeft : 5;
  }

  hitUnit(boardState, unit, intersection) {
    if (this.lastHitUnit) {
      if (this.lastHitUnit == unit.id) {
        return;
      }
    }
    super.hitUnit(boardState, unit, intersection);
    EffectFactory.createDamageEntireUnitEffect(boardState, unit)

    this.throwProjectileEvent(ProjectileEvents.ON_HIT, boardState, unit, intersection);
    this.lastHitUnit = unit.id;
    this.hitsLeft -= 1;
    if (this.hitsLeft <= 0) {
      this.delete();
    }
  }

  hitWall(boardState, intersection) {
    super.hitWall(boardState, intersection);
    this.lastHitUnit = null;
  }

  shouldBounceOffLine(line) {
    if (line instanceof BorderWallLine) {
      return line.side !== BorderWallLine.BOTTOM;
    }
    return line.forceBounce(this);
  }
}
