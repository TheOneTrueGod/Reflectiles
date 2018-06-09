class EnemyAbilitySummonFireShards extends EnemyAbility {
  constructor(unit, numShards) {
    super(unit);
    this.numShards = numShards;
    this.MAX_Y = 3;
  }

  doEffects(boardState) {
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

    shuffle(validCoords);

    for (let i = 0; i < Math.min(this.numShards, validCoords.length); i++) {
      let targetPos = validCoords[i];
      let newUnit = new UnitFireShard(targetPos.x, targetPos.y, 0);
      boardState.addUnit(newUnit);
      newUnit.playSpawnEffect(boardState, this.unit, 15, Unit.SpawnEffects.DEFAULT);
    }
  }
}
