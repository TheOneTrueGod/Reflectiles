class Player {
  constructor(playerData, index) {
    this.player_index = index;

    this.user_name = playerData.user_name;
    this.user_id = playerData.user_id;

    if (playerData.ability_deck) {
      this.abilityDeck = new PlayerDeck(playerData.ability_deck);
    }

    this.hand = [];
    this.deck = [];
    this.discard = [];
  }

  endOfTurn() {
    var abilities = this.getAbilities();
    for (var i = 0; i < abilities.length; i++) {
      abilities[i].endOfTurn();
    }
  }

  serializeData() {
    var player_data = {'abilities':[]};
    var abilities = this.getAbilities();
    for (var i = 0; i < abilities.length; i++) {
      player_data['abilities'][i] = abilities[i].serializeData();
    }
    return player_data;
  }

  deserializeData(dataJSON) {
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
  }

  getUserName() {
    return this.user_name;
  }

  getUserID() {
    return this.user_id;
  };

  getIndex() {
    return this.player_index;
  };

  getAbilities() {
    if (!this.abilityDeck) {
      return [];
    }
    return this.abilityDeck.getAbilities();
  }

  getAbility(index) {
    return this.abilityDeck.getAbility(index);
  }

  getAbilityDeckName() {
    return this.abilityDeck ? this.abilityDeck.getName() : "No Selected Deck";
  }

  getAbilityDeckID() {
    return this.abilityDeck ? this.abilityDeck.getID() : undefined;
  }
}
