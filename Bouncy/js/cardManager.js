const CMC = {
  CONTAINER_PADDING : 25,
  NODE_WIDTH : 80,
  NODE_HEIGHT : 80,
  HORIZONTAL_SPACE : 40,
  VERTICAL_SPACE : 40,
};

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

    if (AbilityFactory.CanAddPerk(
      this.playerCard.cardID,
      perkKey,
      this.playerCard.cardPerks.slice(0).concat(this.previewPerkList)
    )) {
      this.previewPerkList.push(perkKey);

      let perkTree = AbilityFactory.GetPerkTree(
        this.playerCard.cardID
      );
      let perkHTML = this.buildPerkCard(perkTree[perkKey]);

      $(perkHTML).addClass("preview");
    }
  }

  buildPerkCard(perk) {
    let $cardTree = $('.cardControlSection .cardTree');

    let perkList = this.playerCard.cardPerks.slice(0).concat(this.previewPerkList);
    let perkCount = 0;
    perkList.forEach((perkName) => {
      if (perkName === perk.key) {
        perkCount += 1;
      }
    });

    let nodeHTML = perk.createNodeHTML(perkCount);
    nodeHTML.css('top', this.getPerkTop(perk.position));
    nodeHTML.css('left', this.getPerkLeft(perk.position));
    nodeHTML.css('width', CMC.NODE_WIDTH);
    nodeHTML.css('height', CMC.NODE_HEIGHT);
    nodeHTML.attr("perkkey", perk.key);

    $cardTree.append(nodeHTML);

    return nodeHTML;
  }

  getPerkTop(position) {
    return (position[1] * (CMC.NODE_WIDTH + CMC.HORIZONTAL_SPACE)) + CMC.CONTAINER_PADDING;
  }

  getPerkLeft(position) {
    return (position[0] * (CMC.NODE_HEIGHT + CMC.VERTICAL_SPACE)) + CMC.CONTAINER_PADDING;
  }

  buildPerkTree() {
    let perkTree = AbilityFactory.GetPerkTree(
      this.playerCard.cardID
    );
    let $cardTree = $('.cardControlSection .cardTree').empty();
    let htmlElements = {};

    for (let key in perkTree) {
      let nodeHTML = this.buildPerkCard(perkTree[key]);
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
            x1: this.getPerkLeft(parent.position) + CMC.NODE_WIDTH / 2,
            y1: this.getPerkTop(parent.position) + CMC.NODE_HEIGHT / 2,
            x2: this.getPerkLeft(child.position) + CMC.NODE_WIDTH / 2,
            y2: this.getPerkTop(child.position) + CMC.NODE_HEIGHT / 2,
            stroke: "black", 'stroke-width': 2
          }
        ));
      }
    }

    // This makes the browser recognize that the SVGs created above are SVGs.
    $cardTree.html($cardTree.html());
  }
}
