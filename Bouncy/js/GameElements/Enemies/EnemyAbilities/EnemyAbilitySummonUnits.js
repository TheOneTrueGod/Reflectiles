class EnemyAbilitySummonUnits extends EnemyAbility {
  constructor(unit, numUnits) {
    super(unit);
    this.numUnits = numUnits;
  }

  doEffects(boardState) {
    let validCoords = this.getValidCoords(boardState);
    shuffle(validCoords);

    for (let i = 0; i < Math.min(this.numUnits, validCoords.length); i++) {
      let newUnit = this.createUnit(validCoords[i]);
      boardState.addUnit(newUnit);
      newUnit.playSpawnEffect(boardState, this.unit, 15, Unit.SpawnEffects.DEFAULT);
    }
  }

  getValidCoords(boardState) {
    return [];
  }

  createUnit(targetPos) {
    throw new Error("You should override this.");
  }
}
