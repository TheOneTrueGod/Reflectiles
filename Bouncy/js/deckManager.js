class DeckManager {
  constructor(serializedDecks, serializedCards) {
    this.decks = PlayerDeck.unstringifyAllDecks(JSON.parse(serializedDecks));
    this.cards = PlayerCard.unstringifyAllCards(JSON.parse(serializedCards));

    this.createCardSection();

    $('.deckFilter').on('click', (event) => {
      this.selectDeck(event.target.getAttribute('data-deck-id'));
    });

    $('.deckFilter').first().click();

    $('#loadingContainer').hide();
    $('.deckControlSection').removeClass("hidden");
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
  }

  createCardSection() {
    $('.cardsSection').empty();
    for (let card of this.cards) {
      let ability = AbilityDef.abilityDefList[card.cardID];
      $('.cardsSection').append(
        AbilityCardBuilder.createDeckListAbilityCard(ability)
      );
    }
  }

  displayDeck(deckID) {
    let $deckSection = $('.deckContentsSection');
    $deckSection.empty();
    let deck = this.getDeckByID(deckID);
    let abilities = deck.getAbilities();
    for (let ability of abilities) {
      $deckSection.append(
        AbilityCardBuilder.createDeckListAbilityCard(ability)
      );
    }
  }
}

//let mgr = new DeckManager();
