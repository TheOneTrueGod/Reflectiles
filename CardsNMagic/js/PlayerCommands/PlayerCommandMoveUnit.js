class PlayerCommandMoveUnit extends PlayerCommand {
  constructor(x, y, tickStart, unitID) {
    super(x, y, tickStart, null);
    this.unitID = unitID;
  }

  doActionOnTick(tick, boardState) {
    if (tick == this.tickStart) {
      var unit = MainGame.boardState.findUnit(this.unitID);
      if (!unit) { alert("Couldn't find unit with id;" + this.unitID); }
      unit.setMoveTarget(this.x, this.y);
    }
  }

  setFromServerData(serverData) {
    this.unitID = serverData.unitID;
  }

  serializeChildData() {
    return {'unitID': this.unitID};
  }
}

PlayerCommandMoveUnit.AddToTypeMap();
