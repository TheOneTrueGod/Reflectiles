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

// Perk only does something when maxxed out.
class MaxxedAbilityPerkNode extends AbilityPerkNode {
  createNodeHTML(level) {
    let html = super.createNodeHTML(level);
    html.addClass("maxOnlyPerk");
    return html;
  }
}

class AbilityPerkRequirement {
  constructor(perkName) {
    this.perkName = perkName;
  }

  getPerkKeys() {
    return [this.perkName];
  }

  hasPerkAsRequirement(perkKey) {
    return false;
  }

  isRequirementMet(perkCounts, perkTree) {
    return true;
  }

  getSVGLines($otherPerk, $thisPerk, colorOverride) {
    return [];
  }
}

class PerkLevelRequirement extends AbilityPerkRequirement {
  constructor(perkName, level) {
    super(perkName);
    this.level = level === undefined ? 'max' : level;
  }

  hasPerkAsRequirement(perkKey) {
    return this.perkName == perkKey;
  }

  getSVGLines($otherPerk, $thisPerk, colorOverride) {
    let color = colorOverride ? colorOverride : 'black';
    return [$(
      "<line>",
      {
        x1: CardManager.getPerkLeft($otherPerk.position) + CMC.NODE_WIDTH / 2,
        y1: CardManager.getPerkTop($otherPerk.position) + CMC.NODE_HEIGHT / 2,
        x2: CardManager.getPerkLeft($thisPerk.position) + CMC.NODE_WIDTH / 2,
        y2: CardManager.getPerkTop($thisPerk.position) + CMC.NODE_HEIGHT / 2,
        stroke: color, 'stroke-width': 2
      }
    )];
  }

  isRequirementMet(perkCounts, perkTree) {
    let childPerk = perkTree[this.perkName];
    if (childPerk === undefined) {
      console.warn("ERROR: Trying to get perk [" + this.perkName + "] from perkTree:", perkTree);
      return false;
    }
    return perkCounts[this.perkName] >= (this.level === 'max' ? childPerk.levels : this.level);
  }
}

class OrPerkLevelRequirement extends AbilityPerkRequirement {
  constructor(reqList) {
    super(null);
    this.reqList = reqList;
  }

  getPerkKeys() {
    let keys = [];
    for (let requirement of this.reqList) {
      keys = keys.concat(requirement.getPerkKeys());
    }
    return keys;
  }

  hasPerkAsRequirement(perkKey) {
    for (let requirement of this.reqList) {
      if (requirement.perkName === perkKey) { return true; }
    }
    return false;
  }

  isRequirementMet(perkCounts, perkTree) {
    for (let requirement of this.reqList) {
      if (requirement.isRequirementMet(perkCounts, perkTree)) { return true; }
    }
    return false;
  }

  getSVGLines($otherPerk, $thisPerk, colorOverride) {
    let lines = [];
    for (let requirement of this.reqList) {
      lines = lines.concat(requirement.getSVGLines($otherPerk, $thisPerk, "blue"));
    }
    return lines;
  }
}

class NotPerkLevelRequirement extends AbilityPerkRequirement {
  constructor(requirement) {
    super(null);
    this.requirement = requirement;
  }

  getPerkKeys() {
    return this.requirement.getPerkKeys();
  }

  hasPerkAsRequirement(perkKey) {
    return this.requirement.hasPerkAsRequirement(perkKey);
  }

  isRequirementMet(perkCounts, perkTree) {
    return !this.requirement.isRequirementMet(perkCounts, perkTree);
  }

  getSVGLines($otherPerk, $thisPerk, colorOverride) {
    return [];
  }
}
