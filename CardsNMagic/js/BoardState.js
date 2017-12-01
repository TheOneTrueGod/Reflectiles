class BoardState {
  constructor(stage, boardState) {
    this.stage = stage;

    this.boardStateAtStartOfTurn = null;

    this.reset();
    this.deserialize(boardState);
  }

  reset() {
    this.units = [];
    this.turn = 1;
    this.tick = 0;
    this.UNIT_ID_INDEX = 1;
  }

  deserialize(boardState) {
    if (!boardState) { return; }
    if (boardState.turn) { this.turn = boardState.turn; }
    if (boardState.tick) { this.tick = boardState.tick; }
    if (boardState.unit_id_index) { this.UNIT_ID_INDEX = boardState.unit_id_index; }
  }

  saveState() {
    this.boardStateAtStartOfTurn = this.serializeBoardState();
  }

  loadState() {
    this.reset();
    while(this.stage.children.length > 0){
      this.stage.removeChild(
        this.stage.getChildAt(0)
      );
    }

    this.deserialize(this.boardStateAtStartOfTurn);
    if (this.boardStateAtStartOfTurn.units) {
      this.loadUnits(this.boardStateAtStartOfTurn.units);
    }
  }

  loadUnits(serverData) {
    for (var i = 0; i < serverData.length; i++) {
      var unitData = serverData[i];
      var newUnit = Unit.loadFromServerData(unitData);
      this.addUnit(newUnit);
    }
  }

  addInitialPlayers() {
    for (var i = 1; i <= 4; i++) {
      var newCore = new UnitCore(50 + i * 100, 300, i);
      this.addUnit(newCore);
    }
  }

  incrementTurn() {
    this.turn += 1;
    $('#turn').text('Turn ' + this.turn);
  }

  serializeBoardState() {
    return {
      'units': this.units.map(function (unit) { return unit.serialize() }),
      'turn': this.turn,
      'tick': this.tick,
      'unit_id_index': this.UNIT_ID_INDEX,
    };
  }

  getUnitID() {
    this.UNIT_ID_INDEX += 1;
    return this.UNIT_ID_INDEX - 1;
  }

  addUnit(unit) {
    unit.addToStage(this.stage);
    this.units.push(unit);
  }

  findUnit(unitID) {
    for (var i = 0; i < this.units.length; i++) {
      if (this.units[i].id == unitID) {
        return this.units[i];
      }
    }
    return null;
  }

  atEndOfTurn() {
    return this.tick >= MainGame.ticksPerTurn * this.turn;
  }

  runTick(playerCommands) {

    for (var unit in this.units) {
      this.units[unit].runTick();
    }

    for (var id in playerCommands) {
      var commands = playerCommands[id];
      for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        command.doActionOnTick(this.tick, this);
      }
    }

    this.tick += 1;
  }
}
