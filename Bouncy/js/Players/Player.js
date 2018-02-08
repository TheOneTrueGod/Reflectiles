const HAND_SIZE = 5;
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

    if (!playerData.hand && !playerData.deck && !playerData.discard) {
      let length = this.getAllAbilities().length;
      for (var i = 0; i < length; i++) {
        this.deck.push(i);
      }
    }
  }

  drawInitialHand(boardState) {
    for (var i = 0; i < HAND_SIZE; i++) {
      this.drawCard(boardState);
    }
  }

  drawCard(boardState) {
    if (this.deck.length == 0) {
      return;
    }

    let selectIndex = Math.floor(boardState.getRandom() * this.deck.length);
    this.hand.push(this.deck.splice(selectIndex, 1)[0]);
  }

  discardCard(abilityIndex) {
    let allAbilities = this.getAllAbilities();
    for (var i = 0; i < this.hand.length; i++) {
      if (allAbilities[this.hand[i]].index === parseInt(abilityIndex)) {
        this.discard.push(this.hand.splice(i, 1)[0]);
        return true;
      }
    }
    return false;
  }

  getHand() {
    return this.hand.map((index) => { return this.getAbility(index); });
  }

  endOfTurn() {
    var abilities = this.getAllAbilities();
    for (var i = 0; i < abilities.length; i++) {
      abilities[i].endOfTurn();
    }
    i = 0;
    while (i < this.discard.length) {
      if (abilities[this.discard[i]].canBeUsed()) {
        this.deck.push(this.discard.splice(i, 1)[0]);
      } else {
        i += 1;
      }
    }
  }

  serializeData() {
    var player_data = {
      abilities:[],
      hand: this.hand,
      deck: this.deck,
      discard: this.discard
    };
    var abilities = this.getAllAbilities();
    for (var i = 0; i < abilities.length; i++) {
      player_data['abilities'][i] = abilities[i].serializeData();
    }

    return player_data;
  }

  deserializeData(dataJSON) {
    if (!dataJSON) { return; }
    var abilities = this.getAllAbilities();
    if (dataJSON.abilities) {
      for (var i = 0; i < abilities.length; i++) {
        var abilityData = dataJSON.abilities[i];
        if (abilityData) {
          this.getAbility(i).deserializeData(dataJSON.abilities[i]);
        }
      }
    }
    if (dataJSON.hand) {
      this.hand = dataJSON.hand;
    }
    if (dataJSON.deck) {
      this.deck = dataJSON.deck;
    }
    if (dataJSON.discard) {
      this.discard = dataJSON.discard;
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

  getAllAbilities() {
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
