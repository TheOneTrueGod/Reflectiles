class PlayerDeck {
  constructor(deckData) {
    this.name = "Unnamed";
    this.id = undefined;
    if (deckData) {
      this.name = deckData.name;
      this.id = deckData.id;

      switch (this.id) {
        case 0:
          this.abilities = TJDeck();
          break;
        case 1:
          this.abilities = ChipDeck();
          break;
        case 2:
          this.abilities = TabithaDeck();
          break;
        case 3:
          this.abilities = SeanDeck();
          break;
        case 4:
          this.abilities = ClarenceDeck();
          break;
        default:
          var serializedDeck = JSON.parse(deckData.deckJSON);
          this.abilities = [];
          for (var i = 0; i < serializedDeck.length; i++) {
            this.abilities.push(AbilityDef.createFromJSON(serializedDeck[i]));
          }
          break;
      }
    }
  }

  getAbilities() {
    return this.abilities;
  }

  getAbility(index) {
    if (0 <= index && index < this.abilities.length) {
      return this.abilities[index];
    }
    throw new Error("[" + index + "] doesn't exist in this abilities");
  }

  getName() {
    return this.name;
  }

  getID() {
    return this.id;
  }
}
