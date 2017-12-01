class UnitSectors {
  constructor(rows, columns, width, height) {
    this.boardWidth = width;
    this.boardHeight = height;
    this.rows = rows;
    this.columns = columns;
    this.sectorWidth = width / columns;
    this.sectorHeight = height / rows;
    this.reset();
  }

  reset() {
    this.grid = {};
    this.units = {};
  }

  addUnit(unit) {
    var unitPos = unit.getCurrentPosition();
    var unitSize = unit.getSize();
    var unitSector = Victor(
      Physics.truncate(unitPos.x / this.boardWidth * this.columns),
      Physics.truncate(unitPos.y / this.boardHeight * this.rows)
    );

    for (
      var column = unitSector.x - unitSize.left;
      column <= unitSector.x + unitSize.right; column++
    ) {
      for (
        var row = unitSector.y - unitSize.top;
        row <= unitSector.y + unitSize.bottom; row++
      ) {
        this.ensureExists(row, column);
        this.grid[row][column].push(unit.id);
        if (!(unit.id in this.units)) {
          this.units[unit.id] = [];
        }
        this.units[unit.id].push({row: row, column: column});
      }
    }
  }

  removeUnit(unit) {
    if (!(unit.id in this.units)) {
      return;
    }
    for (var i = 0; i < this.units[unit.id].length; i++) {
      var spot = this.units[unit.id][i];
      if (spot.row in this.grid && spot.column in this.grid[spot.row]) {
        var index = this.grid[spot.row][spot.column].indexOf(unit.id);
        if (index != -1) {
          this.grid[spot.row][spot.column].splice(index, 1);
        } else {
          console.log("Something's up");
        }
      }
    }
    delete this.units[unit.id];
  }

  ensureExists(row, column) {
    if (!(row in this.grid)) {
      this.grid[row] = {};
    }

    if (!(column in this.grid[row])) {
      this.grid[row][column] = [];
    }
  }

  getUnitsAtGridSquare(column, row) {
    if (row in this.grid && column in this.grid[row]) {
      return this.grid[row][column];
    }
    return [];
  }

  getUnitsAtPosition(x, y) {
    if (!(x >= 0 && x <= this.boardWidth && y >= 0 && y <= this.boardHeight)) {
      return [];
    }
    var column = Physics.truncate(x / this.boardWidth * this.columns);
    var row = Physics.truncate(y / this.boardHeight * this.rows);
    return this.getUnitsAtGridSquare(column, row);
  }

  getUnitsInSquare(square) {
    var x1 = Physics.truncate(square.x1 / this.boardWidth * this.columns);
    var x2 = Physics.truncate(square.x2 / this.boardWidth * this.columns);

    var y1 = Physics.truncate(square.y1 / this.boardWidth * this.columns);
    var y2 = Physics.truncate(square.y2 / this.boardWidth * this.columns);
    var allUnits = [];
    if (x1 > x2) {
      var temp = x2; x2 = x1; x1 = temp;
    }
    if (y1 > y2) {
      var temp = y2; y2 = y1; y1 = temp;
    }

    for (var x = x1; x <= x2; x++) {
      for (var y = y1; y <= y2; y++) {
        var unitsInSquare = this.getUnitsAtGridSquare(x, y);
        allUnits = allUnits.concat(unitsInSquare);
      }
    }

    return deduplicate(allUnits);
  }

  getGridCoord(position) {
    var squareWidth = this.boardWidth / this.columns;
    var squareHeight = this.boardHeight / this.rows;

    var column = Physics.truncate(position.x / this.boardWidth * this.columns);
    var row = Physics.truncate(position.y / this.boardHeight * this.rows);

    return Victor(column, row);
  }

  getGridPosition(position) {
    var squareWidth = this.boardWidth / this.columns;
    var squareHeight = this.boardHeight / this.rows;

    var column = Physics.truncate(position.x / this.boardWidth * this.columns) + .5;
    var row = Physics.truncate(position.y / this.boardHeight * this.rows) + .5;

    return Victor(column, row);
  }

  getPositionFromGrid(gridPos) {
    return {
      x: (gridPos.x + 0.5) * this.boardWidth / this.columns,
      y: (gridPos.y + 0.5) * this.boardHeight / this.rows
    };
  }

  isCoordInBounds(coord) {
    return
      (0 <= coord.x && coord.x < this.columns) &&
      (0 <= coord.y && coord.y < this.rows);
  }

  snapPositionToGrid(position) {
    var squareWidth = this.boardWidth / this.columns;
    var squareHeight = this.boardHeight / this.rows;

    var column = Physics.truncate(position.x / this.boardWidth * this.columns) + .5;
    var row = Physics.truncate(position.y / this.boardHeight * this.rows) + .5;

    return Victor(column * squareWidth, row * squareHeight);
  }

  canUnitEnter(boardState, unit, position) {
    let size = unit ? unit.getSize() : {top: 0, left: 0, bottom: 0, right: 0};
    for (var dx = -size.left; dx <= size.right; dx ++) {
      for (var dy = -size.top; dy <= size.bottom; dy ++) {
        let target = {x: position.x + dx * Unit.UNIT_SIZE, y: position.y + dy * Unit.UNIT_SIZE};
        if (!(target.x >= 0 && target.x <= this.boardWidth && target.y >= 0 && target.y <= this.boardHeight)) {
          return false;
        }
        var unitsAtPosition = this.getUnitsAtPosition(target.x, target.y);
        if (unitsAtPosition.length > 0) {
          for (var i = 0; i < unitsAtPosition.length; i++) {
            if (unit && unitsAtPosition[i] == unit.id) {
              continue;
            }
            if (boardState.findUnit(unitsAtPosition[i]).preventsUnitEntry(unit)) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }
}
