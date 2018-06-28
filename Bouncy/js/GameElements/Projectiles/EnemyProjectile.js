class EnemyProjectile extends Projectile {
  constructor(startPoint, targetPoint, angle, projectileOptions) {
    super('enemy', startPoint, targetPoint, angle, null, projectileOptions);
    this.FRIENDLY_FIRE = idx(projectileOptions, 'friendly_fire', false);
    this.DAMAGE = idx(projectileOptions, 'damage_to_players', 1);
    this.abilityStyle = new AbilitySheetAbilityStyle({
      coords: {left: 211, top: 10, right: 221, bottom: 17},
      rotation: 0,
      scale: 3,
    });
  }

  getStyle() {
    return this.abilityStyle;
  }

  shouldBounceOffLine(line) {
    if (line.unit instanceof UnitBasic) {
      return false;
    }

    if (line.unit instanceof ZoneEffect) {
      return line.unit.hitsEnemyProjectiles();
    }

    if (line instanceof BorderWallLine) {
      return line.side !== BorderWallLine.BOTTOM;
    }

    return true;
  }

  runTick(boardState, boardWidth, boardHeight) {
    super.runTick(boardState, boardWidth, boardHeight);
    let playerUnits = boardState.getPlayerUnitsAtPosition(this);
    let hitSomething = false;
    for (let playerUnit of playerUnits) {
      if (distSqr(this, playerUnit) <= Math.pow(Unit.UNIT_SIZE / 2, 2)) {
        this.delete();
        playerUnit.hitByEnemyProjectile(boardState, this);
        hitSomething = true;
      }
    }

    if (this.y > boardState.boardSize.height) {
      hitSomething = true;
      this.delete();
      boardState.dealDamage(this.DAMAGE);
      EffectFactory.createDamagePlayersEffect(
        boardState,
        this.x,
        this.y
      );
    }
  }

  hitUnit(boardState, unit, intersection) {
    if (unit instanceof UnitBasic && !this.FRIENDLY_FIRE) {
      return;
    }
    if (unit instanceof ZoneEffect) {
      if (intersection && intersection.line.unit && intersection.line.unit.triggerHit) {
        intersection.line.unit.triggerHit(boardState, unit, intersection, this);
      }
      return;
    }
    super.hitUnit(boardState, unit, intersection);
    this.unitHitCallback(
      boardState,
      unit,
      intersection,
      this
    );
    this.readyToDel = true;
    if (intersection.line && !unit.readyToDelete()) {
      EffectFactory.createDamageEffect(boardState, intersection);
    }
  }
}
