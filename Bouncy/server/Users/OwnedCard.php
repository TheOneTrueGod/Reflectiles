<?php
class OwnedCard {
  public function __construct($card_id, $perks) {
    $this->card_id = $card_id;
    $this->perks = $perks;
  }
}
