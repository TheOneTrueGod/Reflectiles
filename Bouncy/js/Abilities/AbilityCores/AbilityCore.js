class AbilityCore {
  static BuildPerkDetails(perkList) {
    let perks = this.GetPerkList();
    let perkPcts = {};
    let perkCounts = AbilityFactory.ConvertPerkListToCounts(perkList);

    for (let perk of perks) {
      perkPcts[perk.key] = idx(perkCounts, perk.key, 0) / perk.levels;
    }
    return {perkCounts, perkPcts};
  }

  static hasPerk(perkPcts, perkName) {
    return idx(perkPcts, perkName, 0) === 1;
  }

  static BuildAbility(perkList, level, coreID) {
    let perkResults = this.BuildPerkDetails(perkList);
    let perkPcts = perkResults.perkPcts;
    let perkCounts = perkResults.perkCounts;
    return this.BuildAbilityChild(coreID >= 1000 ? level : perkList, perkPcts, perkCounts);
  }

  static BuildAbilityChild(perkList, perkPcts, perkCounts) {
    throw new Error("You must override BuildAbilityCore in a child of AbilityCore.");
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

  static GetDemoUnits() {
    return  [
      [null, UnitBasicSquare, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitBasicSquare]
    ];
  }

  static GetDemoTurns() {
    return 1;
  }

  static GetDemoTimesToUse() {
    return 1;
  }

  static GetAimOffsets() {
    return {x: 0, y: -30};
  }
}

AbilityCore.coreList = {};
