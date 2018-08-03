class PlayerCommandUseAbility extends PlayerCommand {
  constructor(
    x, y,
    abilityID,
    playerID
  ) {
    super(x, y, abilityID);

    this.playerID = playerID;
    this.originalX = x;
    this.originalY = y;
    this.abilityDef = AbilityDef.abilityDefList[abilityID];
    //this.updateValidTargetCheck();
  }

  updateValidTargetCheck() {
    var target = this.abilityDef.getValidTarget({x: this.originalX, y: this.originalY}, this.playerID);
    if (!target) {
      throw new Error("No valid targets!");
    }
    this.x = target.x;
    this.y = target.y;
  }

  getCommandPhase() {
    return this.abilityDef.getActionPhase();
  }

  commandEndsTurn() {
    return true;
  }

  doActionOnTick(tick, boardState) {
    var castPoint = boardState.getPlayerCastPoint(this.playerID, this.getCommandPhase());
    this.abilityDef.doActionOnTick(
      this.playerID,
      tick, boardState, castPoint, {x: this.x, y: this.y}
    );
    this.abilityDef.charge = 0;
  }

  hasFinishedDoingEffect(tickOn) {
    return this.abilityDef.hasFinishedDoingEffect(tickOn);
  }
}

PlayerCommandUseAbility.AddToTypeMap();
