<?php
require_once('Bouncy/server/PlayerCard.php');
class BouncyUser extends User {
  public function __construct($id, $username, $password, $token) {
    parent::__construct($id, $username, $password, $token);
    $this->experience = 0;
    $this->cards = [];
    for ($i = 0; $i < 5 * 5; $i++) {
      array_push($this->cards, new PlayerCard($i));
    }
    $this->decks = array(
      new PlayerDeck(0, "Damage", PlayerDeck::getTJDeck()),
      new PlayerDeck(1, "Support", PlayerDeck::getChipDeck()),
      new PlayerDeck(2, "Chaos", PlayerDeck::getTabithaDeck()),
      new PlayerDeck(3, "Poison", PlayerDeck::getSeanDeck()),
      new PlayerDeck(4, "Turrets", PlayerDeck::getClarenceDeck()),
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
