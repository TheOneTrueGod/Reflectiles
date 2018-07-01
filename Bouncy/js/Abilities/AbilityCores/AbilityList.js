class AbilityList {
  static getAbilityList(deckType) {
    switch (deckType) {
      case CardDeckTypes.WEAPON:
        return [

        ];
      case CardDeckTypes.CHAOS:
      case CardDeckTypes.POISON:
      case CardDeckTypes.ENGINEER:
      case CardDeckTypes.DEFENDER:
      case CardDeckTypes.NEUTRAL:
      default:
        return [];
    }
  }
}
