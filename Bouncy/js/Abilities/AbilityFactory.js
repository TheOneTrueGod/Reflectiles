const AbilityFactory = {
  GetAbilityCore: function(abilityCoreID) {
    return AbilityCore.GetAbilityCore(abilityCoreID);
  },
  GetAbility: function(abilityCoreID, perkList) {
    let abilityCore = this.GetAbilityCore(abilityCoreID);
    if (abilityCore) {
      return abilityCore.BuildAbility(perkList);
    }
    return AbilityDef.abilityDefList[abilityCoreID];
  },
  GetPerkTree: function(abilityCoreID) {
    let core = AbilityCore.GetAbilityCore(abilityCoreID);
    let perkList;
    if (core) {
      perkList = core.GetPerkList();
    } else {
      perkList = AbilityCore.GetPerkList();
    }

    let perkMap = {};
    perkList.forEach((perk) => {
      perkMap[perk.key] = perk;
    });

    return perkMap;
  },
  ConvertPerkListToCounts: function(perkList) {
    let perkCounts = {};
    perkList.forEach((perkName) => {
      if (!perkCounts[perkName]) {
        perkCounts[perkName] = 0;
      }
      perkCounts[perkName] += 1;
    });

    return perkCounts;
  },
  CanAddPerk: function(abilityCoreID, perkKey, perkList) {
    let perkCounts = AbilityFactory.ConvertPerkListToCounts(perkList);

    let perkTree = this.GetPerkTree(abilityCoreID);
    let perk = perkTree[perkKey];
    if (!perk) { return false; }
    if (perk.children.length > 0) {
      for (var i = 0; i < perk.children.length; i++) {
        let perkName = perk.children[i];
        let childPerk = perkTree[perkName];
        if (!(perkCounts[perkName] >= childPerk.levels)) {
          return false;
        }
      }
    }
    return !(perkCounts[perkKey] >= perk.levels);
  }
};
