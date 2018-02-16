class AbilityCoreNUMBER extends AbilityCore {
  static BuildAbility(perkList) {
    const rawAbil = ;
    return AbilityDef.createFromJSON(rawAbil);
  }

  static GetPerkList() {
    let perkList = [
      (new AbilityPerkNode('damage',    20, [0, 0])),
    ];
    return perkList;
  }

  static GetCardDeckType() {
    return CardDeckTypes.WEAPON;
  }
}

AbilityCore.coreList[NUMBER] = AbilityCoreNUMBER;
