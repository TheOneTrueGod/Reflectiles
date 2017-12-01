class SummonUnitAbilityDef extends AbilityDef {
  constructor(defJSON) {
    super(defJSON);
    this.rawDef = defJSON;

    if (defJSON.unit_abilities) {
      this.loadNestedAbilityDefs(defJSON.unit_abilities);
    }
    this.UNITS_TO_SUMMON = this.getOptionalParam('unit_count', 1);
    this.MAX_RANGE = this.getOptionalParam('max_range', {left: 0, right: 0, top: 0, bottom: 0});
    this.AREA_TYPE = this.getOptionalParam('area_type', SummonUnitAbilityDef.AREA_TYPES.SINGLE);
  }

  getValidTarget(target, playerID) {
    var castPoint = MainGame.boardState.getPlayerCastPoint(playerID);
    if (
      this.MAX_RANGE.left === undefined || this.MAX_RANGE.right === undefined ||
      this.MAX_RANGE.top === undefined || this.MAX_RANGE.bottom === undefined
    ) {
      return this.nudgeTargetAroundOtherUnits({x: target.x, y: target.y}, castPoint);
    }

    // TODO: Pass in boardState.  Too lazy right now.
    var castPointCoord = MainGame.boardState.sectors.getGridCoord(castPoint);
    var targetCoord = MainGame.boardState.sectors.getGridCoord(target);

    var targX = Math.min(
      Math.max(castPointCoord.x - this.MAX_RANGE.left, targetCoord.x),
      castPointCoord.x + this.MAX_RANGE.right
    );
    var targY = Math.min(
      Math.max(castPointCoord.y - this.MAX_RANGE.top, targetCoord.y),
      castPointCoord.y + this.MAX_RANGE.bottom
    );

    //console.log(castPointCoord.x - this.MAX_RANGE.left, targetCoord.x, castPointCoord.x + this.MAX_RANGE.right);
    //console.log(castPointCoord.y - this.MAX_RANGE.top, targetCoord.y, castPointCoord.y + this.MAX_RANGE.bottom);

    var target = {x: targX, y: targY};
    target = this.nudgeTargetAroundOtherUnits(target, castPoint)
    if (!target) { return null; }
    return MainGame.boardState.sectors.getPositionFromGrid(target);
  }

  nudgeTargetAroundOtherUnits(target, castPoint) {
    if (this.AREA_TYPE == SummonUnitAbilityDef.AREA_TYPES.LINE) {
      return target;
    }

    if (MainGame.boardState.sectors.getUnitsAtGridSquare(target.x, target.y).length === 0) {
      return target;
    }

    var gridPos = target;

    var validTargets = this.getAllValidTargets(
      MainGame.boardState,
      castPoint //      MainGame.boardState.sectors.getPositionFromGrid(target)
    );

    validTargets.sort((targetA, targetB) => {
      var distA = Math.abs(gridPos.x - targetA.x) + Math.abs(gridPos.y - targetA.y);
      var distB = Math.abs(gridPos.x - targetB.x) + Math.abs(gridPos.y - targetB.y);

      if (distA < distB) { return -1; }
      if (distA > distB) { return 1; }
      if (targetA.y > targetB.y) { return -1; }
      if (targetA.y < targetB.y) { return 1; }
      if (targetA.x > targetB.x) { return -1; }
      if (targetA.x < targetB.x) { return 1; }
      return 0;
    });

    if (!validTargets) { return null; }

    return validTargets[0];
  }

  getUnitSize() {
    return {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    };
  }

  getAllValidTargets(boardState, castPoint) {
    var gridPos = boardState.sectors.getGridCoord(castPoint);
    var valid_targets = [];
    for (var x = gridPos.x - this.MAX_RANGE.left; x <= gridPos.x + this.MAX_RANGE.right; x++) {
      for (var y = gridPos.y - this.MAX_RANGE.top; y <= gridPos.y + this.MAX_RANGE.bottom; y++) {
        var units = MainGame.boardState.sectors.getUnitsAtGridSquare(x, y);
        var coord = {x, y};
        if (this.canSummonUnitAtGridPos(boardState, coord)) {
          valid_targets.push(coord);
        }
      }
    }

    return valid_targets;
  }

  canSummonUnitAtPosition(boardState, target) {
    return this.canSummonUnitAtGridPos(
      boardState,
      boardState.sectors.getGridCoord(target)
    )
  }

  canSummonUnitAtGridPos(boardState, gridPos) {
    if (gridPos.x < 0 || gridPos.x > boardState.sectors.columns) {
      return false;
    }
    if (gridPos.y < 0 || gridPos.y > boardState.sectors.rows) {
      return false;
    }

    var units = MainGame.boardState.sectors.getUnitsAtGridSquare(gridPos.x, gridPos.y);
    if (units.length) { return false; }
    return true;
  }

  doActionOnTick(playerID, tick, boardState, castPoint, targetPoint) {
    if (tick == 0) {
      if (this.AREA_TYPE == SummonUnitAbilityDef.AREA_TYPES.SINGLE) {
        this.createUnitAtPos(boardState, playerID, castPoint, targetPoint);
      } else if (this.AREA_TYPE == SummonUnitAbilityDef.AREA_TYPES.LINE) {
        for (var i = -Math.floor(this.UNITS_TO_SUMMON / 2); i < Math.ceil(this.UNITS_TO_SUMMON / 2); i++) {
          var castTarget = {x: targetPoint.x + i * Unit.UNIT_SIZE, y: targetPoint.y};
          if (this.canSummonUnitAtPosition(boardState, castTarget)) {
            console.log(castTarget);
            this.createUnitAtPos(
              boardState,
              playerID,
              castPoint,
              castTarget
            );
          }
        }
      } else if (this.AREA_TYPE == SummonUnitAbilityDef.AREA_TYPES.BLAST) {
        var valid_targets = this.getAllValidTargets(boardState, castPoint);

        for (var i = 0; i < this.UNITS_TO_SUMMON && valid_targets.length > 0; i++) {
          var index = Math.floor(boardState.getRandom() * valid_targets.length);
          var target = valid_targets.splice(index, 1)[0];

          this.createUnitAtPos(
            boardState,
            playerID,
            castPoint,
            boardState.sectors.getPositionFromGrid(target)
          );
        }
      }
    }
  }

  createUnitAtPos(boardState, playerID, castPoint, targetPoint) {
    var newUnit;
    switch (this.getOptionalParam('unit', SummonUnitAbilityDef.UNITS.TURRET)) {
      case SummonUnitAbilityDef.UNITS.TURRET:
        newUnit = new Turret(
          targetPoint.x, targetPoint.y,
          0,
          null,
          this.index,
          playerID
        );
        break;
      case SummonUnitAbilityDef.UNITS.LANDMINE:
        newUnit = new Landmine(
          targetPoint.x, targetPoint.y,
          0,
          null,
          this.index,
          playerID
        );
        break;
      case SummonUnitAbilityDef.UNITS.PUSHABLE_EXPLOSIVE:
        newUnit = new PushableExplosive(
          targetPoint.x, targetPoint.y,
          0,
          null,
          this.index,
          playerID
        );
        break;
    }

    boardState.addUnit(newUnit);
    newUnit.playSpawnEffect(boardState, castPoint, 20);
  }

  hasFinishedDoingEffect(tickOn) {
    return tickOn > 0;
  }
  
  addDefaultIcon($icon) {
    var $image = $("<img src='../Bouncy/assets/icons/icon_plain_shield.png'/>");
    $icon.append($image);
  }

  createTargettingGraphic(startPos, endPos, color) {
    var lineGraphic = new PIXI.Graphics();

    var size = this.getUnitSize();
    if (this.AREA_TYPE == SummonUnitAbilityDef.AREA_TYPES.BLAST) {
      let pos = MainGame.boardState.sectors.snapPositionToGrid(startPos);
      lineGraphic.position.set(pos.x, pos.y);
      size = this.MAX_RANGE;
    } else if (this.AREA_TYPE == SummonUnitAbilityDef.AREA_TYPES.LINE) {
      lineGraphic.position.set(endPos.x, endPos.y);
      for (var i = -Math.floor(this.UNITS_TO_SUMMON / 2); i < Math.ceil(this.UNITS_TO_SUMMON / 2); i++) {
        var castTarget = {x: endPos.x + i * Unit.UNIT_SIZE, y: endPos.y};

        if (this.canSummonUnitAtPosition(MainGame.boardState, castTarget)) {
          lineGraphic.lineStyle(1, color).drawRect(
            -Unit.UNIT_SIZE / 3 + i * Unit.UNIT_SIZE, -Unit.UNIT_SIZE / 3,
            Unit.UNIT_SIZE * 2 / 3, Unit.UNIT_SIZE * 2 / 3
          );
        }
      }
      return lineGraphic;

    } else {
      let pos = MainGame.boardState.sectors.snapPositionToGrid(endPos);
      lineGraphic.position.set(pos.x, pos.y);
    }
    var left = ((size.left + 0.5) * Unit.UNIT_SIZE);
    var right = ((size.right + 0.5) * Unit.UNIT_SIZE);
    var top = ((size.top + 0.5) * Unit.UNIT_SIZE);
    var bottom = ((size.bottom + 0.5) * Unit.UNIT_SIZE);

    //lineGraphic.position.set(pos.x, pos.y);

    lineGraphic
      .lineStyle(1, color)
      .drawRect(
        -left, -top,
        left + right, top + bottom
      );

    return lineGraphic;
  }
  
  endOfPhase(boardState, phase, zone) {}
}

SummonUnitAbilityDef.UNITS = {
  TURRET: 'TURRET',
  LANDMINE: 'LANDMINE',
  PUSHABLE_EXPLOSIVE: 'PUSHABLE_EXPLOSIVE',
}

SummonUnitAbilityDef.AREA_TYPES = {
  SINGLE: 'SINGLE',
  LINE: 'LINE',
  BLAST: 'BLAST',
}
