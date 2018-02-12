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

  createNodeHTML() {
    return $('<div>', {text: this.key, class: 'perkNode'});
  }
}
