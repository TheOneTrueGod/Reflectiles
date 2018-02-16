const MIN_DECK_SIZE = 3;
const MAX_DECK_SIZE = 10;

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
      this.cardList = deckData.card_list.map((cardData) => {
        return new PlayerCard(cardData);
      });

      for (let i = 0; i < this.cardList.length; i++) {
        this.instantiateCard(this.cardList[i]);
      }
    }
  }

  serialize() {
    return {
      name: this.name,
      id: this.id,
      card_list: this.cardList.map((card) => { return card.serialize(); }),
    };
  }

  canAddCardToDeck(playerCard) {
    let deckType = CardDeckTypes.NEUTRAL;
    let cardDeckType = playerCard.getCardDeckType();
    for (var i = 0; i < this.cardList.length; i++) {
      let cardDeckType = this.cardList[i].getCardDeckType();
      if (cardDeckType !== CardDeckTypes.NEUTRAL) {
        deckType = cardDeckType;
      }
      if (this.cardList[i].index == playerCard.index) {
        return DeckReason.CARD_IN_DECK;
      }
    }

    if (
      cardDeckType !== CardDeckTypes.NEUTRAL &&
      deckType !== CardDeckTypes.NEUTRAL &&
      cardDeckType !== deckType
    ) {
      return DeckReason.WRONG_TYPE;
    }

    if (this.cardList.length >= MAX_DECK_SIZE) {
      return DeckReason.DECK_FULL;
    }
    return true;
  }

  addCard(playerCard) {
    if (this.canAddCardToDeck(playerCard) !== true) {
      return null;
    }
    let clonedCard = playerCard.cloneForDeck();
    this.cardList.push(clonedCard);
    return this.instantiateCard(clonedCard);
  }

  removeCard(playerCard) {
    let i = 0;
    while (i < this.cardList.length) {
      if (playerCard.index === this.cardList[i].index) {
        this.cardList.splice(i, 1);
        this.abilities.splice(i, 1);
      } else {
        i += 1;
      }
    }
  }

  instantiateCard(playerCard) {
    //let ability = AbilityManager.getAbility(playerCard);
    let ability = AbilityFactory.GetAbility(playerCard);
    this.abilities.push(ability);
    return ability;
  }

  getPlayerCards() {
    return this.cardList;
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

DeckReason = {
  CARD_IN_DECK: 'card_in_deck',
  DECK_FILL: 'deck_full',
  WRONG_TYPE: 'wrong_type'
};
