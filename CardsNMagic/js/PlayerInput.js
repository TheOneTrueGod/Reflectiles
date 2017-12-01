class PlayerInput {
  constructor() {
    this.selectedAbility = null;
    this.selectedUnit = null;
  }

  getSelectedAbility() { return this.selectedAbility; }

  setSelectedAbility(abilityID) {
    if (abilityID === undefined) {
      throw new Exception("Can't set an undefined ability");
    }
    this.selectedAbility = abilityID;
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
      MainGame.addPlayerCommand(
        new PlayerCommandUseAbility(
          event.offsetX,
          event.offsetY,
          MainGame.boardState.tick,
          this.selectedAbility
        )
      );

      this.setSelectedAbility(null);
      UIListeners.updateSelectedAbility();
    }

    if (!this.selectedAbility) {
      if (event.button == 0) {
        this.selectUnit(
          this.findClickedUnit(event.offsetX, event.offsetY)
        );
      } else if (event.button == 2) {
        if (this.selectedUnit) {
          MainGame.addPlayerCommand(
            new PlayerCommandMoveUnit(
              event.offsetX, event.offsetY,
              MainGame.boardState.tick,
              this.selectedUnit.id
            )
          );
        }
      }
    }
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
