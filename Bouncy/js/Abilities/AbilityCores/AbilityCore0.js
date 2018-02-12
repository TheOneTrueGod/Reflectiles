class AbilityCore0 extends AbilityCore {
  static BuildAbility(perkList) {
    return AbilityDef.abilityDefList[0];
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('damage',    20, [0, 0])),
      (new AbilityPerkNode('radius',     1, [0, 3])),
      (new AbilityPerkNode('impact',     1, [0, 1])),
      (new AbilityPerkNode('test 2-1',   1, [1, 1])).addChild('impact'),
      (new AbilityPerkNode('test 2-2',   1, [1, 2])).addChild('impact'),
      (new AbilityPerkNode('test 2-2-1', 1, [2, 2])).addChild('test 2-2'),
    ];
    return perkList;
  }
}

AbilityCore.coreList[0] = AbilityCore0;
