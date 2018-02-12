class CardManager {
  constructor() {
    this.abilityDef = null;
    this.playerCard = null;
    this.previewPerkList = [];
  }

  setupForCard(playerCard) {
    this.playerCard = playerCard;
    this.abilityDef = AbilityFactory.GetAbility(
      playerCard.cardID, playerCard.cardPerks
    );

    $(".cardControlSection .cardName").text(this.abilityDef.getName());
    $(".cardControlSection .cardDescription").html(this.abilityDef.getDescription());
    $(".cardControlSection .cardTree").on("click", ".perkNode", (event) => {
      this.cardClicked(event);
    });

    this.buildPerkTree();
  }

  cardClicked(event) {
    let target = $(event.target);
    if (!target.hasClass("perkNode")) {
      target = target.closest(".perkNode");
    }
    let perkKey = target.attr("perkkey");

    let perkList = this.playerCard.cardPerks.slice(0);

    if (AbilityFactory.CanAddPerk(
      this.playerCard.cardID, perkKey, perkList.concat(this.previewPerkList)
    )) {
      this.previewPerkList.push(perkKey);
      $(".perkNode[perkkey='" + perkKey + "']").addClass("preview");
    }
  }

  buildPerkTree() {
    const CONTAINER_PADDING = 25;
    const NODE_WIDTH = 80;
    const NODE_HEIGHT = 80;
    const HORIZONTAL_SPACE = 40;
    const VERTICAL_SPACE = 40;
    let perkTree = AbilityFactory.GetPerkTree(
      this.playerCard.cardID
    );
    let $cardTree = $('.cardControlSection .cardTree').empty();
    let htmlElements = {};

    let getTop = function(position) {
      return (position[1] * (NODE_WIDTH + HORIZONTAL_SPACE)) + CONTAINER_PADDING;
    }
    let getLeft = function(position) {
      return (position[0] * (NODE_HEIGHT + VERTICAL_SPACE)) + CONTAINER_PADDING;
    }
    for (let key in perkTree) {
      let perk = perkTree[key];
      let nodeHTML = perk.createNodeHTML();
      nodeHTML.css('top', getTop(perk.position));
      nodeHTML.css('left', getLeft(perk.position));
      nodeHTML.css('width', NODE_WIDTH);
      nodeHTML.css('height', NODE_HEIGHT);
      nodeHTML.attr("perkkey", perk.key);
      $cardTree.append(nodeHTML);

      htmlElements[key] = nodeHTML;
    }

    let lineSVG = $("<svg width='500' height='500'>");
    $cardTree.append(lineSVG);
    for (let key in perkTree) {
      for (let childKey of perkTree[key].children) {
        let parent = perkTree[key];
        let child = perkTree[childKey];
        let parentHTML = htmlElements[key];
        let childHTML = htmlElements[childKey];
        lineSVG.append($(
          "<line>",
          {
            x1: getLeft(parent.position) + NODE_WIDTH / 2,
            y1: getTop(parent.position) + NODE_HEIGHT / 2,
            x2: getLeft(child.position) + NODE_WIDTH / 2,
            y2: getTop(child.position) + NODE_HEIGHT / 2,
            stroke: "black", 'stroke-width': 2
          }
        ));
      }
    }

    // This makes the browser recognize that the SVGs created above are SVGs.
    $cardTree.html($cardTree.html());
  }
}
