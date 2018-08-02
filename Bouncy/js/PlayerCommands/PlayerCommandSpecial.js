class PlayerCommandSpecial extends PlayerCommand {
  constructor(type, specialData) {
    super(0, 0, 0, null);
    this.type = type;
    this.specialData = specialData;
  }

  static FromServerData(deserialized) {
    let pc = new PlayerCommandSpecial(deserialized.type, deserialized.specialData);
    pc.setPlayerID(deserialized.playerID);
    return pc;
  }

  getCommandPhase() { return null; }

  isMajorAction() { return false; }
  isMinorAction() { return false; }
  commandEndsTurn() { return true; }

  equals(other) { return other.type === this.type && other.specialData === this.specialData; }

  hasAimPreview() {
    return false;
  }

  isSpecialCommand() {
    return true;
  }

  addAimIndicator(boardState, stage, players) { }

  serialize() {
    var serialized = {};
    serialized.command = this.constructor.name;
    serialized.type = this.type;
    serialized.specialData = this.specialData;
    serialized.playerID = this.playerID;
    return JSON.stringify(serialized);
  }
}

PlayerCommandSpecial.SPECIAL_COMMANDS = {
  END_TURN: 'end_turn',
};

PlayerCommandSpecial.AddToTypeMap();
