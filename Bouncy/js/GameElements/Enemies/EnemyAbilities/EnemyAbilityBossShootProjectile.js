class EnemyAbilityBossShootProjectile extends EnemyAbilityShootProjectile {
  /**
   * @param {BoardState} boardState 
   * @param {*} user 
   * @param {*} target 
   * @param {*} color 
   * @param {*} forecastIndex
   */
  createForecastGraphic(
    boardState,
    user,
    target,
    color,
    forecastIndex,
    totalForecasts,
  ) {
    const circleSize = 7;

    var lineGraphic = super.createForecastGraphic(boardState, user, target, color, forecastIndex, totalForecasts);
    
    const iconPos = this.getForecastIconPosition(user, forecastIndex, totalForecasts);

    lineGraphic.lineStyle(1, 0xFFFFFF)
      .beginFill(color)
      .drawCircle(iconPos.x, iconPos.y, circleSize);

    return lineGraphic;
  }
}
