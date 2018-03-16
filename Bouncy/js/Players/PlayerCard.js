class PlayerCard {
  constructor(cardData) {
    if (cardData instanceof PlayerCard) {
      // index refers to the card in the player's collection
      this.card_index = cardData.card_index;
      // cardID refers to the id of the ability def
      this.cardID = cardData.cardID;
      this.cardPerks = cardData.cardPerks;
      this.cardExperience = cardData.cardExperience;
    } else {
      if (cardData.card_id === null) {
        throw new Error("invalid card data");
      }
      this.card_index = cardData.card_index;
      this.cardID = cardData.card_id;
      this.cardPerks = cardData.card_perks;
      this.cardExperience = cardData.card_experience;
    }
  }

  getCardDeckType() {
    let abilityCore = AbilityFactory.GetAbilityCore(this.cardID);
    if (!abilityCore) {
      return CardDeckTypes.NEUTRAL;
    }
    return abilityCore.GetCardDeckType();
  }

  addPerks(perks) {
    this.cardPerks = this.cardPerks.concat(perks);
  }

  serialize() {
    return {
      card_index: this.card_index,
      card_id: this.cardID,
      card_perks: this.cardPerks,
      card_experience: this.cardExperience,
    };
  }

  cloneForDeck() {
    return new PlayerCard(this);
  }

  getPerkPoints() {
    return this.getCardLevel() - this.cardPerks.length - 1;
  }

  getLeftoverExperience() {
    return this.cardExperience - this.getExperienceForLevel(this.getCardLevel());
  }

  getCardLevel() {
    // L = (-b + (b * b - 4ac) ^ (1/2)) / 2a
    let a = 100; let b = 1000; let c = 0 - this.cardExperience;

    return Math.floor(
      (-b + (Math.pow(b * b - 4 * a * c, 1 / 2)))
      /
      (2 * a)
    ) + 1;
  }

  getExperienceForLevel(level) {
    // E = a * L ^ 2 + b * L + c
    // a = 200, b = 1000, c = -200
    if (level <= 1) {
      return 0;
    }
    let a = 100; let b = 1000; let c = 0;
    return Math.ceil(a * Math.pow(level - 1, 2) + b * (level - 1) + c);
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

const CardDeckTypes = {
  WEAPON: 'weapon',
  CHAOS: 'chaos',
  POISON: 'poison',
  ENGINEER: 'engineer',
  DEFENDER: 'defender',
  NEUTRAL: 'neutral',
};
