class AbilityCore {
  static BuildAbility(perkList) {
    throw new Error("You must override BuildAbility in a child of AbilityCore.");
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('damage',    20, [0, 0])),
      /*(new AbilityPerkNode('test 3',     1, [0, 3])),
      (new AbilityPerkNode('test 2',     1, [0, 1])).addChild('test 2-1').addChild('test 2-2'),
      (new AbilityPerkNode('test 2-1',   1, [1, 1])),
      (new AbilityPerkNode('test 2-2',   1, [1, 2])).addChild('test 2-2-1'),
      (new AbilityPerkNode('test 2-2-1', 1, [2, 2])),*/
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.NEUTRAL;
  }

  static GetAbilityCore(coreID) {
    if (AbilityCore.coreList.hasOwnProperty(coreID)) {
      return AbilityCore.coreList[coreID];
    }
    return null;
  }
}

AbilityCore.coreList = {};
