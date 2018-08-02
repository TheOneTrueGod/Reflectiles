class PlayerCommandController {
  constructor(player) {
    this.player = player;
    this.minorAction = null;
    this.majorAction = null;
    this.passCommand = null;
  }

  addCommand(command) {
    if (command.isSpecialCommand()) {
      if (command.type === PlayerCommandSpecial.SPECIAL_COMMANDS.END_TURN) {
        this.passCommand = command;
      } else {
        console.log(command);
      }
    } else if (command.getCommandPhase() === TurnPhasesEnum.PLAYER_MINOR) {
      this.minorAction = command;
    } else if (command.getCommandPhase() === TurnPhasesEnum.PLAYER_ACTION) {
      this.majorAction = command;
    } else if (command.getCommandPhase() === null) {
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
