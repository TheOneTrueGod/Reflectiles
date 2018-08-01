class PlayerCommandController {
  constructor(player) {
    this.player = player;
    this.commandData = [];
  }

  addCommand(command) {
    var replaced = false;
    for (var i = 0; i < this.commandData.length; i++) {
      if (this.commandData[i].getCommandPhase() === command.getCommandPhase()) {
        this.commandData[i] = command;
        replaced = true;
      }
    }
    if (!replaced) {
      this.commandData.push(command);
    }
  }

  getCommands() {
    return this.commandData;
  }

  serialize() {
    return this.commandData.map(
      function(playerCommand) {
        return playerCommand.serialize();
      }
    );
  }
}
