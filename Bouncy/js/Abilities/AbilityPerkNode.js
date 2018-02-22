class AbilityPerkNode {
  constructor(key, levels, pos) {
    this.key = key;
    this.levels = levels;
    this.children = [];
    this.requirements = [];
    this.position = pos;
  }

  addRequirement(requirement) {
    this.requirements.push(requirement);
    return this;
  }

  addChild(childPerkNode) {
    this.children.push(childPerkNode);
    return this;
  }

  createNodeHTML(level) {
    let levelText = this.levels;
    if (!!level) {
      levelText = level + "/" + this.levels;
    }
    return $('<div>', {class: 'perkNode'})
      .append($("<div>", {text: levelText, class: 'perkLevel noselect'}))
      .append($("<div>", {text: this.key,  class: 'perkName noselect'}));
  }
}

class AbilityPerkRequirement {
  constructor(perkName) {
    this.perkName = perkName;
  }

  getPerkKey() {
    return this.perkName;
  }

  hasPerkAsRequirement(perkKey) {
    return false;
  }

  isRequirementMet(perkCounts, perkTree) {
    return true;
  }

  getSVGLines($otherPerk, $thisPerk) {
    return [];
  }
}

class PerkLevelRequirement extends AbilityPerkRequirement {
  constructor(perkName, level) {
    super(perkName);
    this.level = level;
  }

  hasPerkAsRequirement(perkKey) {
    return this.perkName == perkKey;
  }

  getSVGLines($otherPerk, $thisPerk) {
    return [$(
      "<line>",
      {
        x1: CardManager.getPerkLeft($otherPerk.position) + CMC.NODE_WIDTH / 2,
        y1: CardManager.getPerkTop($otherPerk.position) + CMC.NODE_HEIGHT / 2,
        x2: CardManager.getPerkLeft($thisPerk.position) + CMC.NODE_WIDTH / 2,
        y2: CardManager.getPerkTop($thisPerk.position) + CMC.NODE_HEIGHT / 2,
        stroke: "black", 'stroke-width': 2
      }
    )];
  }

  isRequirementMet(perkCounts, perkTree) {
    let childPerk = perkTree[this.perkName];
    return perkCounts[this.perkName] >= childPerk.levels;
  }
}
