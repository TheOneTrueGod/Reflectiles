class PlayerCard {
  constructor(cardData) {
    if (cardData instanceof PlayerCard) {
      // index refers to the card in the player's collection
      this.index = cardData.index
      // cardID refers to the id of the ability def
      this.cardID = cardData.cardID;
      this.cardPerks = cardData.cardPerks;
      this.cardExperience = cardData.cardExperience;
    } else {
      this.index = cardData.card_index
      this.cardID = cardData.card_id;
      this.cardPerks = cardData.card_perks;
      this.cardExperience = cardData.card_experience;
    }
  }

  cloneForDeck() {
    return new PlayerCard(this);
  }

  static unstringifyAllCards(cardList) {
    let toReturn = [];
    for (let i = 0; i < cardList.length; i++) {
      toReturn.push(new PlayerCard(cardList[i]));
    }
    return toReturn;
  }
}
