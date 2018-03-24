class PenetrateProjectile extends Projectile {
  constructor(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions) {
    super(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions);
    this.damageDealt = 0;
    this.lastUnitHit = null;
  }

  hitUnit(boardState, unit, intersection) {
    if (this.lastUnitHit === unit) {
      this.lastUnitHit = null;
      return;
    }
    this.lastUnitHit = unit;
    super.hitUnit(boardState, unit, intersection);
    EffectFactory.createDamageEntireUnitEffect(boardState, unit);

    var damageDealt = this.throwProjectileEvent(ProjectileEvents.ON_HIT, boardState, unit, intersection);

    this.damageDealt += damageDealt;
  }

  shouldBounceOffLine(line) {
    if (line instanceof BorderWallLine) {
      return line.side !== BorderWallLine.BOTTOM;
    }
    return line.forceBounce(this);
  }
}
