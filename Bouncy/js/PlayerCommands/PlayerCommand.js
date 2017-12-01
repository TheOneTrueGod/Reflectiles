class PlayerCommand {
  constructor(
    x, y,
    abilityID
  ) {
    this.playerID = $('#gameContainer').attr('playerID');
    this.abilityID = abilityID;
    this.x = x;
    this.y = y;
    this.aimIndicator = null;
  }

  getCommandPhase() {
    return TurnPhasesEnum.PLAYER_ACTION;
  }

  commandEndsTurn() {
    return true;
  }

  equals(other) {
    if (
      this.name == other.name &&
      this.x == other.x &&
      this.y == other.y &&
      this.playerID == other.playerID &&
      this.abilityID == other.abilityID
    ) {
      return true;
    }
    return false;
  }

  removeAimIndicator(stage) {
    if (this.aimIndicator && this.aimIndicator.parent) {
       this.aimIndicator.parent.removeChild(this.aimIndicator);
    }
  }

  addAimIndicator(boardState, stage, players) {
    if (this.aimIndicator) {
      this.removeAimIndicator(stage);
    }

    var castPoint = boardState.getPlayerCastPoint(this.playerID);
    var color = 0x666666;
    if ($('#gameContainer').attr('playerID') == this.playerID) {
      color = 0xAAAAAA;
    }

    var player = null;
    for (var key in players) {
      if (players[key].getUserID() == this.playerID) {
        player = players[key];
      }
    }
    var ability = AbilityDef.abilityDefList[this.abilityID];
    this.aimIndicator = ability.createTargettingGraphic(
      castPoint,
      {x: this.x, y: this.y},
      color
    );

    stage.addChild(this.aimIndicator);
    return this.aimIndicator;
  }

  setPlayerID(playerID) {
    this.playerID = playerID;
  }

  getPlayerID() {
    return this.playerID;
  }

  doActionOnTick(tick, boardState) {

  }

  hasFinishedDoingEffect(tickOn) {
    return true;
  }

  serialize() {
    var serialized = this.serializeChildData();
    serialized.command = this.constructor.name;
    serialized.x = this.x;
    serialized.y = this.y;
    serialized.playerID = this.playerID;
    serialized.tickStart = this.tickStart;
    return JSON.stringify(serialized);
  }

  setFromServerData(serverData) {
    this.abilityID = serverData.abilityID;
  }

  serializeChildData() {
    return {'abilityID': this.abilityID};
  }
}

PlayerCommand.FromServerData = function(serializedData) {
  var deserialized = JSON.parse(serializedData);

  CommandClass = PlayerCommand;
  if (deserialized.command) {
    if (!(deserialized.command in PlayerCommand.CommandTypeMap)) {
      alert(deserialized.command + " not in PlayerCommand.CommandTypeMap");
    } else {
      CommandClass = PlayerCommand.CommandTypeMap[deserialized.command];
    }
  }

  var pc = new CommandClass(
    deserialized.x,
    deserialized.y,
    deserialized.abilityID,
    deserialized.playerID
  );
  pc.setPlayerID(deserialized.playerID);
  pc.setFromServerData(deserialized);
  return pc;
}

PlayerCommand.CommandTypeMap = {
};
PlayerCommand.AddToTypeMap = function() {
  PlayerCommand.CommandTypeMap[this.name] = this;
}
