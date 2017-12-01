/* Params
 * num_bullets (int) [4] -- the number of bullets to be fired.
 * bullet_wave_delay (int) [10] -- the gap between each wave of bullets
 * base_accuracy (float) [0] -- Randomly fire in this arc
 * accuracy_decay (float) [0] -- Added to base_accuracy each shot. (capped at 0 and Math.PI)
 */
class ProjectileShapeWave extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.ACTIVATE_ON_TICK = 0;
    this.SHOT_DELAY = this.abilityDef.getOptionalParam('shots_delay', 3);
    this.NUM_BULLETS = this.abilityDef.getOptionalParam('num_bullets', 20);
    this.RETURN_NUM_BULLETS = this.abilityDef.getOptionalParam('return_num_bullets', 5);
    this.RETURN_SHOT_DELAY = this.abilityDef.getOptionalParam('return_shot_delay', 15);
    this.ANGLE_SPREAD = this.abilityDef.getOptionalParam('angle_spread', Math.PI / 3.0);
    this.ANGLE_OFFSET = this.abilityDef.getOptionalParam('angle_offset', -Math.PI / 16.0);
    this.FINAL_TICK = this.NUM_BULLETS * this.SHOT_DELAY + this.RETURN_NUM_BULLETS * this.RETURN_SHOT_DELAY;

  }

  appendIconHTML($container) {
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 35px; left: 25px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 25px; left: 15px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 25px; left: 35px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 15px; left: 40px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 15px; left: 10px;"
      })
    );
    $container.append(
      $("<div>", {
        "class": "iconMockShot",
        "style": "top: 17px; left: 25px;"
      })
    );

  }

  appendIconDescHTML($container) {

  }

  getTextDesc() {
    var hitEffects = this.abilityDef.getHitEffects();
    for (var i = 0; i < hitEffects.length; i++) {
      if (hitEffects[i].effect == ProjectileShape.HitEffects.DAMAGE) {
        return (this.NUM_BULLETS + this.RETURN_NUM_BULLETS) + " X " + idx(hitEffects[i], 'base_damage', 0);
      }
    }
    return 0;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    var tick = tick - this.ACTIVATE_ON_TICK;
    var lastTick = tick - 1;
    if (!(tick >= 0 && tick <= this.FINAL_TICK)) {
      return;
    }
    var shot_delay = this.SHOT_DELAY;
    var shotOn = Math.floor(tick / shot_delay);
    var pctDone = (1 - shotOn / this.NUM_BULLETS);
    if (tick > this.NUM_BULLETS * this.SHOT_DELAY) {
      tick -= this.NUM_BULLETS * this.SHOT_DELAY;
      lastTick -= this.NUM_BULLETS * this.SHOT_DELAY;
      shot_delay = this.RETURN_SHOT_DELAY;
      shotOn = Math.floor(tick / shot_delay);
      pctDone = shotOn / this.RETURN_NUM_BULLETS;
    }
    if (
      Math.floor(tick / shot_delay) - Math.floor(lastTick / shot_delay) >= 1
    ) {
      var angle = Math.atan2(
        targetPoint.y - castPoint.y, targetPoint.x - castPoint.x
      ) + (this.ANGLE_SPREAD) * pctDone + this.ANGLE_OFFSET;

      boardState.addProjectile(
        Projectile.createProjectile(
          this.projectileType,
          castPoint,
          null,
          angle,
          this.abilityDef,
          {}
        ).addUnitHitCallback(this.unitHitCallback.bind(this))
      );
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.FINAL_TICK;
  }

  createTargettingGraphic(startPos, endPos, color) {
    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    const circleSize = 8;
    for (var i = 0; i <= 1; i+= 1) {
      var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x) +
        this.ANGLE_SPREAD * i + this.ANGLE_OFFSET;
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

}
