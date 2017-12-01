/* Params
 * bullet_waves (int) [4] -- the number of bullets to be fired.
 * bullet_wave_delay (int) [10] -- the gap between each wave of bullets
 * base_accuracy (float) [0] -- Randomly fire in this arc
 * accuracy_decay (float) [0] -- Added to base_accuracy each shot. (capped at 0 and Math.PI)
 */
class ProjectileShapeSprayShot extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.num_bullets = this.abilityDef.getOptionalParam('num_bullets', 5);
    this.ACTIVATE_ON_TICK = 0;
  }

  appendIconHTML($container) {
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 42px; left: 25px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 30px; left: 20px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 24px; left: 32px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 8px; left: 39px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 10px; left: 12px;"
      })
    );

    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 7px; left: 23px;"
      })
    );

  }

  appendIconDescHTML($container) {

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

  calculateSpread(startPos, endPos) {
    const MIN_DIST = 20;
    const MAX_DIST = 300;

    const MIN_ANGLE = Math.PI / 10.0;
    const MAX_ANGLE = Math.PI / 6.0;
    var dist = Victor(endPos.x - startPos.x, endPos.y - startPos.y).length();

    return lerp(
      MAX_ANGLE, MIN_ANGLE,
      Math.min((dist - MIN_DIST) / MAX_DIST, 1)
     );
  }

  createTargettingGraphic(startPos, endPos, color) {
    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    const circleSize = 8;
    for (var i = -1; i <= 1; i+= 2) {
      var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x) +
        this.calculateSpread(startPos, endPos) * i;
      //var dist = ((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2) ** 0.5;
      var dist = 250;
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

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    if (tick == this.ACTIVATE_ON_TICK) {
      var spread = this.calculateSpread(castPoint, targetPoint);
      for (var i = 0; i <= this.num_bullets; i++) {
        var rand = boardState.getRandom();
        var angle = Math.atan2(
          targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
        ) + spread * (rand * 2 - 1);
        rand = boardState.getRandom();
        var speed = lerp(6, 7, i / this.num_bullets);
        boardState.addProjectile(
          Projectile.createProjectile(
            this.projectileType,
            castPoint,
            targetPoint,
            angle,
            this.abilityDef,
            {
              speed: speed,
              size: 3,
              trail_length: 3,
              destroy_on_wall: this.abilityDef.getOptionalParam('destroy_on_wall', false)
            }
          ).addUnitHitCallback(this.unitHitCallback.bind(this))
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.ACTIVATE_ON_TICK;
  }
}
