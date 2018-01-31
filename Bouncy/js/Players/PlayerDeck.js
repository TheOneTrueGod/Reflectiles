class PlayerDeck {
  constructor(deckData) {
    this.name = "Unnamed";
    this.id = undefined;
    // CardList is the way abilities are represented on the backend
    this.cardList = [];
    // Abilities are the client-instantiated ability defs
    this.abilities = [];

    if (deckData) {
      this.name = deckData.name;
      this.id = deckData.id;
      this.cardList = deckData.cardList.map((cardData) => {
        return new PlayerCard(null, cardData);
      });


      for (let i = 0; i < this.cardList.length; i++) {
        this.instantiateCard(this.cardList[i]);
      }
    }
  }

  addCard(playerCard) {
    let clonedCard = playerCard.cloneForDeck();
    this.cardList.push(clonedCard);
    return this.instantiateCard(clonedCard);
  }

  instantiateCard(playerCard) {
    let ability = AbilityManager.getAbility(playerCard);
    this.abilities.push(ability);
    return ability;
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

  static unstringifyAllDecks(deckList) {
    let toReturn = [];
    for (let i = 0; i < deckList.length; i++) {
      toReturn.push(new PlayerDeck(deckList[i]));
    }
    return toReturn;
  }
}
