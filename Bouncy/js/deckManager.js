class DeckManager {
  constructor(serializedDecks, serializedCards, cardManager) {
    cardManager.setDeckManager(this);
    this.selectedDeck = null;

    this.decks = PlayerDeck.unstringifyAllDecks(JSON.parse(serializedDecks));
    this.cards = PlayerCard.unstringifyAllCards(JSON.parse(serializedCards));
    this.cardManager = cardManager;

    this.createCardSection();

    $('.deckFilter').on('click', (event) => {
      this.selectDeck(event.target.getAttribute('data-deck-id'));
    });

    $('.deckFilter').first().click();

    $('#loadingContainer').hide();
    $('.deckControlSection').removeClass("hidden");

    $(".deckControlSection .deckContentsSection")
      .on("click", ".abilityCard", (event) => { this.deckCardClicked(event); })
      .on("contextmenu", ".abilityCard", (event) => { this.deckCardClicked(event); });

    $(".deckControlSection .cardsSection")
      .on("click", ".abilityCard", (event) => {
        this.collectionCardClicked(event);
      })
      .on("contextmenu", ".abilityCard", (event) => {
        this.collectionCardClicked(event);
      });

    $('.chooseDeckButton').on('click', (event) => {
      $('.deckToolbar .active').removeClass('active');
      $('.deckToolbar .deckFilterSection').addClass('active');
    });

    $('.deckToolbar .saveButton').on('click', (event) => {
      if (!$('.deckToolbar .saveButton').hasClass('disabled')) {
        $('.deckToolbar .saveButton').addClass("disabled");
        this.saveDeckChanges();
      }
    });

    this.updateCardStatus();

    var url_string = window.location.href;
    var url = new URL(url_string);
    var autoSelect = url.searchParams.get("card");
    if (autoSelect !== null) {
      $('.abilityCard[data-index=' + autoSelect + ']').first().trigger({
          type: 'contextmenu',
          button: 2
      });
    }
  }

  deckCardClicked(event) {
    let clickTarget = $(event.target);
    if (!clickTarget.hasClass("abilityCard")) {
      clickTarget = clickTarget.closest(".abilityCard");
    }
    if (event.button == 2 || event.shiftKey) {
      this.showCardManager(clickTarget.data("playerCard"));
    } else {
      this.removeCardFromDeck(clickTarget.data("playerCard"));
      this.markDeckDirty();
      this.updateCardStatus();
    }

    event.preventDefault();
    return false;
  }

  collectionCardClicked(event) {
    // On Card Click
    let clickTarget = $(event.target);
    if (!clickTarget.hasClass("abilityCard")) {
      clickTarget = clickTarget.closest(".abilityCard");
    }
    let playerCard = clickTarget.data("playerCard");
    if (event.button == 2 || event.shiftKey) {
      this.showCardManager(playerCard);
    } else {
      if (playerCard) {
        let cardAbility = this.selectedDeck.addCard(playerCard);
        if (cardAbility) {
          this.addCardToDeckSection(playerCard, cardAbility);
          this.markDeckDirty();
          this.updateCardStatus();
        }
      }
    }
    event.preventDefault();
    return false;
  }

  showCardManager(playerCard) {
    this.cardManager.setupForCard(playerCard);
    $(".deckControlSection").addClass("hidden");
    $(".cardControlSection").removeClass("hidden");
  }

  updateCardStatus() {
    $(".cardsSection .abilityCard.deckList").each((_, $card) => {
      let cardIndex = $card.getAttribute("data-index");
      let playerCard = this.cards[cardIndex];
      let reason = this.selectedDeck.canAddCardToDeck(playerCard);
      $($card).removeClass("cantAdd");
      if (reason !== true) {
        if (reason !== DeckReason.DECK_FULL) {
          $($card).addClass("cantAdd");
        }
      }
    });
  }

  markDeckDirty() {
    $('.deckToolbar .saveButton').removeClass("disabled");
  }

  getDeckByID(id) {
    for (let deck of this.decks) {
      if (deck.id == id) {
        return deck;
      }
    }
    return null;
  }

  selectDeck(deckID) {
    $('.deckFilter.selected').removeClass('selected');
    $('[data-deck-id=' + deckID + ']').addClass("selected");

    $('.deckToolbar .active').removeClass('active');
    $('.deckToolbar .tools').addClass('active');

    this.displayDeck(deckID);
    this.selectedDeck = this.decks[deckID];

    $('.deckToolbar .deckName').text(this.decks[deckID].name);
    this.updateCardStatus();
  }

  createCardSection() {
    $('.cardsSection').empty();
    for (let card of this.cards) {
      let displayCard = this.createDisplayCard(card);
      $('.cardsSection').append(displayCard);
    }
  }

  createDisplayCard(playerCard) {
    let ability = AbilityFactory.GetAbility(playerCard);
    let displayCard = AbilityCardBuilder.createDeckListAbilityCard(playerCard, ability);
    $(displayCard).data("playerCard", playerCard);
    return displayCard;
  }

  updateCard(playerCard) {
    let displayCard = this.createDisplayCard(playerCard);
    $('.cardsSection [data-index="' + playerCard.card_index + '"]').replaceWith(displayCard);
    this.updateCardStatus();
  }

  displayDeck(deckID) {
    let $deckSection = $('.deckContentsSection');
    $deckSection.empty();
    let deck = this.getDeckByID(deckID);
    let abilities = deck.getAbilities();
    let playerCards = deck.getPlayerCards();
    for (let i = 0; i < abilities.length; i++) {
      let ability = abilities[i];
      let playerCard = playerCards[i];
      this.addCardToDeckSection(playerCard, ability);
    }
  }

  addCardToDeckSection(playerCard, ability) {
    let $deckSection = $('.deckContentsSection');
    let displayCard = AbilityCardBuilder.createDeckListAbilityCard(playerCard, ability);
    $deckSection.append(displayCard);
    $(displayCard).data("playerCard", playerCard);
  }

  removeCardFromDeck(playerCard) {
    let $deckSection = $('.deckContentsSection');
    this.selectedDeck.removeCard(playerCard);
    $(".deckContentsSection .abilityCard").each((index, cardDisplay) => {
      let $cardDisplay = $(cardDisplay);
      $cardDisplay.tooltip('hide');
      if ($($cardDisplay).data('playerCard') === playerCard) {
        $cardDisplay.remove();
      }
    });
  }

  saveDeckChanges() {
    ServerCalls.SavePlayerDecks(() => {}, this.decks);
  }
}

//let mgr = new DeckManager();
