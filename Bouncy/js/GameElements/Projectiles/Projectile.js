class Projectile {
  constructor(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions) {
    this.playerID = playerID;
    this.x = startPoint.x;
    this.y = startPoint.y;
    this.angle = angle;
    this.speed = idx(projectileOptions, 'speed', 8);
    this.gravity = idx(projectileOptions, 'gravity', null);
    this.speedDecay = idx(projectileOptions, 'speed_decay', null);
    this.speedDecayDelay = 0;
    this.wallBounces = 2;
    if (abilityDef) {
      this.speed = abilityDef.getOptionalParam('speed', this.speed);
      this.gravity = abilityDef.getOptionalParam('gravity', this.gravity);
      this.speedDecay = abilityDef.getOptionalParam('speed_decay', this.speedDecay);
      this.wallBounces = abilityDef.getOptionalParam('wall_bounces', this.wallBounces);
    }
    if (this.gravity) { this.gravity = Victor(this.gravity.x, this.gravity.y); }
    if (this.speedDecay) { this.speedDecayDelay = idx(this.speedDecay, 'delay', 0); }
    if (this.speedDecay && this.speedDecay.x && this.speedDecay.y) {
      this.speedDecay = Victor(this.speedDecay.x, this.speedDecay.y);
    }

    this.size = idx(projectileOptions, 'size', 5);
    this.trailLength = idx(projectileOptions, 'trail_length', 5);

    this.abilityDef = abilityDef;
    if (abilityDef) {
      this.destroyOnWall = abilityDef.getOptionalParam('destroy_on_wall', false);
    }
    this.destroyOnWall = idx(projectileOptions, 'destroy_on_wall', this.destroyOnWall);

    this.gameSprite = null;
    this.readyToDel = false;
    this.unitHitCallback = null;
    this.eventListeners = {};
    this.timeoutCallback = null;
    this.duration = -1;
    if (abilityDef) {
      this.duration = abilityDef.getOptionalParam('duration', this.duration);
    }
    this.wallsHit = 0;
    this.lastCollisionPoint = null;
    this.projectileStyle = null;
    this.buffs = {};
    if (projectileOptions && projectileOptions.hit_effects) {
      this.hitEffects = projectileOptions.hit_effects;
    }

    this.behaviourTracker = {};
    this.collisionBehaviours = [];
    if (projectileOptions && projectileOptions.collision_behaviours) {
      this.collisionBehaviours = projectileOptions.collision_behaviours;
    } else if (abilityDef) {
      this.collisionBehaviours = abilityDef.getCollisionBehaviours();
    }
    this.speed += 0.0000001;
  }

  setStyle(style) {
    this.projectileStyle = style;
    return this;
  }

  addUnitHitCallback(unitHitCallback) {
    this.addProjectileEventListener(
      ProjectileEvents.ON_HIT, unitHitCallback);
    return this;
  }

  addTimeoutHitCallback(timeoutHitCallback) {
    this.addProjectileEventListener(
      ProjectileEvents.ON_TIMEOUT, timeoutHitCallback);
    return this;
  }

  addTimeoutCallback(timeoutCallback) {
    this.timeoutCallback = timeoutCallback;
    return this;
  }

  cloneListeners(otherProjectile) {
    for (let event in otherProjectile.eventListeners) {
      for (let listener of otherProjectile.eventListeners[event]) {
        this.addProjectileEventListener(event, listener);
      }
    }
    return this;
  }

  addProjectileEventListener(event, eventCallback) {
    if (this.eventListeners[event] === undefined) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(eventCallback);
  }

  throwProjectileEvent(event, boardState, unit, intersection) {
    let damageDealt = 0;
    if (this.eventListeners[event] !== undefined) {
      for (let listener of this.eventListeners[event]) {
        damageDealt += listener(boardState, unit, intersection, this);
      }
    }
    return damageDealt;
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

  addBuff(buff) {
    if (this.buffs.hasOwnProperty(buff.constructor.name)) {
      return;
    }

    this.buffs[buff.constructor.name] = buff;
  }

  cloneBuffsFrom(otherProjectile) {
    for (var key in otherProjectile.buffs) {
      this.addBuff(otherProjectile.buffs[key].clone());
    }
    return this;
  }

  getBuff(buffClassName) {
    if (this.buffs.hasOwnProperty(buffClassName)) {
      return this.buffs[buffClassName];
    }
    return null;
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
    if (line.forcePassthrough(this)) {
      return false;
    }
    let nextBehaviour = this.determineNextIntersectionBehaviour(line);

    return nextBehaviour === CollisionBehaviour.BOUNCE;
  }

  incrementCollisionBehaviour(behaviour) {
    if (!this.behaviourTracker[behaviour]) {
      this.behaviourTracker[behaviour] = 0;
    }
    this.behaviourTracker[behaviour] += 1;
  }

  determineNextIntersectionBehaviour(intersection) {
    let i1 = new Victor(intersection.x1, intersection.y1);
    let i2 = new Victor(intersection.x2, intersection.y2);
    let p = new Victor(this.x, this.y);

    let direction = (i2.x - i1.x) * (p.y - i1.y) - (i2.y - i1.y) * (p.x - i1.x);

    if (direction >= 0) {
      return CollisionBehaviour.NOTHING;
    }

    let behaviours = this.collisionBehaviours;

    let behavioursTaken = {};

    for (let i = 0; i < behaviours.length; i++) {
      if (this.behaviourTracker[behaviours[i].behaviour] === undefined) {
        this.behaviourTracker[behaviours[i].behaviour] = 0;
      }
      if (behavioursTaken[behaviours[i].behaviour] === undefined) {
        behavioursTaken[behaviours[i].behaviour] = this.behaviourTracker[behaviours[i].behaviour];
      }
      behavioursTaken[behaviours[i].behaviour] -= behaviours[i].count;
      if (behaviours[i].count == -1 || behavioursTaken[behaviours[i].behaviour] < 0) {
        return behaviours[i].behaviour;
      }
    }
    return CollisionBehaviour.TIMEOUT;
  }

  hitUnit(boardState, unit, intersection) {
    this.lastCollisionPoint = intersection;
  }

  hitWall(boardState, intersection) {
    if (this.destroyOnWall !== false) {
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
    if (this.wallsHit > this.wallBounces && this.timeoutCallback) {
      this.timeoutCallback(boardState, this);
    }
  }

  delete() {
    this.readyToDel = true;
  }

  readyToDelete() {
    return this.readyToDel || this.wallsHit > this.wallBounces;
  }

  getStyle() {
    if (this.projectileStyle) {
      return this.projectileStyle;
    }
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
  playerID, projectileType, startPoint, targetPoint, angle, abilityDef, projectileOptions
) {
  switch (projectileType) {
    case ProjectileShape.ProjectileTypes.STANDARD:
      return new StandardProjectile(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions);
    case ProjectileShape.ProjectileTypes.PENETRATE:
      return new PenetrateProjectile(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions);
    case ProjectileShape.ProjectileTypes.TIMEOUT:
      return new TimeoutProjectile(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions);
    case ProjectileShape.ProjectileTypes.FROZEN_ORB:
      return new FrozenOrbProjectile(playerID, startPoint, targetPoint, angle, abilityDef, projectileOptions);
    case ProjectileShape.ProjectileTypes.GHOST:
      return new GhostProjectile(playerID, startPoint, targetPoint, angle, abilityDef);
    case ProjectileShape.ProjectileTypes.GRENADE:
      return new GrenadeProjectile(playerID, startPoint, targetPoint, angle, abilityDef);
  }
  throw new Error("projectileType [" + projectileType + "] not handled");
};

CollisionBehaviour = {
  PASSTHROUGH: 'PASSTHROUGH',
  BOUNCE: 'BOUNCE',
  TIMEOUT: 'TIMEOUT',
  NOTHING: 'NOTHING',
};

Projectile.BuffTypes = {
  DAMAGE: 'DAMAGE',
};

ProjectileEvents = {
  ON_HIT: 'ON_HIT',
  ON_TIMEOUT: 'ON_TIMEOUT',
  ON_BOUNCE: 'ON_BOUNCE',
  ON_PASSTHROUGH: 'ON_PASSTHROUGH',
};
