<?php
class PlayerCard {
  function __construct($card_index, $card_data) {
    // index refers to the card in the player's collection
    $this->cardIndex = $card_index;
    if (is_int($card_data)) {
      // cardID refers to the id of the ability def
      $this->cardID = $card_data;
      $this->cardPerks = [];
      $this->cardExperience = 0;
    } else {
      $this->id = $card_data['card_id'];
      $this->cardPerks = $card_data['card_perks'];
      $this->cardExperience = $card_data['card_experience'];
    }
  }

  function serialize() {
    return array(
      'card_index' => $this->cardIndex,
      'card_id' => $this->cardID,
      'card_perks' => $this->cardPerks,
      'card_experience' => $this->cardExperience,
    );
  }
}
