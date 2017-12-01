class PenetrateProjectile extends Projectile {
  constructor(startPoint, targetPoint, angle, abilityDef, projectileOptions) {
    super(startPoint, targetPoint, angle, abilityDef, projectileOptions);
    this.damageDealt = 0;
  }

  hitUnit(boardState, unit, intersection) {
    super.hitUnit(boardState, unit, intersection);
    EffectFactory.createDamageEntireUnitEffect(boardState, unit);

    var damageDealt = this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );
    this.damageDealt += damageDealt;
  }

  shouldBounceOffLine(line) {
    if (line instanceof BorderWallLine) {
      return line.side !== BorderWallLine.BOTTOM;
    }
    return line.forceBounce();
  }
}
