class AbilityTargetCalculations {
  /* maxRange; {left: int, right: int, top: int, bottom: int}
  */
  static getBoxTarget(boardState, target, castPoint, maxRange) {
    var castPointCoord = boardState.sectors.getGridCoord(castPoint);
    var targetCoord = boardState.sectors.getGridCoord(target);

    var targX = Math.min(
      Math.max(castPointCoord.x - maxRange.left, targetCoord.x),
      castPointCoord.x + maxRange.right
    );
    var targY = Math.min(
      Math.max(castPointCoord.y - maxRange.top, targetCoord.y),
      castPointCoord.y + maxRange.bottom
    );

    target = {x: targX, y: targY};
    if (!target) { return null; }
    return MainGame.boardState.sectors.getPositionFromGrid(target);
  }
}
