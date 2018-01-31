class PlayerCard {
  constructor(index, cardData) {
    this.index = index;
    this.cardID = cardData.card_id;
  }

  static unstringifyAllCards(cardList) {
    let toReturn = [];
    for (let i = 0; i < cardList.length; i++) {
      toReturn.push(new PlayerCard(i, cardList[i]));
    }
    return toReturn;
  }
}
