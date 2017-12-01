class FrozenOrbProjectile extends BouncingProjectile {
  constructor(startPoint, targetPoint, angle, abilityDef, projectileOptions, style) {
    super(startPoint, targetPoint, angle, abilityDef, projectileOptions, style);
    var targetVec = Victor(targetPoint.x - startPoint.x, targetPoint.y - startPoint.y);
    this.num_bullets = abilityDef.getOptionalParam('num_bullets', 50);
    this.shot_gap = abilityDef.getOptionalParam('shot_gap', 4);

    this.shot_start_tick = abilityDef.getOptionalParam('shot_start_tick', 20);
    this.speedDecayDelay = targetVec.length() / this.speed;

    this.speedDecay = this.speed / this.speedDecayDelay / 3;

    this.size = abilityDef.getOptionalParam('size', 10);
    this.abilityDef = abilityDef;
    if (!this.abilityDef.shardDef) {
      this.abilityDef.shardDef = this.abilityDef.clone();
      var shard_style = this.abilityDef.getOptionalParam('shard_style');
      if (shard_style) {
        this.abilityDef.shardDef.abilityStyle = AbilityStyle.loadFromJSON(shard_style);
      } else {
        this.abilityDef.shardDef.abilityStyle = AbilityStyle.FALLBACK_STYLE;
      }
    }

    this.shot_duration = this.shot_gap * this.num_bullets;
    this.duration = this.shot_duration + this.shot_start_tick;
    this.startDuration = this.duration;
  }

  runTick(boardState, boardWidth, boardHeight) {
    super.runTick(boardState, boardWidth, boardHeight);
    var thisTick = boardState.tick - this.startTick - this.shot_start_tick;
    var lastTick = boardState.tick - this.startTick - this.shot_start_tick - 1;
    if (
      thisTick >= 0 &&
      lastTick / this.shot_gap - Math.floor(lastTick / this.shot_gap) < 1 &&
      thisTick / this.shot_gap - Math.floor(lastTick / this.shot_gap) >= 1
    ) {
      var angle = (boardState.tick / this.shot_gap) / (this.shot_duration / this.shot_gap)
        * Math.PI * 2 * 7
      var target = {x: this.x + Math.cos(angle), y: this.y + Math.sin(angle)};

      boardState.addProjectile(
        Projectile.createProjectile(
          ProjectileShape.ProjectileTypes.HIT,
          {x: this.x, y: this.y},
          target,
          angle,
          this.abilityDef.shardDef,
          {}
        ).addUnitHitCallback(this.unitHitCallback.bind(this))
      );
    }
  }

  hitUnit(boardState, unit, intersection) {
    this.wallsHit = 0;
    if (!unit.readyToDelete()) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }
  }

  shouldBounceOffLine(line) {
    return true;
  }
}
