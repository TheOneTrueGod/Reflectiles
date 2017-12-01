function Player(playerData, index) {
  if (!(this instanceof Player)) {
    return new Player(playerData, index);
  }
  this.player_index = index;

  this.user_name = playerData.user_name;
  this.user_id = playerData.user_id;

  if (playerData.ability_deck) {
    this.abilityDeck = new PlayerDeck(playerData.ability_deck);
  }
}

Player.prototype.endOfTurn = function() {
  var abilities = this.getAbilities();
  for (var i = 0; i < abilities.length; i++) {
    abilities[i].endOfTurn();
  }
}

Player.prototype.serializeData = function() {
  var player_data = {'abilities':[]};
  var abilities = this.getAbilities();
  for (var i = 0; i < abilities.length; i++) {
    player_data['abilities'][i] = abilities[i].serializeData();
  }
  return player_data;
};

Player.prototype.deserializeData = function(dataJSON) {
  if (!dataJSON) { return; }
  var abilities = this.getAbilities();
  if (dataJSON.abilities) {
    for (var i = 0; i < abilities.length; i++) {
      var abilityData = dataJSON.abilities[i];
      if (abilityData) {
        this.getAbility(i).deserializeData(dataJSON.abilities[i]);
      }
    }
  }
};

Player.prototype.getUserName = function() {
  return this.user_name;
};

Player.prototype.getUserID = function() {
  return this.user_id;
};

Player.prototype.getIndex = function() {
  return this.player_index;
};

Player.prototype.getAbilities = function() {
  if (!this.abilityDeck) {
    return [];
  }
  return this.abilityDeck.getAbilities();
}

Player.prototype.getAbility = function(index) {
  return this.abilityDeck.getAbility(index);
}

Player.prototype.getAbilityDeckName = function() {
  return this.abilityDeck ? this.abilityDeck.getName() : "No Selected Deck";
}

Player.prototype.getAbilityDeckID = function() {
  return this.abilityDeck ? this.abilityDeck.getID() : undefined;
}
