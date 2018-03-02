/* Params
 * [TODO] bullet_waves (int) -- the number of bullets to be fired.
 */
class ProjectileShapeTriShot extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.ACTIVATE_ON_TICK = 0;
    this.bullets_per_side = Math.floor(
      (abilityDef.getOptionalParam('num_bullets', 1) - 1) / 2
    );
    this.min_angle = abilityDef.getOptionalParam('min_angle', Math.PI / 16.0);
    this.max_angle = abilityDef.getOptionalParam('max_angle', Math.PI / 6.0);
    if (this.num_bullets % 2 == 0) {
      this.num_bullets -= 1;
      console.warn("ProjectileShapeTriShot doesn't support even numbers yet");
    }
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

  getSpreadOffset() {
    /*if (this.num_bullets % 2 == 0) {
      return this.calculateSpread(startPos, endPos) * i / this.bullets_per_side / 2;
    }*/
    return 0;
  }

  createTargettingGraphic(startPos, endPos, color) {
    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    const circleSize = 8;
    for (var i = -this.bullets_per_side; i <= this.bullets_per_side; i++) {
      var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x) +
        this.calculateSpread(startPos, endPos) * i / this.bullets_per_side +
        this.getSpreadOffset();
      var dist = ((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2) ** 0.5;
      dist = 250;
      dist -= circleSize;
      lineGraphic.lineStyle(1, color)
        .moveTo(startPos.x, startPos.y)
        .lineTo(
          startPos.x + Math.cos(angle) * dist,
          startPos.y + Math.sin(angle) * dist
        );
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
        return (this.bullets_per_side * 2 + 1) + " X " + idx(hitEffects[i], 'base_damage', 0);
      }
    }
    return 0;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    if (tick == this.ACTIVATE_ON_TICK) {
      for (var i = -this.bullets_per_side; i <= this.bullets_per_side; i++) {
        var angle = Math.atan2(
          targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
        ) + this.calculateSpread(castPoint, targetPoint) * i / this.bullets_per_side +
          this.getSpreadOffset();
        boardState.addProjectile(
          Projectile.createProjectile(
            playerID,
            this.projectileType,
            castPoint,
            null,
            angle,
            this.abilityDef,
            {'speed': lerp(8, 7, Math.abs(i) / this.bullets_per_side)}
          ).addUnitHitCallback(this.unitHitCallback.bind(this))
          .addTimeoutHitCallback(this.timeoutHitCallback.bind(this))
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
