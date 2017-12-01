<?php
require_once('server/GameObject.php');
require_once('CardsNMagic/CardsNMagicController.php');
class CardsNMagicGameObject extends GameObject {
  function __construct($id, $name, $turn_id = 1, $game_data) {
    GameObject::__construct($id, $name, $turn_id);
    $this->board_state = $game_data->board_state;
    $this->player_commands = $game_data->player_commands ?
      $game_data->player_commands:
      "{}";
    $this->finalized = $game_data->finalized === "true";
  }

  protected function getSerializableData() {
    return [
      'board_state' => $this->board_state,
      'player_commands' => $this->player_commands,
      'finalized' => $this->finalized ? "true" : "false"
    ];
  }

  public static function getGameTypeID() {
    return 'cards_n_magic';
  }

  public static function getController() {
    return new CardsNMagicController($this);
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
}
