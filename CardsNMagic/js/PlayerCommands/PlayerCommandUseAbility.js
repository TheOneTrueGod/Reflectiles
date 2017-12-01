class PlayerCommandUseAbility extends PlayerCommand {
  doActionOnTick(tick, boardState) {
    if (tick == this.tickStart) {
      var owner = 2;
      if (this.abilityID == "1") {
        owner = 2;
      } else {
        owner = 1;
      }

      boardState.addUnit(new UnitBit(this.x, this.y, owner));
    }
  }
}

PlayerCommandUseAbility.AddToTypeMap();
