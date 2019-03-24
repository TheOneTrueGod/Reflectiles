<?php
require_once('server/GameObject.php');
require_once('FMJ/FMJController.php');
require_once('Bouncy/server/PlayerDeck.php');
require_once('Bouncy/server/Metadata.php');
require_once('./testing_utils/TestingUtils.php');

class FMJGameObject extends GameObject {
  function __construct($id, $name, $turn_id = 1, $game_data, $metadata, $creator_id) {
    GameObject::__construct($id, $name, $turn_id);
    $this->board_state = $game_data->board_state;
    $this->player_commands = $game_data->player_commands ?
      $game_data->player_commands :
      "{}";
    $this->finalized = $game_data->finalized === "true";
    $this->game_over = $game_data->game_over === "true";
    $this->players_won = $game_data->players_won === "true";
    $this->creator_id = $creator_id;
    $this->metadata = new Metadata($metadata);
  }

  protected function getSerializableData() {
    return [
      'board_state' => $this->board_state,
      'player_commands' => $this->player_commands,
      'finalized' => $this->finalized ? "true" : "false",
      'game_over' => $this->game_over ? "true" : "false",
      'players_won' => $this->players_won ? "true" : "false"
    ];
  }

  public function isUserHost($user) {
    return $this->creator_id == $user->getID();
  }

  public static function getGameTypeID() {
    return 'fullmetaljacket';
  }

  public static function getController() {
    return new FMJController();
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

  public function isPlayerInGame($player_id) {
    if ($this->metadata->player_data) {
      for ($i = 0; $i < count($this->metadata->player_data); $i++) {
        $playerData = json_decode($this->metadata->player_data[$i]);
        if ($playerData->user_id === $player_id) {
          return true;
        }
      }
    }
    return false;
  }

  public function createInitialMetadata() {
    $this->metadata = new Metadata();
    $this->saveMetadata();
  }

  protected function getCreatorID() {
    return $this->creator_id;
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

  public function setGameOver($game_over, $players_won, $experience_gained) {
    $was_game_over = $this->game_over;
    $this->game_over = $game_over === true || $game_over === "true";
    $this->players_won = $players_won === true || $players_won === "true";
    if ($was_game_over === false && $this->isGameOver()) {
      if (!$this->didPlayersWin()) {
        $experience_gained /= 2;
      }
      $this->finishGame(intval($experience_gained));
    }
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

  public function finishGame($experienceGained) {
    foreach ($this->metadata->player_data as $player_data) {
      if ($player_data) {
        $decoded = json_decode($player_data);
        $player = BouncyUser::getFromID($decoded->user_id);
        if ($player) {
          foreach ($decoded->ability_deck->card_list as $card_data) {
            $player->addExperience($card_data->card_index, $experienceGained);
          }
        }
        $player->saveAllCards();
      }
    }
  }
}

if (strpos(__FILE__, $_SERVER['SCRIPT_NAME']) !== false) {
  require_once('./testing_utils/TestingUtils.php');
  require_once('./Bouncy/server/Users/BouncyUser.php');

  $USER_ID = 999999999;
  $GAME_ID = 999999999;

  runTest("Creating Game", function() {
    $gameObj = new FMJGameObject($GAME_ID, "Created Reflectiles Game", 1, [], [], $USER_ID);
    $gameObj->createInitialMetadata();
    $gameObj->save();
    $gameObj->savePlayerData();

    $user = new BouncyUser($USER_ID, 'testing_user', 'testing_user', 'testing_user');
    $user->resetDeckData();
    $user->resetCardData();

    $user->saveAllDecks();
    $user->saveAllCards();

    $gameObj->addPlayer(0, $user);
  });

  runTest("Adding Experience", function () {
    $CARD_EXP = 10000;

    $user = new BouncyUser($USER_ID, 'testing_user', 'testing_user', 'testing_user');

    $gameObj = FMJGameObject::loadFromFile($GAME_ID);
    $gameObj->setGameOver(true, true, $CARD_EXP);
    $user = new BouncyUser($USER_ID, 'testing_user', 'testing_user', 'testing_user');
    if($user->cards[0]->card_experience !== $CARD_EXP) {
      throw new Exception("Card Experience Didn't Save");
    }
  });
}
