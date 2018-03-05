<?php
class PlayerDeck {
  function __construct($id, $name, $cardListJSON) {
    $this->id = $id;
    $this->name = $name;
    $this->cardListJSON = $cardListJSON;
  }

  public static function constructFromSerialized($serialized) {
    if (is_array($serialized->card_list)) {
      $cardList = json_encode(array_map(
        function($serialized_card) {
          return $serialized_card->card_index;
        },
        $serialized->card_list
      ));
    } else if (is_string($serialized->card_list)) {
      $cardList = $serialized->card_list;
    }

    return new PlayerDeck(
      $serialized->id,
      $serialized->name,
      $cardList
    );
  }

  public function serialize($bouncy_user) {
    $serializedCards = array();
    $card_list = json_decode($this->cardListJSON);
    if ($this->name == "Damage") {
    }
    foreach ($card_list as $card_index) {
      $card = $bouncy_user->cards[intval($card_index)];
      if ($card) {
        array_push($serializedCards, $card->serialize());
      } else {
        print_r(debug_backtrace());
        print_r("ERROR: ");
        print_r($bouncy_user);
        print_r("\n");
        print_r("Card Index: ");
        print_r($card_index);
        print_r("\n");
      }
    }

    return array(
      'id' => $this->id,
      'name' => $this->name,
      'card_list' => $serializedCards
    );
  }

  public static function getDeckForPlayer($user, $index) {
    if ($index === null) {
      $index = 0;
      switch ($user->getUserName()) {
        case "Jabberwookie":
          $index = 0;
          break;
        case "ILoveTheLag":
          $index = 1;
          break;
        case "Tabitha":
          $index = 2;
          break;
        case "Sean":
          $index = 3;
          break;
        case "Clarence":
          $index = 4;
          break;
      }
    }
    $all_decks = self::getAllDecksForPlayer($user);
    if (!(0 <= $index && $index < count($all_decks))) {
      throw new Exception("Deck Index [" . $index . "] out of bounds");
    }
    return $all_decks[$index];
  }

  public static function getAllDecksForPlayer($user) {
    $bouncy_user = BouncyUser::getFromID($user->id);
    // These are actually filled in on the client side for now.
    return $bouncy_user->decks;
  }
}

// For Sean;
// Likes status effects over direct damage
// Phasing shot -- passes through things at a certain distance
// He likes the frozen orb and effects like that
// Shoot an enemy.  If it dies, it explodes.
// Passthrough projectile.
// AoE Explodes on contact.
