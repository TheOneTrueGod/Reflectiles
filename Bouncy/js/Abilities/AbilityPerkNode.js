class AbilityPerkNode {
  constructor(key, levels, pos) {
    this.key = key;
    this.levels = levels;
    this.children = [];
    this.position = pos;
  }

  addChild(childPerkNode) {
    this.children.push(childPerkNode);
    return this;
  }

  createNodeHTML(level) {
    let levelText = this.levels;
    if (!!level) {
      levelText = level + "/" + this.levels
    }
    return $('<div>', {class: 'perkNode'})
      .append($("<div>", {text: this.key, class: 'perkName noselect'}))
      .append($("<div>", {text: levelText, class: 'perkLevel noselect'}));
  }
}
