<?php
require_once('server/datastore/DatastoreFactory.php');
require_once('CardsNMagic/CardsNMagicGameObject.php');
require_once('Bouncy/BouncyGameObject.php');
require_once('server/exceptions/GameDoesntExistException.php');

abstract class GameObject {
  private $id;
  private $turn_id;
  private $name;
  function __construct($id, $name, $turn_id = 1) {
    $this->id = $id;
    $this->turn_id = $turn_id;
    $this->name = $name;
  }

  public function getID() { return $this->id; }
  public function getCurrentTurn() { return $this->turn_id; }
  public function setCurrentTurn($turn) { $this->turn_id = $turn; }
  public function getName() { return $this->name; }
  public abstract static function getGameTypeID();
  public function isGameOver() { return false; }
  public function didPlayersWin() { return false; }
  public function createInitialMetadata() {}

  public function save() {
    DatastoreFactory::getDatastore()->saveGameObjectJSON($this);
  }

  public function getJSON() {
    return json_encode([
      'id' => $this->getID(),
      'turn_id' => $this->getCurrentTurn(),
      'name' => $this->getName(),
      'game_type_id' => $this::getGameTypeID(),
      'game_data' => $this->getSerializableData()
    ]);
  }

  protected abstract function getSerializableData();

  public static function loadFromJSON($json, $metadata) {
    $decoded = json_decode($json);
    $game_type = $decoded->game_type_id;
    switch ($game_type) {
      case CardsNMagicGameObject::getGameTypeID();
        $go = new CardsNMagicGameObject(
          $decoded->id,
          $decoded->name,
          $decoded->turn_id,
          $decoded->game_data
        );
      break;
      case BouncyGameObject::getGameTypeID();
        $go = new BouncyGameObject(
          $decoded->id,
          $decoded->name,
          $decoded->turn_id,
          $decoded->game_data,
          $metadata
        );
      break;
    }
    if (!$go) {
      throw new Exception("Couldn't identify json ({$json})\n\n");
    }
    return $go;
  }

  public static function loadFromFile($game_id, $turn_id = -1) {
    $json = DatastoreFactory::getDatastore()->getGameObjectJSON(
      $game_id,
      $turn_id
    );
    $metadata = DatastoreFactory::getDatastore()->getGameObjectMetadata(
      $game_id
    );
    return self::loadFromJSON($json, $metadata);
  }

  public function delete() {
    $datastore = DatastoreFactory::getDatastore();
    $datastore->deleteGame($this->id);
  }

  public static function savePlayerData() {

  }
}
