/**
 * Applies a buff to the casting unit, and possibly units around it.
 * radius: number.
 */
class BuffAbilityDef extends AbilityDef {
  constructor(defJSON, subAbility) {
    super(defJSON, subAbility);

    this.radius = 0;
  }

  getValidTarget(target, playerID) {
    // TODO: Pass in boardState.  Too lazy right now.
    if (this.shape.getValidTarget) { return this.shape.getValidTarget(MainGame.boardState, target, playerID); }
    return super.getValidTarget(target, playerID);
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    let target = targetPoint;
    if (this.accuracy.isAccuracyDefined()) {
      const maxDist = this.accuracy.maxDist;
      const minDist = this.accuracy.minDist;

      var angle = Math.atan2(targetPoint.y - castPoint.y, targetPoint.x - castPoint.x);
      var dist = ((targetPoint.x - castPoint.x) ** 2 + (targetPoint.y - castPoint.y) ** 2) ** 0.5;
      dist = Math.max(Math.min(dist, maxDist), minDist);
      target = {
        x: castPoint.x + Math.cos(angle) * dist,
        y: castPoint.y + Math.sin(angle) * dist
      };
    }

    super.doActionOnTick(playerID, tick, boardState, castPoint, target);
    this.shape.doActionOnTick(playerID, tick, boardState, castPoint, target);
  }

  hasFinishedDoingEffect(tickOn) {
    return this.shape.hasFinishedDoingEffect(tickOn);
  }

  createTargettingGraphic(startPos, endPos, color) {
    if (this.shape.createTargettingGraphic) {
      return this.shape.createTargettingGraphic(startPos, endPos, color);
    } else {
      // Create a new Graphics object and add it to the scene
      var lineGraphic = new PIXI.Graphics();
      let circleSize = 8;
      const innerCircleSize = 3;
      var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
      var dist = ((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2) ** 0.5;
      let maxDist = 1000;

      if (this.accuracy.isAccuracyDefined()) {
        maxDist = this.accuracy.maxDist;
        const minDist = this.accuracy.minDist;
        dist = Math.max(Math.min(dist, maxDist), minDist);
        circleSize = this.accuracy.getCircleRadius(dist);
      }

      let circleCenter = {
        x: startPos.x + Math.cos(angle) * dist,
        y: startPos.y + Math.sin(angle) * dist
      };
      //dist -= circleSize;
      let accuracyDecay = this.getOptionalParam('accuracy_decay', null);
      let barrelWidth = this.getOptionalParam('barrel_width', 0);

      let duration = this.getOptionalParam('duration', 100);
      let speed = this.getOptionalParam('speed', 6);
      if (this.getOptionalParam('projectile_type', null) === ProjectileShape.ProjectileTypes.GRENADE) {
        duration = this.getOptionalParam('duration', 40);
        speed = Math.max(dist, 100) / duration;
      }

      let finalPos = ProjectileAbilityDef.createProjectileTargetter(
        lineGraphic, color, startPos, endPos, angle, Math.min(dist, maxDist),
        speed,
        duration,
        this.getOptionalParam('speed_decay', null),
        this.getOptionalParam('gravity', null),
        this.getOptionalParam('curve_def', null),
      );

      if (accuracyDecay || barrelWidth) {
        for (let i = -1; i <= 1; i+= 2) {
          let barrelPos = startPos;
          // do something with barrelWidth
          ProjectileAbilityDef.createProjectileTargetter(
            lineGraphic, color, barrelPos, endPos,
            angle + accuracyDecay * i,
            Math.min(dist, maxDist) * 0.75,
            speed,
            duration,
            this.getOptionalParam('speed_decay', null),
            this.getOptionalParam('gravity', null),
            this.getOptionalParam('curve_def', null),
          );
        }
      }

      lineGraphic.drawCircle(finalPos.x, finalPos.y, circleSize);

      lineGraphic.beginFill(color);
      lineGraphic.drawCircle(finalPos.x, finalPos.y, innerCircleSize);

      return lineGraphic;
    }
  }
}

BuffAbilityDef.createProjectileTargetter = function (
  lineGraphic, color,
  startPos, endPos, angle,
  maxDist,
  speed, duration,
  speedDecay, gravity,
  curveDef,
) {
  duration = duration ? duration : 100;
  speed = speed ? speed : 6;

  let dist = duration * speed;
  let currPos = Victor(startPos.x, startPos.y);

  const aimAngle = Math.atan2(
    endPos.y - startPos.y, endPos.x - startPos.x
  );
  let curveHandler = !curveDef ? null : ProjectileCurveHandler.getCurveHandler(curveDef, angle, aimAngle);

  lineGraphic.lineStyle(1, color)
    .moveTo(startPos.x, startPos.y);
  let currDist = 0;
  let tempBullet = {
    angle: angle,
  };
  for (let i = 0; i < duration && currDist < maxDist; i++) {
    if (curveHandler) {
      tempBullet.angle = angle;
      curveHandler.doCurveEffects(tempBullet, i);
      angle = tempBullet.angle;
    }

    speed = Victor(Math.cos(angle) * speed, Math.sin(angle) * speed);

    currDist += speed.length();
    currPos.add(speed);
    if (speedDecay && i >= idx(speedDecay, 'delay', 0)) {
      speed.multiply(speedDecay);
    }
    if (gravity) {
      speed.add(gravity);
    }
    angle = speed.angle();
    speed = speed.length();
    lineGraphic.lineTo(currPos.x, currPos.y);
  }
  return currPos;
}
