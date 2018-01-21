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

  addAimIndicator(boardState, stage, players) {
    if (this.aimIndicator) {
      this.removeAimIndicator(stage);
    }

    var castPoint = boardState.getPlayerCastPoint(this.playerID);
    var color = 0x666666;
    if ($('#gameContainer').attr('playerID') == this.playerID) {
      color = 0xAAAAAA;
    }

    var player = null;
    for (var key in players) {
      if (players[key].getUserID() == this.playerID) {
        player = players[key];
      }
    }
    this.aimIndicator = this.createTargettingGraphic(
      castPoint,
      {x: this.x, y: this.y},
      color
    );

    stage.addChild(this.aimIndicator);
    return this.aimIndicator;
  }

  createTargettingGraphic(startPos, endPos, color) {
    var lineGraphic = new PIXI.Graphics();
    let circleSize = 5;
    const innerCircleSize = 3;
    var angle = Math.atan2(endPos.y - startPos.y, endPos.x - startPos.x);
    var dist = ((endPos.x - startPos.x) ** 2 + (endPos.y - startPos.y) ** 2) ** 0.5;

    let circleCenter = {
      x: startPos.x + Math.cos(angle) * dist,
      y: startPos.y + Math.sin(angle) * dist
    };
    dist -= circleSize * 2;
    let xOffset = Math.cos(angle + Math.PI / 2) * circleSize;
    let yOffset = Math.sin(angle + Math.PI / 2) * circleSize;
    // Left Line
    lineGraphic.lineStyle(1, color)
      .moveTo(startPos.x + xOffset, startPos.y + yOffset)
      /* Two Lines */
      .lineTo(
        startPos.x + Math.cos(angle) * dist + xOffset,
        startPos.y + Math.sin(angle) * dist + yOffset
      )
      .moveTo(
        startPos.x + Math.cos(angle) * dist - xOffset,
        startPos.y + Math.sin(angle) * dist - yOffset
      )
      .lineTo(startPos.x - xOffset, startPos.y - yOffset)
      /* Triangle */
      .moveTo(
        startPos.x + Math.cos(angle) * dist + xOffset,
        startPos.y + Math.sin(angle) * dist + yOffset
      )
      .lineTo(circleCenter.x, circleCenter.y)
      .lineTo(
        startPos.x + Math.cos(angle) * dist - xOffset,
        startPos.y + Math.sin(angle) * dist - yOffset
      );

    return lineGraphic;
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
