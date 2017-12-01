const MAX_WALLS_HIT = 3;
class Projectile {
  constructor(startPoint, targetPoint, angle, abilityDef, projectileOptions) {
    this.x = startPoint.x;
    this.y = startPoint.y;
    this.angle = angle;
    this.speed = idx(projectileOptions, 'speed', 8);
    if (abilityDef) {
      this.speed = abilityDef.getOptionalParam('speed', this.speed);
    }
    this.size = idx(projectileOptions, 'size', 5);
    this.trailLength = idx(projectileOptions, 'trail_length', 5);
    this.gravity = idx(projectileOptions, 'gravity', null);
    this.speedDecay = idx(projectileOptions, 'speed_decay', null);
    this.speedDecayDelay = 0;
    this.abilityDef = abilityDef;
    if (abilityDef) {
      this.destroyOnWall = abilityDef.getOptionalParam('destroy_on_wall', false);
    }
    this.destroyOnWall = idx(projectileOptions, 'destroy_on_wall', this.destroyOnWall);
    if (this.gravity) { this.gravity = Victor(this.gravity.x, this.gravity.y); }
    if (this.speedDecay) { this.speedDecayDelay = idx(this.speedDecay, 'delay', 0); }
    if (this.speedDecay && this.speedDecay.x && this.speedDecay.y) {
      this.speedDecay = Victor(this.speedDecay.x, this.speedDecay.y);
    }
    this.gameSprite = null;
    this.readyToDel = false;
    this.unitHitCallback = null;
    this.timeoutCallback = null;
    this.duration = -1;
    this.wallsHit = 0;
    this.lastCollisionPoint = null;
    if (projectileOptions && projectileOptions.hit_effects) {
      this.hitEffects = projectileOptions.hit_effects;
    }
  }

  addUnitHitCallback(unitHitCallback) {
    this.unitHitCallback = unitHitCallback;
    return this;
  }

  addTimeoutCallback(timeoutCallback) {
    this.timeoutCallback = timeoutCallback;
    return this;
  }

  findCollisionBoxesForLine(boardState, line) {
    var walls = boardState.getGameWalls();

    var allUnits = boardState.sectors.getUnitsInSquare(line);
    allUnits.forEach((unitID) => {
      var unit = boardState.findUnit(unitID);
      if (!unit.canProjectileHit(this)) {
        return;
      }
      var collisionBox = unit.getCollisionBox();
      for (var i = 0; i < collisionBox.length; i++) {
        walls.push(collisionBox[i]);
      }
    });
    return walls;
  }

  createTrail(boardState) {
    this.getStyle().createProjectileTrail(boardState, this);
  }

  createExplosionEffect(boardState, targetPos) {
    var style = this.getStyle();
    if (style) {
      style.createExplosion(boardState, targetPos, this);
    } else {
      var AOESprite = 'sprite_explosion';
      EffectFactory.createExplosionSpriteAtUnit(boardState, targetPos, AOESprite);
    }
  }

  runTick(boardState, boardWidth, boardHeight) {
    if (this.startTick === undefined) {
      this.startTick = boardState.tick
    }
    var self = this;

    if (this.duration !== -1) {
      this.duration -= 1;
      if (this.duration <= 0) {
        this.delete();
        if (this.timeoutCallback) {
          this.timeoutCallback(boardState, this);
        }
      }
    }

    var speed = Victor(Math.cos(this.angle) * this.speed, Math.sin(this.angle) * this.speed);
    if (
      this.speedDecay instanceof Victor &&
      boardState.tick - this.startTick >= this.speedDecayDelay
    ) {
      speed.multiply(this.speedDecay);
    }
    if (this.gravity) {
      speed.add(this.gravity);
    }

    this.angle = speed.angle();
    this.speed = speed.length();

    if (
      typeof(this.speedDecay) == 'number' &&
      boardState.tick - this.startTick >= this.speedDecayDelay
    ) {
      this.speed = Math.max(this.speed - this.speedDecay, 0);
    }

    this.createTrail(boardState);

    var reflectionResult = Physics.doLineReflections(
      this.x, this.y, this.angle, this.speed * MainGame.DEBUG_SPEED,
      this.findCollisionBoxesForLine.bind(this, boardState),
      (intersection) => {
        if (intersection.line.unit && !this.readyToDelete()) {
          self.hitUnit(boardState, intersection.line.unit, intersection);
        }
        if (intersection.line instanceof BorderWallLine) {
          self.hitWall(boardState, intersection);
        }
      },
      this.shouldBounceOffLine.bind(this)
    );

    for (var i = 0; i < reflectionResult.intersections.length; i++) {
      var intersection = reflectionResult.intersections[i];
      if (intersection.line.unit && !this.readyToDelete()) {
        self.hitUnit(boardState, intersection.line.unit, intersection);
      }
      if (intersection.line instanceof BorderWallLine) {
        self.hitWall(boardState, intersection);
      }
    }

    var endPoint = reflectionResult.reflection_lines[
      reflectionResult.reflection_lines.length - 1
    ];
    this.x = endPoint.x2;
    this.y = endPoint.y2;
    this.angle = endPoint.getVector().horizontalAngle();

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    this.getStyle().rotateProjectile(this, this.gameSprite);

    if (
      this.x <= 0 && !(this.gravity && this.gravity.x > 0) ||
      this.x > boardWidth && !(this.gravity && this.gravity.x < 0) ||
      this.y < 0 && !(this.gravity && this.gravity.y > 0) ||
      this.y > boardHeight && !(this.gravity && this.gravity.y < 0)
    ) {
      this.delete();
    }
  }

  shouldBounceOffLine(line) {
    if (line instanceof BorderWallLine) {
      return line.side !== BorderWallLine.BOTTOM;
    }
    return true;
  }

  hitUnit(boardState, unit, intersection) {
    this.wallsHit = 0;
    this.lastCollisionPoint = intersection;
  }

  hitWall(boardState, intersection) {
    if (this.destroyOnWall) {
      if (intersection.line instanceof BorderWallLine) {
        if (typeof(this.destroyOnWall) == "object" && this.destroyOnWall.indexOf) {
          if (this.destroyOnWall.indexOf(intersection.line.side) !== -1) {
            this.delete();
          }
        } else if (!(
          intersection.line.side == BorderWallLine.LEFT && this.gravity && this.gravity.x > 0 ||
          intersection.line.side == BorderWallLine.RIGHT && this.gravity && this.gravity.x < 0 ||
          intersection.line.side == BorderWallLine.TOP && this.gravity && this.gravity.y > 0 ||
          intersection.line.side == BorderWallLine.BOTTOM && this.gravity && this.gravity.y < 0
        )) {
          this.delete();
        }
      }
    }
    this.lastCollisionPoint = intersection;
    this.wallsHit += 1;
  }

  delete() {
    this.readyToDel = true;
  }

  readyToDelete() {
    return this.readyToDel || this.wallsHit > MAX_WALLS_HIT;
  }

  getStyle() {
    var style = this.abilityDef ? this.abilityDef.getStyle() : null;
    if (!style) {
      return AbilityStyle.FALLBACK_STYLE;
    }
    return style;
  }

  createSprite() {
    return this.getStyle().createProjectileSprite(this);
  }

  addToStage(stage) {
    if (!this.gameSprite) {
      this.gameSprite = this.createSprite();
    }

    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;

    stage.addChild(this.gameSprite);
  }

  removeFromStage(stage) {
    stage.removeChild(this.gameSprite);
  }
}

Projectile.createProjectile = function(
  projectileType, startPoint, targetPoint, angle, abilityDef, projectileOptions
) {
  switch (projectileType) {
    case ProjectileShape.ProjectileTypes.BOUNCE:
      return new BouncingProjectile(startPoint, targetPoint, angle, abilityDef);
    case ProjectileShape.ProjectileTypes.HIT:
      return new SingleHitProjectile(startPoint, targetPoint, angle, abilityDef, projectileOptions);
    case ProjectileShape.ProjectileTypes.PENETRATE:
      return new PenetrateProjectile(startPoint, targetPoint, angle, abilityDef, projectileOptions);
    case ProjectileShape.ProjectileTypes.PASSTHROUGH:
      return new PassthroughProjectile(startPoint, targetPoint, angle,
        abilityDef, abilityDef.getOptionalParam("num_hits", 5), projectileOptions);
    case ProjectileShape.ProjectileTypes.TIMEOUT:
      return new TimeoutProjectile(startPoint, targetPoint, angle, abilityDef, projectileOptions);
    case ProjectileShape.ProjectileTypes.FROZEN_ORB:
      return new FrozenOrbProjectile(startPoint, targetPoint, angle, abilityDef, projectileOptions);
    case ProjectileShape.ProjectileTypes.GHOST:
      return new GhostProjectile(startPoint, targetPoint, angle, abilityDef);
    case ProjectileShape.ProjectileTypes.GRENADE:
      return new GrenadeProjectile(startPoint, targetPoint, angle, abilityDef);
  }
  throw new Error("projectileType [" + projectileType + "] not handled");
};
