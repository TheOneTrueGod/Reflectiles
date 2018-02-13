<?php
require_once('Bouncy/server/PlayerCard.php');
require_once('Bouncy/server/PlayerDeck.php');
require_once('./server/User.php');
require_once('./server/datastore/DatastoreFactory.php');

class BouncyUser extends User {
  public function __construct($id, $username, $password, $token) {
    parent::__construct($id, $username, $password, $token);
    $this->experience = 0;
    $this->cards = null;
    $this->decks = null;
    $this->loadUserData();
  }

  public function resetDeckData() {
    $this->decks = array(
      new PlayerDeck(0, "Damage",  '[0, 1, 2, 3, 4]'),
      new PlayerDeck(1, "Support", '[5, 6, 7, 8, 9]'),
      new PlayerDeck(2, "Chaos",   '[10, 11, 12, 13, 14]'),
      new PlayerDeck(3, "Poison",  '[15, 16, 17, 18, 19]'),
      new PlayerDeck(4, "Turrets", '[20, 21, 22, 23, 24]'),
    );
  }

  public function resetCardData() {
    $this->cards = [];
    for ($i = 0; $i < 5 * 5; $i++) {
      array_push($this->cards, new PlayerCard($i, $i));
    }
  }

  public function loadUserData() {
    $datastore = DatastoreFactory::getDatastore();
    $json_data = $datastore->loadUserData($this);
    if ($json_data) {
      $user_data = json_decode($json_data);
      $this->deserializeData($user_data);
    }

    if ($this->decks == null) {
      $this->resetDeckData();
    }

    if ($this->cards == null) {
      $this->resetCardData();
    }
  }

  public function saveAllDecks() {
    $datastore = DatastoreFactory::getDatastore();
    $datastore->saveUserData($this, $this->serializeData());
  }

  public function saveAllCards() {
    $datastore = DatastoreFactory::getDatastore();
    $datastore->saveUserData($this, $this->serializeData());
  }

  private function serializeData() {
    return [
      'decks' => array_map(
        function($deck) {
          return $deck->serialize($this);
        },
        $this->decks
      ),
      'cards' => array_map(
        function ($card) {
          return $card->serialize($this);
        },
        $this->cards
      )
    ];
  }

  private function deserializeData($user_data) {
    $this->decks = array_map(
      function($deckObj) {
        return PlayerDeck::constructFromSerialized($deckObj);
      },
      $user_data->decks
    );
    if (array_key_exists('cards', $user_data)) {
      $this->cards = [];
      foreach ($user_data->cards as $card_data) {
        $player_card = new PlayerCard($card_data->card_index, $card_data);
        $this->cards[$player_card->card_index] = $player_card;
      }
    }
  }

  public function saveDecksFromClient($client_deck_json) {
    $this->decodeDecks(json_decode($client_deck_json));
    $this->saveAllDecks();
  }

  public function saveCardFromClient($card_json) {
    //$this->decodeDecks(json_decode($client_deck_json));
    $decoded_card = json_decode($card_json);
    $card = new PlayerCard($decoded_card->index, $decoded_card);
    $this->cards[$card->card_index] = $card;
    $this->saveAllCards();
  }

  private function decodeDecks($deckJSON) {
    $deckList = array_map(function ($deckSerialized) {
      return PlayerDeck::constructFromSerialized($deckSerialized);
    }, $deckJSON);
    $this->decks = $deckList;
  }

  public function getOwnedCards() {
    return $this->cards;
  }

  public function getCard($card_index) {
    if (array_key_exists($card_index, $this->cards)) {
      return $this->cards[$card_index];
    }
  }

  public function addExperience($card_index, $experience) {
    $card = $this->getCard($card_index);
    if ($card) {
      $card->addExperience($experience);
    }
  }
}

if (strpos(__FILE__, $_SERVER['SCRIPT_NAME']) !== false) {
  require_once('./testing_utils/TestingUtils.php');

  runTest("Saving", function () {
    $user = new BouncyUser(999999999, 'testing_user', 'testing_user', 'testing_user');
    $user->resetDeckData();
    $user->resetCardData();

    $user->saveAllDecks();
    $user->saveAllCards();
  });

  function loadTest() {
    // Should have been saved above;
    $user = new BouncyUser(999999999, 'testing_user', 'testing_user', 'testing_user');
    if (strpos($user->decks[0]->cardListJSON, "null") !== false) {
      throw new Exception("Card list has a null card in it.");
    }
  }

  runTest("Loading", loadTest);

  runTest("Saving After Loading", function () {
    $user = new BouncyUser(999999999, 'testing_user', 'testing_user', 'testing_user');

    $user->saveAllDecks();
    $user->saveAllCards();
  });

  runTest("Loading Round 2", loadTest);

  runTest("Add Experience", function() {
    $user = new BouncyUser(999999999, 'testing_user', 'testing_user', 'testing_user');
    $user->addExperience(1, 1000);
    $user->saveAllCards();
    $user = new BouncyUser(999999999, 'testing_user', 'testing_user', 'testing_user');
    if ($user->cards[1]->card_experience !== 1000) {
      throw new Exception("Card experience didn't save");
    }
  });
}
