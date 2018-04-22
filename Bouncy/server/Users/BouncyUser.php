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
    $chaosDeck = '[3, 2, 10, 11, 12]';
    $damageDeck = '[0, 1, 2, 3, 15]';
    $supportDeck = '[5, 6, 7, 8, 9]';
    $poisonDeck = '[13, 14, 15, 16, 17]';
    $turretDeck = '[18, 19, 20, 21, 22]';
    if ($this->id == 'tab' || $this->id == 'totg') {
      $this->decks = array(
        new PlayerDeck(0, "Chaos",   $chaosDeck),
      );
      return;
    } else if ($this->id == 'chip') {
      $this->decks = array(
        new PlayerDeck(0, "Support", $supportDeck),
      );
      return;
    } else if ($this->id == 'tj') {
      $this->decks = array(
        new PlayerDeck(0, "Damage",  $damageDeck),
      );
      return;
    } else if ($this->id == 'sean') {
      $this->decks = array(
        new PlayerDeck(0, "Poison",  $poisonDeck),
      );
      return;
    } else if ($this->id == 'clarence') {
      $this->decks = array(
        new PlayerDeck(0, "Turrets", $turretDeck),
      );
      return;
    }

    $this->decks = array(
      new PlayerDeck(0, "Damage",  $damageDeck),
    );
  }

  public function resetCardData() {
    $this->cards = [];
    $card_index = 0;
    for ($i = 0; $i < 5 * 5; $i++) {
      if ($i !== 10 && $i !== 12) {
        array_push($this->cards, new PlayerCard($card_index++, $i));
        //array_push($this->cards, new PlayerCard($card_index++, $i));
      }
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
    $toRet = [
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
    return $toRet;
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
    $card = new PlayerCard($decoded_card->card_index, $decoded_card);
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

    if ($user->cards[0]->card_id !== 0 || $user->cards[1]->card_id !== 0) {
      throw new Exception("Expected to own two copies of card index 0. [{$user->cards[0]->card_id}] vs [{$user->cards[1]->card_id}]");
    }

    $user->saveAllDecks();
    $user->saveAllCards();
  });

  function loadTest() {
    // Should have been saved above;
    $user = new BouncyUser(999999999, 'testing_user', 'testing_user', 'testing_user');
    if (strpos($user->decks[0]->cardListJSON, "null") !== false) {
      throw new Exception("Card list has a null card in it.");
    }
    if ($user->cards[0]->card_id !== 0 || $user->cards[1]->card_id !== 0) {
      throw new Exception("Expected to own two copies of card index 0. [{$user->cards[0]->card_id}] vs [{$user->cards[1]->card_id}]");
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
