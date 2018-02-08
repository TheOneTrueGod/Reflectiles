class DeckManager {
  constructor(serializedDecks, serializedCards) {
    this.selectedDeck = null;

    this.decks = PlayerDeck.unstringifyAllDecks(JSON.parse(serializedDecks));
    this.cards = PlayerCard.unstringifyAllCards(JSON.parse(serializedCards));

    this.createCardSection();

    $('.deckFilter').on('click', (event) => {
      this.selectDeck(event.target.getAttribute('data-deck-id'));
    });

    $('.deckFilter').first().click();

    $('#loadingContainer').hide();
    $('.deckControlSection').removeClass("hidden");

    $(".deckControlSection .deckContentsSection").on("click", ".abilityCard", (event) => {
      let clickTarget = $(event.target);
      if (!clickTarget.hasClass("abilityCard")) {
        clickTarget = clickTarget.closest(".abilityCard");
      }
      this.removeCardFromDeck(clickTarget.data("playerCard"));
      this.markDeckDirty();
    });

    $(".deckControlSection .cardsSection").on("click", ".abilityCard", (event) => {
      // On Card Click
      let clickTarget = $(event.target);
      if (!clickTarget.hasClass("abilityCard")) {
        clickTarget = clickTarget.closest(".abilityCard");
      }
      let cardAbility = this.selectedDeck.addCard(clickTarget.data("playerCard"));
      if (cardAbility) {
        this.addCardToDeckSection(clickTarget.data("playerCard"), cardAbility);
        this.markDeckDirty();
      }
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
  }

  createCardSection() {
    $('.cardsSection').empty();
    for (let card of this.cards) {
      let ability = AbilityDef.abilityDefList[card.cardID];
      let displayCard = AbilityCardBuilder.createDeckListAbilityCard(ability);
      $('.cardsSection').append(displayCard);
      $(displayCard).data("playerCard", card);
    }
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
    let displayCard = AbilityCardBuilder.createDeckListAbilityCard(ability);
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
