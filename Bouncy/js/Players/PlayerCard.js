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
      if (cardData.card_id === null) {
        throw new Error("invalid card data");
      }
      this.index = cardData.card_index
      this.cardID = cardData.card_id;
      this.cardPerks = cardData.card_perks;
      this.cardExperience = cardData.card_experience;
    }
  }

  addPerks(perks) {
    this.cardPerks = this.cardPerks.concat(perks);
  }

  serialize() {
    return {
      index: this.index,
      card_id: this.cardID,
      card_perks: this.cardPerks,
      card_experience: this.cardExperience,
    };
  }

  cloneForDeck() {
    return new PlayerCard(this);
  }

  getPerkPoints() {
    return this.getCardLevel() - this.cardPerks.length;
  }

  getCardLevel() {
    return Math.floor(this.cardExperience / 5000);
  }

  getLeftoverExperience() {
    return this.cardExperience - this.getExperienceForLevel(this.getCardLevel());
  }

  getExperienceForLevel(level) {
    return 5000 * level;
  }

  getExperiencePercent() {
    let experienceForCurrentLevel =
      this.getExperienceForLevel(this.getCardLevel() + 1) -
      this.getExperienceForLevel(this.getCardLevel());
    let leftoverExperience = this.getLeftoverExperience();
    return leftoverExperience / experienceForCurrentLevel;
  }

  static unstringifyAllCards(cardList) {
    let toReturn = [];
    for (let i = 0; i < cardList.length; i++) {
      toReturn.push(new PlayerCard(cardList[i]));
    }
    return toReturn;
  }
}
