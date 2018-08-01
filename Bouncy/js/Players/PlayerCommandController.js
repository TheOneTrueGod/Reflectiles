class PlayerCommandController {
  constructor(player, commandData) {
    this.player = player;
    this.commandData = commandData;
  }

  getCommands() {
    return this.commandData;
  }

  serialize() {
    return {

    };
  }
}
