<?php
class PlayerCard {
  function __construct($card_index, $card_data) {
    // index refers to the card in the player's collection
    $this->card_index = $card_index;
    if (is_int($card_data)) {
      // cardID refers to the id of the ability def
      $this->card_id = $card_data;
      $this->card_perks = [];
      $this->card_experience = 0;
    } else {
      $this->card_id = $card_data->card_id;
      $this->card_perks = $card_data->card_perks;
      $this->card_experience = $card_data->card_experience;
    }
  }

  function addExperience($experience) {
    if (is_int($experience) && $experience > 0) {
      $this->card_experience += $experience;
    }
  }

  function serialize() {
    return array(
      'card_index' => $this->card_index,
      'card_id' => $this->card_id,
      'card_perks' => $this->card_perks,
      'card_experience' => $this->card_experience,
    );
  }
}
