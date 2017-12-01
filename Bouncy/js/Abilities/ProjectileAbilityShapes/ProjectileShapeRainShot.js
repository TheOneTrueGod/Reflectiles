/* Params
 * bullet_waves (int) [4] -- the number of bullets to be fired.
 * bullet_wave_delay (int) [10] -- the gap between each wave of bullets
 * base_accuracy (float) [0] -- Randomly fire in this arc
 * accuracy_decay (float) [0] -- Added to base_accuracy each shot. (capped at 0 and Math.PI)
 */
class ProjectileShapeRainShot extends ProjectileShape {
  constructor(abilityDef) {
    super(abilityDef);
    this.num_bullets = this.abilityDef.getOptionalParam('num_bullets', 5);
    this.ACTIVATE_ON_TICK = 0;
    this.SHOTS_PER_TICK = this.abilityDef.getOptionalParam('shots_per_tick', 3);
    this.FINAL_TICK = this.num_bullets / this.SHOTS_PER_TICK;
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
        return this.num_bullets + " X " + idx(hitEffects[i], 'base_damage', 0);
      }
    }
    return 0;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    if (tick >= this.ACTIVATE_ON_TICK && tick <= this.FINAL_TICK) {
      for (var i = 0; i < this.SHOTS_PER_TICK; i++) {
        if ((tick - this.ACTIVATE_ON_TICK) * this.SHOTS_PER_TICK + i > this.num_bullets) {
          continue;
        }
        var rand = boardState.getRandom();
        var angle = Math.PI / 2 * 3 + Math.PI / 2.0 * (rand - 0.5);
        rand = boardState.getRandom();
        var speed = 4;
        boardState.addProjectile(
          Projectile.createProjectile(
            this.projectileType,
            castPoint,
            null,
            angle,
            this.abilityDef,
            {
              speed: speed,
              size: 3,
              trail_length: 3,
              gravity: {x: 0, y: -0.1},
              speed_decay: {x: 0.98, y: 1},
              destroy_on_wall: true
            }
          ).addUnitHitCallback(this.unitHitCallback.bind(this))
        );
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > this.FINAL_TICK;
  }

  createTargettingGraphic(startPos, endPos, color) {
    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    var circleSize = 50;
    lineGraphic.position = {x: startPos.x, y: startPos.y};
    lineGraphic.lineStyle(1, color);
    /*lineGraphic.lineStyle(1, color)
      .arc(0, -circleSize, circleSize, 0, Math.PI); // cx, cy, radius, startAngle, endAngle
      */

    lineGraphic
      .moveTo(-circleSize / 3 * 2, -circleSize / 2)
      .lineTo(-circleSize - 60, -circleSize * 4);

    lineGraphic
      .moveTo(circleSize / 3 * 2, -circleSize / 2)
      .lineTo(circleSize + 60, -circleSize * 4);


    //lineGraphic.drawCircle(endPos.x, endPos.y, circleSize);

    //lineGraphic.beginFill(color);
    //lineGraphic.drawCircle(endPos.x, endPos.y, circleSize / 3);

    return lineGraphic;
  }

}
