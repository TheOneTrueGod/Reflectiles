class EnemyAbilityPersonalSpace extends EnemyAbility {
  constructor(unit, damage, minRow) {
    super(unit);
    this.damage = damage;
    this.minRow = minRow;
  }

  shootUnit(boardState, playerCastPoint) {
    var projectile = new EnemyProjectile(
      { x: this.unit.x, y: this.unit.y },
      playerCastPoint,
      Math.atan2(
        playerCastPoint.y - this.unit.y,
        playerCastPoint.x - this.unit.x
      ),
      { damage_to_players: this.damage },
      EnemyProjectileStyles.MediumShot
    );
    projectile.addUnitHitCallback(this.unitHitCallback);
    boardState.addProjectile(projectile);
  }

  doEffects(boardState, forecast, skipAnimation = false) {
    if (!this.unit.canUseAbilities()) {
      return;
    }
    let playerUnits = boardState.getAllPlayerUnits();
    for (let playerID in playerUnits) {
      let gridCoord = boardState.sectors.getGridCoord(playerUnits[playerID]);
      if (gridCoord.y < this.minRow) {
        this.shootUnit(boardState, playerUnits[playerID]);
      }
    }
  }

  createForecast(boardState, unit, abilityIndex) {
    const target = { x: 0, y: 0, x2: boardState.columns, y2: this.minRow };
    return new AbilityForecast(
      unit,
      abilityIndex,
      AbilityForecast.TARGET_TYPES.AREA,
      [target]
    );
  }

  /**
   * @param {BoardState} boardState
   * @param {*} user
   * @param {*} target
   * @param {*} color
   */
  createForecastGraphic(
    boardState,
    user,
    target,
    color,
    forecastIndex,
    totalForecasts
  ) {
    var lineGraphic = new PIXI.Graphics();
    const circleSize = 10;

    const position = boardState.sectors.getPositionFromGrid({
      x: boardState.sectors.columns,
      y: this.minRow,
    });
    lineGraphic.lineStyle(1, color).moveTo(0, position.y);
    lineGraphic.lineTo(position.x, position.y);

    const iconPos = this.getForecastIconPosition(
      user,
      forecastIndex,
      totalForecasts
    );

    lineGraphic
      .lineStyle(1, 0xffffff)
      .beginFill(color)
      .drawRect(
        iconPos.x - circleSize / 2,
        iconPos.y - circleSize / 4,
        circleSize,
        circleSize / 2
      );

    return lineGraphic;
  }

  unitHitCallback(boardState, unit, intersection, projectile) {}
}
