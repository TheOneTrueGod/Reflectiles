class ProjectileAccuracy {
  constructor(accuracyJSON) {
    if (!accuracyJSON) {
      this.minRadius = 0;
      this.maxRadius = 0;

      this.minDist = 0;
      this.maxDist = 10000;
      return;
    }
    this.minRadius = idx(accuracyJSON, 'min_radius', 50);
    this.maxRadius = idx(accuracyJSON, 'max_radius', 100);
    this.minDist = idx(accuracyJSON, 'min_dist', 50);
    this.maxDist = idx(accuracyJSON, 'max_dist', 400);
  }

  isAccuracyDefined() {
    return this.minRadius != 0 && this.maxRadius != 0;
  }

  getCircleRadius(aimDistance) {
    return lerp(
      this.minRadius,
      this.maxRadius,
      Math.max(Math.min((aimDistance - this.minDist) / (this.maxDist - this.minDist), 1), 0)
    );
  }

  getRandomTarget(boardState, castPoint, targetPoint) {
    if (!this.isAccuracyDefined()) {
      return targetPoint;
    }

    let dist = Math.pow(distSqr(castPoint, targetPoint), 0.5);
    let r = this.getCircleRadius(dist);

    r = Math.pow(boardState.getRandom() * Math.pow(r, 2), 0.5);
    let angle = boardState.getRandom() * Math.PI * 2;

    return {
      x: targetPoint.x + r * Math.cos(angle),
      y: targetPoint.y + r * Math.sin(angle),
    };
  }
}

class ProjectileAbilityDef extends AbilityDef {
  constructor(defJSON, subAbility) {
    super(defJSON, subAbility);
    if (!defJSON['shape'] || !defJSON['projectile_type']) {
      throw new Error("shape and projectile_type are required in a ProjectileAbilityDef");
    }

    this.shapeType = defJSON['shape'];
    this.projectileType = defJSON['projectile_type'];
    this.hitEffects = defJSON['hit_effects'] ? defJSON['hit_effects'] : [];
    this.collisionEffects = defJSON['collision_effects'] ? defJSON['collision_effects'] : [];
    this.timeoutHitEffects = defJSON['timeout_hit_effects'] ? defJSON['timeout_hit_effects'] : [];
    this.timeoutEffects = defJSON['timeout_effects'] ? defJSON['timeout_effects'] : [];
    this.onKillEffects = defJSON['on_kill_effects'] ? defJSON['on_kill_effects'] : [];

    this.accuracy = new ProjectileAccuracy(defJSON.accuracy);
    this.shape = ProjectileShape.getProjectileShape(defJSON['shape'], this);
    this.collisionBehaviours = defJSON['collision_behaviours'];

    if (defJSON.timeout_effects) {
      this.loadNestedAbilityDefs(defJSON.timeout_effects);
    }

    if (defJSON.timeout_hit_effects) {
      this.loadNestedAbilityDefs(defJSON.timeout_hit_effects);
    }

    if (defJSON.collision_effects) {
      this.loadNestedAbilityDefs(defJSON.collision_effects);
    }

    if (defJSON.on_kill_effects) {
      this.loadNestedAbilityDefs(this.onKillEffects);
    }

    if (defJSON.hit_effects) {
      for (var i = 0; i < defJSON.hit_effects.length; i++) {
        if (defJSON.hit_effects[i].abil_def) {
          this.loadNestedAbilityDefs([defJSON.hit_effects[i]]);
        }
      }
    }
  }

  getAccuracy() {
    return this.accuracy;
  }
  // Happens every time this projectile hits something, including on the final hit.
  getHitEffects() {
    return this.hitEffects;
  }
  // Happens on each collision, but not on the "timeout hit" one.
  getCollisionEffects() {
    return this.collisionEffects;
  }
  // Happens on the final hit
  getTimeoutHitEffects() {
    return this.timeoutHitEffects;
  }
  // Happens when the projectile runs out of time.
  getTimeoutEffects() {
    return this.timeoutEffects;
  }
  getOnKillEffects() {
    return this.onKillEffects;
  }

  getProjectileType() {
    return this.projectileType;
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
      if (this.accuracy.isAccuracyDefined()) {
        const maxDist = this.accuracy.maxDist;
        const minDist = this.accuracy.minDist;
        dist = Math.min(dist, maxDist);
        circleSize = this.accuracy.getCircleRadius(dist);
      }

      let circleCenter = {
        x: startPos.x + Math.cos(angle) * dist,
        y: startPos.y + Math.sin(angle) * dist
      };
      dist -= circleSize;
      lineGraphic.lineStyle(1, color)
        .moveTo(startPos.x, startPos.y)
        .lineTo(
          startPos.x + Math.cos(angle) * dist,
          startPos.y + Math.sin(angle) * dist
        );

      lineGraphic.drawCircle(circleCenter.x, circleCenter.y, circleSize);

      lineGraphic.beginFill(color);
      lineGraphic.drawCircle(circleCenter.x, circleCenter.y, innerCircleSize);

      return lineGraphic;
    }
  }

  getCollisionBehaviours() {
    let max_bounces = this.getOptionalParam('max_bounces');
    if (this.collisionBehaviours === null || this.collisionBehaviours === undefined) {
      if (max_bounces) {
        this.collisionBehaviours = [
          {behaviour: CollisionBehaviour.BOUNCE, count: max_bounces}
        ];
      } else {
        this.collisionBehaviours = [];
      }
    }
    return this.collisionBehaviours;
  }
}

ProjectileAbilityDef.Shapes = {
  SINGLE_SHOT: 'SINGLE_SHOT',
  TRI_SHOT: 'TRI_SHOT',
  CHAIN_SHOT: 'CHAIN_SHOT',
  SPRAY_SHOT: 'SPRAY_SHOT',
  RAIN: 'RAIN',
  BULLET_EXPLOSION: 'BULLET_EXPLOSION',
  WAVE: 'WAVE',
  DOUBLE_WAVE: 'DOUBLE_WAVE',
  INSTANT_AOE: 'INSTANT_AOE',
};
