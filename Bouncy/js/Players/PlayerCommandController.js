class PlayerCommandController {
  constructor(player) {
    this.player = player;
    this.minorAction = null;
    this.majorAction = null;
  }

  addCommand(command) {
    if (command.getCommandPhase() === null) {
      console.log(command);
    } else if (command.getCommandPhase() === TurnPhasesEnum.PLAYER_MINOR) {
      this.minorAction = command;
    } else if (command.getCommandPhase() === TurnPhasesEnum.PLAYER_ACTION) {
      this.majorAction = command;
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

  serialize() {
    return this.getCommands().map((command) => { return command.serialize(); });
  }
}
