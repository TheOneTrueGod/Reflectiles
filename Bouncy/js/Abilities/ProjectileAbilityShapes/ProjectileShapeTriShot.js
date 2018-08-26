/* Params
 * [TODO] bullet_waves (int) -- the number of bullets to be fired.
 */
class ProjectileShapeTriShot extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.ACTIVATE_ON_TICK = 0;
    this.min_angle = abilityDef.getOptionalParam('min_angle', Math.PI / 16.0);
    this.max_angle = abilityDef.getOptionalParam('max_angle', Math.PI / 6.0);
    this.num_bullets = abilityDef.getOptionalParam('num_bullets', 1);
    this.curve_time = abilityDef.getOptionalParam('curve_time', 0);
    this.curve_delay = abilityDef.getOptionalParam('curve_delay', 0);
    this.max_curve = abilityDef.getOptionalParam('curve_amount', 0);
  }

  calculateSpread(startPos, endPos) {
    const MIN_DIST = 20;
    const MAX_DIST = 300;

    const MIN_ANGLE = Math.PI / 16.0;
    const MAX_ANGLE = Math.PI / 6.0;
    var dist = Victor(endPos.x - startPos.x, endPos.y - startPos.y).length();

    return lerp(
      this.max_angle, this.min_angle,
      Math.min((dist - MIN_DIST) / MAX_DIST, 1)
     );
  }

  createTargettingGraphic(startPos, endPos, color) {
    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    const circleSize = 8;
    let targetPoint = endPos;
    let castPoint = startPos;
    for (var i = 0; i < this.num_bullets; i++) {
      let pctOn = 0;
      if (this.num_bullets > 1) {
        pctOn = (i / (this.num_bullets - 1) * 2 - 1);
      }
      var angle = Math.atan2(
        targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
      ) + this.calculateSpread(castPoint, targetPoint) * pctOn;
      var dist = ((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2) ** 0.5;
      dist = 250;
      dist -= circleSize;
      ProjectileAbilityDef.createProjectileTargetter(
        lineGraphic, color, startPos, endPos, angle, 250,
        this.abilityDef.getOptionalParam('speed', 6),
        this.abilityDef.getOptionalParam('duration', 100),
        this.abilityDef.getOptionalParam('speed_decay', null),
        this.abilityDef.getOptionalParam('gravity', null),
      );
      /*lineGraphic.lineStyle(1, color)
        .moveTo(startPos.x, startPos.y)
        .lineTo(
          startPos.x + Math.cos(angle) * dist,
          startPos.y + Math.sin(angle) * dist
        );*/
    }

    lineGraphic.drawCircle(endPos.x, endPos.y, circleSize);

    lineGraphic.beginFill(color);
    lineGraphic.drawCircle(endPos.x, endPos.y, circleSize / 3);

    return lineGraphic;
  }

  getTextDesc() {
    var hitEffects = this.abilityDef.getHitEffects();
    for (var i = 0; i < hitEffects.length; i++) {
      if (hitEffects[i].effect == ProjectileShape.HitEffects.DAMAGE) {
        return this.num_bullets + " X " + idx(hitEffects[i], 'base_damage', 0);
      }
    }
    return 0;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    if (tick == this.ACTIVATE_ON_TICK) {
      for (var i = 0; i < this.num_bullets; i++) {
        let pctOn = 0;
        if (this.num_bullets > 1) {
          pctOn = (i / (this.num_bullets - 1) * 2 - 1);
        }

        let aimAngle = Math.atan2(
          targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
        );

        var angle = aimAngle + this.calculateSpread(castPoint, targetPoint) * pctOn;

        let curveAmount = 0;
        if (this.curve_time > 0) {
          curveAmount = this.max_curve / this.curve_time * pctOn;
        }

        boardState.addProjectile(
          Projectile.createProjectile(
            playerID,
            this.projectileType,
            castPoint,
            null,
            angle,
            this.abilityDef,
            {
              speed: lerp(8, 7, Math.abs(pctOn)),
              curve_time: this.curve_time,
              curve_delay: this.curve_delay,
              curve_amount: curveAmount,
            }
          ).addUnitHitCallback(this.unitHitCallback.bind(this))
          .addTimeoutHitCallback(this.timeoutHitCallback.bind(this))
          .addTimeoutCallback(this.timeoutCallback.bind(this))
          .addCollisionHitCallback(this.collisionHitCallback.bind(this))
          .addOnKillCallback(this.onKillCallback.bind(this))
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
