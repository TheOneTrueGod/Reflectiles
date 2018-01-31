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

    $(".deckControlSection").on("click", ".abilityCard", (event) => {
      let clickTarget = $(event.target);
      if (!clickTarget.hasClass("abilityCard")) {
        clickTarget = clickTarget.closest(".abilityCard");
      }
      let cardAbility = this.selectedDeck.addCard(clickTarget.data("playerCard"));
      this.addCardToDeckSection(cardAbility);
    });
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

    this.displayDeck(deckID);
    this.selectedDeck = this.decks[deckID];
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
    for (let ability of abilities) {
      this.addCardToDeckSection(ability);
    }
  }

  addCardToDeckSection(ability) {
    let $deckSection = $('.deckContentsSection');
    $deckSection.append(AbilityCardBuilder.createDeckListAbilityCard(ability));
  }
}

//let mgr = new DeckManager();
