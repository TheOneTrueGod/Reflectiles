class EnemyAbility {
  constructor(unit) {
    this.unit = unit;
  }

  doEffects(boardState, forecast, skipAnimation = false) {}

  createForecast(boardState, unit, abilityIndex) {}

  /**
   * @param {BoardState} boardState
   * @param {*} user
   * @param {*} target
   * @param {*} color
   */
  createForecastGraphic(
    boardState,
    user,
    endPos,
    color,
    forecastIndex,
    totalForecasts
  ) {
    const startPos = { x: user.x, y: user.y };

    // Create a new Graphics object and add it to the scene
    var lineGraphic = new PIXI.Graphics();
    let circleSize = 25;

    var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
    var dist =
      ((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2) ** 0.5;
    let maxDist = 50;

    if (dist < maxDist || true) {
      lineGraphic.lineStyle(1, color).moveTo(startPos.x, startPos.y);
      lineGraphic.lineTo(endPos.x, endPos.y);
    } else {
      // draw two line fragments, one from the source and one from the destination.
    }
    lineGraphic.drawCircle(endPos.x, endPos.y, circleSize);

    return lineGraphic;
  }

  getForecastIconPosition(user, forecastIndex, totalForecasts) {
    let pct = forecastIndex / totalForecasts + 1 / (totalForecasts * 2);

    let userSize = user.getSize();

    let left = Unit.UNIT_SIZE * (-userSize.left - 0.5);
    let right = Unit.UNIT_SIZE * (userSize.right + 0.5);

    let top = (Unit.UNIT_SIZE * (-userSize.top - 0.5)) / 4;
    let yPct = Math.sin(pct * Math.PI);

    return { x: user.x + lerp(left, right, pct), y: user.y + yPct * top };
  }
}
