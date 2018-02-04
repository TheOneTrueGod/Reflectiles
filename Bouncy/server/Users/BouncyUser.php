<?php
require_once('Bouncy/server/PlayerCard.php');
class BouncyUser extends User {
  public function __construct($id, $username, $password, $token) {
    parent::__construct($id, $username, $password, $token);
    $this->experience = 0;
    $this->cards = [];
    for ($i = 0; $i < 5 * 5; $i++) {
      array_push($this->cards, new PlayerCard($i, $i));
    }
    $this->decks = null;
    $this->loadUserData();
  }

  public function loadUserData() {
    $datastore = DatastoreFactory::getDatastore();
    $json_data = $datastore->loadUserData($this);
    if ($json_data) {
      $user_data = json_decode($json_data);
      $this->deserializeData($user_data);
    }

    if ($this->decks == null) {
      $this->decks = array(
        new PlayerDeck(0, "Damage",  '[0, 1, 2, 3, 4]'),
        new PlayerDeck(1, "Support", '[5, 6, 7, 8, 9]'),
        new PlayerDeck(2, "Chaos",   '[10, 11, 12, 13, 14]'),
        new PlayerDeck(3, "Poison",  '[15, 16, 17, 18, 19]'),
        new PlayerDeck(4, "Turrets", '[20, 21, 22, 23, 24]'),
      );
    }
  }

  public function saveAllDecks() {
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
  }

  public function saveDecksFromClient($client_deck_json) {
    $this->decodeDecks(json_decode($client_deck_json));
    $this->saveAllDecks();
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

  public static function addExperience($deckID, $experience) {
    $this->experience += $experience;
    print_r($this);
    print_r($deckID);
    print_r("\n");
  }
}
 ?>
