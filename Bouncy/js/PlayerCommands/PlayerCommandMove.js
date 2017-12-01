class PlayerCommandMove extends PlayerCommand {
  constructor(x, y) {
    super(x, y, 0, null);
  }

  getCommandPhase() {
    return TurnPhasesEnum.PLAYER_MOVE;
  }

  static findValidMove(boardState, playerID, x, y) {
    var playerUnit = boardState.getPlayerUnit(playerID);
    var unitCoord = boardState.sectors.getGridCoord(playerUnit);
    var targetCoord = boardState.sectors.getGridCoord({x, y});

    var targets = [
      {x: 0, y: 1}, {x: 0, y: -1}, {x: 1, y: 0}, {x: -1, y: 0},
      {x: 1, y: 1}, {x: 1, y: -1}, {x: 1, y: 1}, {x: -1, y: 1},
      {x: -1, y: 1}, {x: -1, y: -1}, {x: 1, y: -1}, {x: -1, y: -1},
      {x: 0, y: 2}, {x: 0, y: -2}, {x: 2, y: 0}, {x: -2, y: 0},
    ]
      .sort((offsetA, offsetB) => {
        var distA = Math.abs(unitCoord.x + offsetA.x - targetCoord.x) ** 2 +
          Math.abs(unitCoord.y + offsetA.y - targetCoord.y) ** 2;
        var distB = Math.abs(unitCoord.x + offsetB.x - targetCoord.x) ** 2 +
          Math.abs(unitCoord.y + offsetB.y - targetCoord.y) ** 2;

        if (distA > distB) { return 1; }
        if (distA < distB) { return -1; }
        return 0;
      });

    for (var i = 0; i < targets.length; i++) {
      var targetCoord = {x: unitCoord.x + targets[i].x, y: unitCoord.y + targets[i].y};
      var pos = boardState.sectors.getPositionFromGrid(targetCoord);
      if (
        PlayerCommandMove.isValidMove(boardState, playerUnit, unitCoord, targetCoord) &&
        boardState.sectors.canUnitEnter(boardState, playerUnit, pos) &&
        targetCoord.x >= 0 && targetCoord.x < boardState.sectors.columns &&
        targetCoord.y >= boardState.sectors.rows - PlayerCommandMove.MOVEMENT_HEIGHT &&
        targetCoord.y < boardState.sectors.rows
      ) {
        return pos;
      }
    }

    return null;
  }

  static isValidMove(boardState, unit, unitCoord, targetCoord) {
    var pos = boardState.sectors.getPositionFromGrid(targetCoord);
    if (
      boardState.sectors.canUnitEnter(boardState, unit, pos) &&
      targetCoord.x >= 0 && targetCoord.x < boardState.sectors.columns &&
      targetCoord.y >= boardState.sectors.rows - PlayerCommandMove.MOVEMENT_HEIGHT &&
      targetCoord.y < boardState.sectors.rows &&
      (
        Math.abs(unitCoord.y - targetCoord.y) + Math.abs(unitCoord.x - targetCoord.x) == 1 ||
        Math.abs(unitCoord.y - targetCoord.y) + Math.abs(unitCoord.x - targetCoord.x) == 2
      ) &&
      boardState.sectors.getUnitsAtGridSquare(targetCoord.x, targetCoord.y).length == 0
    ) {
      var playerUnits = boardState.getPlayerUnitsAtPosition(pos);
      
      return playerUnits.length == 0;
    }
    
    return false;
  }

  doActionOnTick(tick, boardState) {
    if (tick == 0) {
      var playerUnit = boardState.getPlayerUnit(this.playerID);
      if (PlayerCommandMove.isValidMove(
        boardState, playerUnit,
        boardState.sectors.getGridCoord(playerUnit),
        boardState.sectors.getGridCoord(this)
      )) {
        playerUnit.setMoveTarget(this.x, this.y);
      }
    }
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > 0;
  }

  commandEndsTurn() {
    return false;
  }
}

PlayerCommandMove.AddToTypeMap();

PlayerCommandMove.MOVEMENT_HEIGHT = 5;
