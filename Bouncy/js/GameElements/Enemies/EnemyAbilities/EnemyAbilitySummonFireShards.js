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

  createUnit(targetPos) {
    return new UnitFireShard(targetPos.x, targetPos.y, 0);
  }
}
