class PlayerCard {
  constructor(index, cardData) {
    this.index = index; // Index can be null if it's not in their collection
    if (cardData instanceof PlayerCard) {
      this.cardID = cardData.cardID;
      this.cardPerks = cardData.cardPerks;
      this.cardExperience = cardData.cardExperience;
    } else {
      this.cardID = cardData.card_id;
      this.cardPerks = cardData.card_perks;
      this.cardExperience = cardData.card_experience;
    }
  }

  cloneForDeck() {
    return new PlayerCard(null, this);
  }

  static unstringifyAllCards(cardList) {
    let toReturn = [];
    for (let i = 0; i < cardList.length; i++) {
      toReturn.push(new PlayerCard(i, cardList[i]));
    }
    return toReturn;
  }
}
