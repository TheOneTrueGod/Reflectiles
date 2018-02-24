const CMC = { // Card Manager Constants
  CONTAINER_PADDING : 25,
  NODE_WIDTH : 50,
  NODE_HEIGHT : 50,
  HORIZONTAL_SPACE : 20,
  VERTICAL_SPACE : 20,
};

class CardManager {
  constructor(deckManager) {
    this.deckManager = null;
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

    $(".cardControlSection .deckManagerButton").on("click", (event) => {
      this.deckManager.updateCard(this.playerCard);
      $(".cardControlSection").addClass("hidden");
      $(".deckControlSection").removeClass("hidden");
    });
  }

  setDeckManager(deckManager) {
    this.deckManager = deckManager;
  }

  setupForCard(playerCard) {
    this.previewPerkList = [];
    this.playerCard = playerCard;

    $(".cardControlSection .saveButton").addClass("disabled");
    $(".cardControlSection .cardExperienceNumber").text(this.playerCard.getLeftoverExperience());
    let expPercent = Math.floor(this.playerCard.getExperiencePercent() * 100);
    $(".cardControlSection .cardExperienceBar").css("width", expPercent + "%");

    this.buildPerkTree();
    this.updateCardDetails();
  }

  updateCardDetails() {
    this.abilityDef = AbilityFactory.GetAbility(
      this.playerCard.cardID, this.playerCard.cardPerks.slice(0).concat(this.previewPerkList)
    );

    // Card name and description
    $(".cardControlSection .cardName").text(this.abilityDef.getName());
    $(".cardControlSection .cardDescription").html(this.abilityDef.getDescription());

    // Update experience section
    $(".cardControlSection .cardPerkPointsAvailable .cardPerkPoints").text(
      this.playerCard.getPerkPoints() - this.previewPerkList.length
    );

    if (MainGame && MainGame instanceof CardDemo) {
      MainGame.demoAbility(this.abilityDef);
    }
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

  tryToRemovePerk(perkKey, recursed) {
    let index = this.previewPerkList.indexOf(perkKey);
    if (index !== -1) {
      let perkTree = AbilityFactory.GetPerkTree(
        this.playerCard.cardID
      );

      this.previewPerkList.splice(index, 1);

      for (let treePerkKey in perkTree) {
        for (let requirement of perkTree[treePerkKey].requirements) {
          if (requirement.hasPerkAsRequirement(perkKey)) {
            while (this.previewPerkList.indexOf(treePerkKey) !== -1) {
              this.tryToRemovePerk(treePerkKey, true);
            }
          }
        }
      }
      if (!recursed) {
        this.buildPerkTree();
        this.updateCardDetails();
      }
    }
  }

  tryToAddPerk(perkKey) {
    if (
      this.playerCard.getPerkPoints() > this.previewPerkList.length &&
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
      this.buildPerkTree();
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
    nodeHTML.css('top', CardManager.getPerkTop(perk.position));
    nodeHTML.css('left', CardManager.getPerkLeft(perk.position));
    nodeHTML.css('width', CMC.NODE_WIDTH);
    nodeHTML.css('height', CMC.NODE_HEIGHT);
    nodeHTML.attr("perkkey", perk.key);

    if (ownedPerkCount + previewPerkCount == perk.levels) {
      nodeHTML.addClass("owned mastered");
    } else if (ownedPerkCount > 0) {
      nodeHTML.addClass("owned");
    } else if (!AbilityFactory.CanAddPerk(
        this.playerCard.cardID,
        perk.key,
        this.playerCard.cardPerks.slice(0).concat(this.previewPerkList)
      )) {
      nodeHTML.addClass("blocked");
    } else {
      nodeHTML.addClass("notowned");
    }

    if (previewPerkCount > 0) {
      nodeHTML.addClass("preview");
    }

    $cardTree.append(nodeHTML);

    return nodeHTML;
  }

  static getPerkTop(position) {
    return (position[1] * (CMC.NODE_WIDTH + CMC.HORIZONTAL_SPACE)) + CMC.CONTAINER_PADDING;
  }

  static getPerkLeft(position) {
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

    let lineSVG = $("<svg width='100%' height='100%'>");
    $cardTree.append(lineSVG);
    for (let key in perkTree) {
      let parent = perkTree[key];
      for (let requirement of perkTree[key].requirements) {
        let childKeys = requirement.getPerkKeys();
        for (let childKey of childKeys) {
          let child = perkTree[childKey];

          let svgLines = requirement.getSVGLines(parent, child);
          for (let line of svgLines) {
            lineSVG.append(line);
          }
        }
      }
    }

    // This makes the browser recognize that the SVGs created above are SVGs.
    $cardTree.html($cardTree.html());
  }

  handleSave(event) {
    this.playerCard.addPerks(this.previewPerkList);
    this.setupForCard(this.playerCard);
    ServerCalls.SavePlayerCard(null, this.playerCard);
  }
}
