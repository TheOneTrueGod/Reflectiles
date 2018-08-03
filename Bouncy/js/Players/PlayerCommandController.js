class PlayerCommandController {
  constructor(player) {
    this.player = player;
    this.minorAction = null;
    this.majorAction = null;
    this.passCommand = null;
  }

  updateValidTargetChecks() {
    this.minorAction && this.minorAction.updateValidTargetCheck();
    this.majorAction && this.majorAction.updateValidTargetCheck();
    // Do this twice in case the minor action is a pre-action vs a post-action
    this.minorAction && this.minorAction.updateValidTargetCheck();
  }

  addCommand(command) {
    if (command.isSpecialCommand()) {
      if (command.type === PlayerCommandSpecial.SPECIAL_COMMANDS.END_TURN) {
        this.passCommand = command;
      } else {
        console.log(command);
      }
    } else if (command.isMinorAction()) {
      this.minorAction = command;
    } else if (command.isMajorAction()) {
      this.majorAction = command;
    } else {
      console.log(command);
    }
  }

  getCommands() {
    if (this.minorAction && this.majorAction) {
      return [this.minorAction, this.majorAction];
    } else if (this.minorAction) {
      return [this.minorAction];
    } else if (this.majorAction) {
      return [this.majorAction];
    }
    return [];
  }

  getCastPoint(playerPos, currPhase, checkPhase) {
    if (checkPhase === TurnPhasesEnum.PLAYER_PRE_MINOR) {
      return playerPos;
    }
    let castPoint = playerPos;
    if (
      currPhase !== TurnPhasesEnum.PLAYER_ACTION &&
      currPhase !== TurnPhasesEnum.PLAYER_MINOR &&
      this.minorAction &&
      this.minorAction.getCommandPhase() === TurnPhasesEnum.PLAYER_PRE_MINOR
    ) {
      castPoint = this.minorAction.getPlayerCastPointAfterCommand(castPoint);
    }

    if (checkPhase === TurnPhasesEnum.PLAYER_ACTION) {
      return castPoint;
    }

    if (
      // If the current phase is the minor action, then we don't want to adjust based on the major action.
      currPhase !== TurnPhasesEnum.PLAYER_MINOR &&
      this.majorAction
    ) {
      castPoint = this.majorAction.getPlayerCastPointAfterCommand(castPoint);
    }

    return castPoint;
  }

  hasMajor() {
    return this.majorAction !== null;
  }

  hasMinor() {
    return this.minorAction !== null;
  }

  getMajorAction() {
    return this.majorAction;
  }

  isDoneTurn() {
    return this.passCommand !== null;
  }

  serialize() {
    let serializedCommands =
      this.getCommands().map((command) => { return command.serialize(); });

    if (this.passCommand) {
      serializedCommands.push(this.passCommand.serialize());
    }

    return serializedCommands;
  }
}
