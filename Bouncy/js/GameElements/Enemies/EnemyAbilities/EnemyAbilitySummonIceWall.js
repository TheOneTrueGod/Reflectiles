class EnemyAbilitySummonIceWall extends EnemyAbilitySummonUnits {
  constructor(unit, numWalls) {
    super(unit, numWalls);
    this.MIN_Y = 4;
    this.MAX_Y = 6;
  }

  getValidCoords(boardState) {
    let unitCoord = boardState.sectors.getGridCoord(this.unit);
    let validCoords = [];
    for (let x = 0; x < boardState.sectors.columns; x++) {
      for (let y = this.MIN_Y; y < this.MAX_Y; y++) {
        let targetPos = boardState.sectors.getPositionFromGrid({x, y});
        if (boardState.sectors.getUnitsAtGridSquare(x, y).length === 0) {
          validCoords.push(targetPos);
        }
      }
    }
    return validCoords;
  }

  createUnit(targetPos) {
    return new UnitIceWall(targetPos.x, targetPos.y, 0);
  }
}
