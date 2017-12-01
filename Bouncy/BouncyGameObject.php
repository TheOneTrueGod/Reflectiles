<?php
require_once('server/GameObject.php');
require_once('Bouncy/BouncyController.php');
require_once('Bouncy/server/PlayerDeck.php');
require_once('Bouncy/server/Metadata.php');
class BouncyGameObject extends GameObject {
  function __construct($id, $name, $turn_id = 1, $game_data, $metadata) {
    GameObject::__construct($id, $name, $turn_id);
    $this->board_state = $game_data->board_state;
    $this->player_commands = $game_data->player_commands ?
      $game_data->player_commands :
      "{}";
    $this->finalized = $game_data->finalized === "true";
    $this->game_over = $game_data->game_over === "true";
    $this->players_won = $game_data->players_won === "true";
    $this->metadata = new Metadata($metadata);
  }

  protected function getSerializableData() {
    return [
      'board_state' => $this->board_state,
      'player_commands' => $this->player_commands,
      'finalized' => $this->finalized ? "true" : "false",
      'game_over' => $this->game_over ? "true" : "false",
      'players_won' => $this->players_won ? "true" : "false",
    ];
  }

  public static function getGameTypeID() {
    return 'bouncy';
  }

  public static function getController() {
    return new BouncyController();
  }

  public function getBoardState() {
    return $this->board_state;
  }

  public function getPlayerCommands() {
    return $this->player_commands;
  }

  public function setFinalized($finalized) {
    $this->finalized = $finalized;
  }

  public function isFinalized() {
    return $this->finalized;
  }

  public function getMetadata() {
    return $this->metadata;
  }

  public function createInitialMetadata() {
    $this->metadata = new Metadata();
    $this->saveMetadata();
  }

  public function saveMetadata() {
    $datastore = DatastoreFactory::getDatastore();
    $datastore::saveGameObjectMetadataJSON($this);
  }

  public function setPlayerCommand($playerID, $command) {
    if ($this->finalized) {
      throw new Exception("Can't set a command on a finalized turn");
    }

    $pc = json_decode($this->player_commands);
    $pc->$playerID = $command;
    $this->player_commands = json_encode($pc);
  }

  public function resetAllPlayerCommands() {
    $this->player_commands = "{}";
  }

  public function setBoardState($board_state) {
    if ($this->finalized) {
      throw new Exception("Can't set board state on a finalized turn");
    }
    $this->board_state = $board_state;
  }

  public function setGameOver($game_over, $players_won) {
    $this->game_over = $game_over === true || $game_over === "true";
    $this->players_won = $players_won === true || $players_won === "true";
  }
  public function isGameOver() { return $this->game_over; }
  public function didPlayersWin() { return $this->players_won; }

  public function startGame() {
    $this->metadata->setGameStarted();
    $this->saveMetadata();
  }

  public function removePlayer($slot, $user) {
    $this->metadata->removePlayer($slot, $user);
    $this->saveMetadata();
    return $this->metadata;
  }

  public function addPlayer($slot, $user) {
    $this->metadata->addPlayer($slot, $user);
    $this->saveMetadata();
    return $this->metadata;
  }

  public function changeDeck($slot, $deck_id, $user) {
    $this->metadata->changeDeck($slot, $deck_id, $user);
    $this->saveMetadata();
    return $this->metadata;
  }
}
