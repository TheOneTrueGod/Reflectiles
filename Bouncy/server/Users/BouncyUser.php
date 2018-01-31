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
    $this->decks = array(
      new PlayerDeck(0, "Damage",  '[0, 1, 2, 3, 4]'),
      new PlayerDeck(1, "Support", '[5, 6, 7, 8, 9]'),
      new PlayerDeck(2, "Chaos",   '[10, 11, 12, 13, 14]'),
      new PlayerDeck(3, "Poison",  '[15, 16, 17, 18, 19]'),
      new PlayerDeck(4, "Turrets", '[20, 21, 22, 23, 24]'),
    );
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
