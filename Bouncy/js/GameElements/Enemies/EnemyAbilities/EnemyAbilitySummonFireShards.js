class EnemyAbilitySummonFireShards extends EnemyAbilitySummonUnits {
  constructor(unit, numShards) {
    super(unit, numShards);
    this.MAX_Y = 3;
  }

  getValidCoords(boardState) {
    let unitCoord = boardState.sectors.getGridCoord(this.unit);
    let validCoords = [];
    for (let x = 0; x < boardState.sectors.columns; x++) {
      for (let y = 0; y < this.MAX_Y; y++) {
        let targetPos = boardState.sectors.getPositionFromGrid({x, y});
        if (boardState.sectors.canUnitEnter(boardState, null, targetPos)) {
          validCoords.push(targetPos);
        }
      }
    }
    return validCoords;
  }

  createForecast(boardState, unit, abilityIndex) {
    return new AbilityForecast(unit, abilityIndex, AbilityForecast.TARGET_TYPES.SELF, []);
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
    totalForecasts,
  ) {
    const circleSize = 4;

    var lineGraphic = new PIXI.Graphics();
    const iconPos = this.getForecastIconPosition(user, forecastIndex, totalForecasts);

    lineGraphic.lineStyle(1, 0xFFFFFF)
      .beginFill(color)
      .drawCircle(iconPos.x, iconPos.y + 4, circleSize)
      .drawCircle(iconPos.x - 5, iconPos.y - 5, circleSize)
      .drawCircle(iconPos.x + 5, iconPos.y - 5, circleSize);

    return lineGraphic;
  }

  createUnit(targetPos) {
    return new UnitFireShard(targetPos.x, targetPos.y, 0);
  }
}
