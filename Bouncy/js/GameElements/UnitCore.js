class UnitCore extends Unit {
  constructor(x, y, owner, id) {
    super(x, y, owner, id);
  }

  getDefensePercent() {
    return 1;
  }

  createSprite(hideHealthBar) {
    var sprite = new PIXI.Sprite(
      PIXI.loader.resources['core'].texture
    );

    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xFFFF00);
    graphics.drawCircle(0, 0, 20);
    graphics.endFill();

    this.selectedSprite = graphics;
    this.selectedSprite.visible = false;

    sprite.addChild(graphics);
    sprite.anchor.set(0.5);

    if (this.owner == $('#gameContainer').attr('playerID')) {
      if (!UnitCore.OUTLINE_FILTER_RED) {
        UnitCore.OUTLINE_FILTER_RED = new PIXI.filters.OutlineFilter(2, 0xff4000);
      }
      sprite.filters = [UnitCore.OUTLINE_FILTER_RED];
    } else {
      sprite.alpha = 0.8;
    }

    return sprite;
  }

  isRealUnit() {
    return true;
  }

  canSelect() {
    return MainGame.playerID == this.owner;
  }

  touchedByEnemy(boardState, unit, suppressKnockback) {
    if (unit.damage) {
      boardState.dealDamage(Math.ceil(unit.damage * this.getDefensePercent()));
      EffectFactory.createDamagePlayersEffect(
        boardState,
        this.x,
        this.y
      );
      if (!suppressKnockback) {
        this.knockback(boardState);
      }
    }
  }

  hitByEnemyProjectile(boardState, projectile) {
    boardState.dealDamage(Math.ceil(projectile.DAMAGE * this.getDefensePercent()));
    EffectFactory.createDamagePlayersEffect(
      boardState,
      this.x,
      this.y
    );
    //this.knockback(boardState);
  }

  knockback(boardState) {
    if (this.y < boardState.getUnitThreshold()) {
      this.y = this.y + Unit.UNIT_SIZE;
    }
  }

  getMoveSpeed() {
    if (this.abilityMoveSpeed) {
      return this.abilityMoveSpeed;
    }
    return UnitCore.BASE_MOVE_SPEED;
  }

  checkForCollisions(boardState, moveAng) {
    let unitsAtPos = boardState.sectors.getUnitsAtPosition(this.x, this.y);
    let collided = false;
    const gridCoord = boardState.sectors.getGridCoord({x: this.x, y: this.y});
    if (gridCoord.y == boardState.sectors.rows - 1) {
      // No collisions in the last row.  Enemy units aren't allowed there.
      return;
    }

    for (let i = 0; i < unitsAtPos.length; i++) {
      let unit = boardState.findUnit(unitsAtPos[i])
      if (boardState.isEnemyUnit(unit)) {
        this.touchedByEnemy(boardState, unit, true);
        if (this.moveAbility !== UnitCore.TOUCHED_ENEMY) {
          this.setMoveTarget(
            this.x - Math.cos(moveAng) * Unit.UNIT_SIZE,
            this.y - Math.sin(moveAng) * Unit.UNIT_SIZE,
            UnitCore.TOUCHED_ENEMY,
          );
        } else {
          this.setMoveTarget(this.x, this.y + Unit.UNIT_SIZE, UnitCore.TOUCHED_ENEMY);
        }

        collided = true;
      }
    }
    return collided;
  }

  runTick(boardState, phase) {
    if (
      !this.moveTarget &&
      phase !== TurnPhasesEnum.PLAYER_PRE_MINOR &&
      phase !== TurnPhasesEnum.PLAYER_ACTION &&
      phase !== TurnPhasesEnum.PLAYER_MINOR
    ) {
      this.checkForCollisions(boardState, Math.PI / 2 * 3);
    }
    if (this.moveTarget) {
      var moveVec = Victor(this.moveTarget.x - this.x, this.moveTarget.y - this.y);
      var ang = Math.atan2(
        this.moveTarget.y - this.y,
        this.moveTarget.x - this.x
      );

      var moveSpeed = this.getMoveSpeed();

      let oldPosition = {x: this.x, y: this.y};
      let moveOver = false;

      if (moveVec.length() <= moveSpeed) {
        this.x = this.moveTarget.x;
        this.y = this.moveTarget.y;
        this.moveTarget = null;
        moveOver = true;
      } else {
        this.x += Math.cos(ang) * moveSpeed;
        this.y += Math.sin(ang) * moveSpeed;
      }

      if (
        !this.moveAbility ||
        this.moveAbility.playerCollidesWithEnemies()
      ) {
        if (this.checkForCollisions(boardState, ang)) {
          moveOver = false;
        }
      }

      if (this.moveAbility) {
        let prevCoord = boardState.sectors.getGridCoord(oldPosition);
        let newCoord = boardState.sectors.getGridCoord({x: this.x, y: this.y});

        if (this.moveAbility.doCollisionEffects && (prevCoord.y !== newCoord.y || prevCoord.x !== newCoord.x)) {
          let unitsAtPos = boardState.sectors.getUnitsAtPosition(this.x, this.y);
          for (let i = 0; i < unitsAtPos.length; i++) {
            let unit = boardState.findUnit(unitsAtPos[i])
            if (boardState.isEnemyUnit(unit)) {
              this.moveAbility.doCollisionEffects(boardState, unit, this);
            }
          }
        }
        if (moveOver) {
          this.moveAbility = null;
          this.abilityMoveSpeed = null;
        }
      }
    }
    this.gameSprite.x = this.x;
    this.gameSprite.y = this.y;
  }
}

UnitCore.BASE_MOVE_SPEED = 4;

UnitCore.loadFromServerData = function(serverData) {
  return Unit.loadFromServerData(serverData);
}

UnitCore.TOUCHED_ENEMY = {playerCollidesWithEnemies: () => { return false; }};

UnitCore.AddToTypeMap();
