<?php
class PlayerDeck {
  function __construct($id, $name, $deckJSON) {
    $this->id = $id;
    $this->name = $name;
    $this->deckJSON = $deckJSON;
  }

  public function serialize() {
    return array(
      'id' => $this->id,
      'name' => $this->name,
      'deckJSON' => $this->deckJSON
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
    // These are actually filled in on the client side for now.
    return array(
      new PlayerDeck(0, "1 - Damage", self::getTJDeck()),
      new PlayerDeck(1, "2 - Support", self::getChipDeck()),
      new PlayerDeck(2, "3 - Chaos", self::getTabithaDeck()),
      new PlayerDeck(3, "4 - Poison", self::getSeanDeck()),
      new PlayerDeck(4, "5 - Turrets", self::getClarenceDeck()),
    );
  }

  private static function getTJDeck() {
    return '['
      . self::getShotgunAbility() . ',' .
      '{
        "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":150,"aoe_type":"BOX"}],"icon":"../Bouncy/assets/icons/icon_plain_explosion.png"
      },{
        "ability_type":"PROJECTILE","shape":"CHAIN_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":200}],"bullet_waves":6
      },{
        "ability_type":"PROJECTILE","shape":"RAIN","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":20}],"num_bullets":50,"icon":"../Bouncy/assets/icons/icon_plain_rain.png"
      },{
        "ability_type":"PROJECTILE","shape":"CHAIN_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":60},{"effect":"BULLET_SPLIT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":40}],"num_bullets":6}],"bullet_waves":5,"bullet_wave_delay":5,"icon":"../Bouncy/assets/icons/icon_plain_splurt.png",
        "charge":{"initial_charge":-1, "max_charge":3, "charge_type":"TURNS"}
      }
    ]';
  }

  private static function getShotgunAbility() {
    return '{"ability_type":"PROJECTILE","shape":"SPRAY_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":100}],"num_bullets":12}';
  }

  private static function getChipDeck() {
    return '[{
      "ability_type":"PROJECTILE","shape":"TRI_SHOT","projectile_type":"HIT","num_bullets":2,"hit_effects":[{"effect":"DAMAGE","base_damage":200}]
    },{
      "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"PENETRATE","hit_effects":[{"effect":"DAMAGE","base_damage":1000}],"icon":"../Bouncy/assets/icons/icon_plain_drill.png"
    },{
      "ability_type":"ZONE","unit_interaction":{"prevent_unit_entry":true,"unit_enter":[{"effect":"ABILITY","ability_source":"BELOW_UNIT","abil_def":{"ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"PENETRATE","hit_effects":[{"effect":"DAMAGE","base_damage":400}]}}]},"duration":5,"zone_size":{"left":1,"right":1,"top":0,"bottom":0,"y_range": 0},"unit_enter_effect":{},"icon":"../Bouncy/assets/icons/icon_plain_shield.png",
      "charge":{"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"},"projectile_interaction": {"reflects_enemy_projectiles":true, "destroy":true}
    },{
      "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"FREEZE","duration":3}],"icon":"../Bouncy/assets/icons/icon_plain_frost.png",
      "charge":{"initial_charge":-1,"max_charge":2,"charge_type":"TURNS"}
    },{
      "ability_type":"PROJECTILE","shape":"SINGLE_SHOT","projectile_type":"HIT","hit_effects":[{"effect":"DAMAGE","base_damage":"50%","aoe_type":"BOX","aoe_size":{"x":[-2,2],"y":[-2,0]}}],"icon":"../Bouncy/assets/icons/icon_plain_hearts.png"
    }]';
  }


  private static function getTestDeck() {
    return '[]';
  }

  private static function getTabithaDeck() { return '[]'; }
  private static function getSeanDeck() { return '[]'; }
  private static function getClarenceDeck() { return '[]'; }
}

// For Sean;
// Likes status effects over direct damage
// Phasing shot -- passes through things at a certain distance
// He likes the frozen orb and effects like that
// Shoot an enemy.  If it dies, it explodes.
// Passthrough projectile.
// AoE Explodes on contact.
