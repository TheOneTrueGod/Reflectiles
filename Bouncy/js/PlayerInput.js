class PlayerInput {
  constructor() {
    this.selectedAbility = null;
    this.selectedUnit = null;
    this.unitDetailsContainer = $('.unitDetailsContainer');
  }

  getSelectedAbility() { return this.selectedAbility; }

  setSelectedAbility(abilityID) {
    if (abilityID === undefined) {
      throw new Error("Can't set an undefined ability");
    }
    if (abilityID === null || AbilityDef.abilityDefList[abilityID].canBeUsed()) {
      this.selectedAbility = abilityID;
    }
  }

  selectUnit(unit) {
    if (unit && !unit.canSelect()) { return; }
    if (this.selectedUnit) {
      this.selectedUnit.setSelected(false);
    }
    this.selectedUnit = unit;
    if (this.selectedUnit) {
      this.selectedUnit.setSelected(true);
    }
  }

  handleClick(target, event) {
    if (
      this.selectedAbility &&
      event.button == 0
    ) {
      MainGame.setAimPreview(null, null, null);
      MainGame.setPlayerCommand(
        new PlayerCommandUseAbility(
          event.offsetX,
          event.offsetY,
          this.selectedAbility,
          $('#gameContainer').attr('playerID')
        )
      );

      this.setSelectedAbility(null);
      UIListeners.updateSelectedAbility();
    }

    if (event.button == 2) {
      var validMove = PlayerCommandMove.findValidMove(
        MainGame.boardState,
        $('#gameContainer').attr('playerID'),
        event.offsetX,
        event.offsetY
      );
      if (validMove) {
        MainGame.setPlayerCommand(
          new PlayerCommandMove(validMove.x, validMove.y)
        );
      }
      return false;
    }
  }

  handleMouseMotion(event) {
    if (this.selectedAbility) {
      MainGame.setAimPreview(
        event.offsetX, event.offsetY,
        this.selectedAbility
      );
    }

    this.handleUnitTooltip(event);
  }

  handleUnitTooltip(event) {
    let boardState = MainGame.boardState;
    let gridCoord = boardState.sectors.getGridCoord({x: event.offsetX, y: event.offsetY});
    if (
      this.tooltipCoord &&
      gridCoord.x == this.tooltipCoord.x &&
      gridCoord.y == this.tooltipCoord.y
    ) {
      return;
    }

    this.tooltipCoord = gridCoord;

    var unitsAtPosition = boardState.sectors.getUnitsAtPosition(
      event.offsetX,
      event.offsetY
    );

    for (var i = 0; i < unitsAtPosition.length; i++) {
      let unit = boardState.findUnit(unitsAtPosition[i]);
      if (unit instanceof UnitBasic) {
        this.unitDetailsContainer.attr('data-unit-id', unit.id);
        this.unitDetailsContainer.empty();
        this.buildTooltipForUnit(unit);
        return;
      } else if (unit instanceof ZoneEffect) {
        this.buildTooltipForUnit(unit);
        return;
      }
    }

    // No units in this square.  Empty the tooltip container.
    this.unitDetailsContainer.attr('data-unit-id', null);
    this.unitDetailsContainer.empty();
  }

  buildTooltipForUnit(unit) {
    this.unitDetailsContainer.empty();
    let unitTooltip = unit.createTooltip();
    this.unitDetailsContainer.append(unitTooltip);
  }

  findClickedUnit(clickX, clickY) {
    var selected = null;
    for (var i = 0; i < MainGame.boardState.units.length; i++) {
      var unit = MainGame.boardState.units[i];
      var distSquared = (unit.x - clickX) ** 2 + (unit.y - clickY) ** 2;
      if (unit.canSelect() && distSquared < unit.getSelectionRadius() ** 2) {
        selected = unit;
      }
    }
    return selected;
  }
}

PlayerInput = new PlayerInput();
