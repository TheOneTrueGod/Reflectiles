class TimeoutProjectile extends StandardProjectile {
  constructor(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions) {
    super(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions);
    var targetVec = Victor(targetPoint.x - startPoint.x, targetPoint.y - startPoint.y);
    this.duration = Math.max(targetVec.length(), 100) / this.speed;
    this.max_bounces = abilityDef.getOptionalParam('max_bounces', -1);
  }

  /*hitUnit(boardState, unit, intersection) {
    super.hitUnit(boardState, unit, intersection);
    var damageDealt = this.throwProjectileEvent(ProjectileEvents.ON_HIT, boardState, unit, intersection);

    /*if (!unit.readyToDelete()) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }*/

    //this.delete();
}
