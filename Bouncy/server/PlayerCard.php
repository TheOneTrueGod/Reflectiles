<?php
class PlayerCard {
  function __construct($card_data) {
    if (is_int($card_data)) {
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
      'card_id' => $this->cardID,
      'card_perks' => $this->cardPerks,
      'card_experience' => $this->cardExperience,
    );
  }
}
