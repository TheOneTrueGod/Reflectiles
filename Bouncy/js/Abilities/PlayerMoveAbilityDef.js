class PlayerMoveAbilityDef extends AbilityDef {
  constructor(defJSON, subAbility) {
    super(defJSON, subAbility);

    this.maxDist = idx(defJSON, 'max_dist', 100);

    this.hitEffects = defJSON['hit_effects'] ? defJSON['hit_effects'] : [];
    this.collisionEffects = defJSON['collision_effects'] ? defJSON['collision_effects'] : [];
    this.timeoutHitEffects = defJSON['timeout_hit_effects'] ? defJSON['timeout_hit_effects'] : [];
    this.timeoutEffects = defJSON['timeout_effects'] ? defJSON['timeout_effects'] : [];
    this.onKillEffects = defJSON['on_kill_effects'] ? defJSON['on_kill_effects'] : [];

    this.accuracy = new ProjectileAccuracy(defJSON.accuracy);
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
    return super.getValidTarget(target, playerID);
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    var angle = Math.atan2(targetPoint.y - castPoint.y, targetPoint.x - castPoint.x);
    var dist = ((targetPoint.x - castPoint.x) ** 2 + (targetPoint.y - castPoint.y) ** 2) ** 0.5;
    dist = Math.min(dist, this.maxDist);
    let target = {
      x: castPoint.x + Math.cos(angle) * dist,
      y: castPoint.y + Math.sin(angle) * dist
    };

    super.doActionOnTick(playerID, tick, boardState, castPoint, target);
    if (tick == 0) {
      var playerUnit = boardState.getPlayerUnit(playerID);
      playerUnit.setMoveTarget(target.x, target.y);
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > 20;
  }

  createTargettingGraphic(startPos, endPos, color) {
    var lineGraphic = new PIXI.Graphics();
    let circleSize = 5;
    const innerCircleSize = 3;
    var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
    var dist = ((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2) ** 0.5;
    dist = Math.min(dist, this.maxDist);

    let circleCenter = {
      x: startPos.x + Math.cos(angle) * dist,
      y: startPos.y + Math.sin(angle) * dist
    };
    dist -= circleSize * 2;
    let xOffset = Math.cos(angle + Math.PI / 2) * circleSize;
    let yOffset = Math.sin(angle + Math.PI / 2) * circleSize;
    // Left Line
    lineGraphic.lineStyle(1, color)
      .moveTo(startPos.x + xOffset, startPos.y + yOffset)
      /* Two Lines */
      .lineTo(
        startPos.x + Math.cos(angle) * dist + xOffset,
        startPos.y + Math.sin(angle) * dist + yOffset
      )
      .moveTo(
        startPos.x + Math.cos(angle) * dist - xOffset,
        startPos.y + Math.sin(angle) * dist - yOffset
      )
      .lineTo(startPos.x - xOffset, startPos.y - yOffset)
      /* Triangle */
      .moveTo(
        startPos.x + Math.cos(angle) * dist + xOffset,
        startPos.y + Math.sin(angle) * dist + yOffset
      )
      .lineTo(circleCenter.x, circleCenter.y)
      .lineTo(
        startPos.x + Math.cos(angle) * dist - xOffset,
        startPos.y + Math.sin(angle) * dist - yOffset
      );

    return lineGraphic;
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
