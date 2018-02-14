const CMC = { // Card Manager Constants
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
    $(".cardControlSection .saveButton").on(
      "click",
      (event) => { this.handleSave(event); }
    );

    $(".cardControlSection .cardTree")
      .on("click", ".perkNode", (event) => { this.cardClicked(event); })
      .on("contextmenu", ".perkNode", (event) => { this.cardClicked(event); });
  }

  setupForCard(playerCard) {
    this.playerCard = playerCard;

    $(".cardControlSection .saveButton").addClass("disabled");
    $(".cardControlSection .cardExperienceNumber").text(this.playerCard.getLeftoverExperience());
    let expPercent = Math.floor(this.playerCard.getExperiencePercent() * 100);
    $(".cardControlSection .cardExperienceBar").css("width", expPercent + "%");
    this.updateCardDetails();

    this.buildPerkTree();
  }

  updateCardDetails() {
    this.abilityDef = AbilityFactory.GetAbility(
      this.playerCard.cardID, this.playerCard.cardPerks.slice(0).concat(this.previewPerkList)
    );

    // Card name and description
    $(".cardControlSection .cardName").text(this.abilityDef.getName());
    $(".cardControlSection .cardDescription").html(this.abilityDef.getDescription());

    // Update experience section
    let cardLevel = this.playerCard.getCardLevel();
    $(".cardControlSection .cardPerkPointsAvailable .cardPerkPoints").text(
      cardLevel - this.playerCard.cardPerks.length - this.previewPerkList.length
    );
  }

  cardClicked(event) {
    let target = $(event.target);
    if (!target.hasClass("perkNode")) {
      target = target.closest(".perkNode");
    }
    let perkKey = target.attr("perkkey");
    if (event.button == 2) {
      this.tryToRemovePerk(perkKey);
    } else {
      this.tryToAddPerk(perkKey);
    }

    if (this.previewPerkList.length > 0) {
      $(".cardControlSection .saveButton").removeClass("disabled");
    } else {
      $(".cardControlSection .saveButton").addClass("disabled");
    }

    event.preventDefault();
    return false;
  }

  tryToRemovePerk(perkKey) {
    let index = this.previewPerkList.indexOf(perkKey);
    if (index !== -1) {
      let perkTree = AbilityFactory.GetPerkTree(
        this.playerCard.cardID
      );

      this.previewPerkList.splice(index, 1);

      this.updateCardDetails();
      let perkHTML = this.buildPerkCard(perkTree[perkKey]);
      let newIndex = this.previewPerkList.indexOf(perkKey);
      if (newIndex !== -1) {
        $(perkHTML).addClass("preview");
      }

      for (let treePerkKey in perkTree) {
        if (perkTree[treePerkKey].children.indexOf(perkKey) !== -1) {
          while (this.previewPerkList.indexOf(treePerkKey) !== -1) {
            this.tryToRemovePerk(treePerkKey);
          }
        }
      }
    }
  }

  tryToAddPerk(perkKey) {
    if (
      this.playerCard.getCardLevel() > this.playerCard.cardPerks.length + this.previewPerkList.length &&
      AbilityFactory.CanAddPerk(
        this.playerCard.cardID,
        perkKey,
        this.playerCard.cardPerks.slice(0).concat(this.previewPerkList)
      )
    ) {
      this.previewPerkList.push(perkKey);

      let perkTree = AbilityFactory.GetPerkTree(
        this.playerCard.cardID
      );
      let perkHTML = this.buildPerkCard(perkTree[perkKey]);

      $(perkHTML).addClass("preview");
      this.updateCardDetails();
    }
  }

  buildPerkCard(perk) {
    let $cardTree = $('.cardControlSection .cardTree');

    let previewPerkCount = 0;
    let ownedPerkCount = 0;
    this.previewPerkList.forEach((perkName) => {
      if (perkName === perk.key) {
        previewPerkCount += 1;
      }
    });

    this.playerCard.cardPerks.forEach((perkName) => {
      if (perkName === perk.key) {
        ownedPerkCount += 1;
      }
    });

    let nodeHTML = perk.createNodeHTML(previewPerkCount + ownedPerkCount);
    nodeHTML.css('top', this.getPerkTop(perk.position));
    nodeHTML.css('left', this.getPerkLeft(perk.position));
    nodeHTML.css('width', CMC.NODE_WIDTH);
    nodeHTML.css('height', CMC.NODE_HEIGHT);
    nodeHTML.attr("perkkey", perk.key);

    if (previewPerkCount == 0) {
      if (ownedPerkCount == perk.levels) {
        nodeHTML.addClass("owned mastered");
      } else if (ownedPerkCount > 0) {
        nodeHTML.addClass("owned");
      }
    }

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

  handleSave(event) {
    this.playerCard.addPerks(this.previewPerkList);
    this.previewPerkList = [];
    this.setupForCard(this.playerCard);
    ServerCalls.SavePlayerCard(null, this.playerCard);
  }
}
