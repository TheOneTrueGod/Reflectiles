const AbilityFactory = {
  GetAbilityCore: function(abilityCoreID) {
    return AbilityCore.GetAbilityCore(abilityCoreID);
  },
  GetAbility: function(abilityCoreID, perkList, level) {
    if (abilityCoreID instanceof PlayerCard) {
      return AbilityFactory.GetAbility(abilityCoreID.cardID, abilityCoreID.cardPerks, abilityCoreID.getCardLevel());
    }
    let abilityCore = this.GetAbilityCore(abilityCoreID);
    if (abilityCore) {
      return abilityCore.BuildAbility(perkList, level ? level : 0, abilityCoreID);
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
    for (let requirement of perk.requirements) {
      if (!requirement.isRequirementMet(perkCounts, perkTree)) {
        return false;
      }
    }
    return (idx(perkCounts, perkKey, 0) < perk.levels);
  }
};
