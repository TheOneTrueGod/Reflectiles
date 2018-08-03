<?php
class Metadata {
  function __construct($json = null) {
    $this->player_data = [null, null, null, null];
    $this->game_started = false;
    $this->level = "1-1";
    $this->difficulty = "medium";
    $this->next_game = null;
    $this->retry_game = null;
    if ($json) {
      $decoded = json_decode($json);
      $this->game_started = ($decoded->game_started == "true");
      for ($i = 0; $i < 4; $i++) {
        if ($decoded->player_data[$i]) {
          $this->player_data[$i] = $decoded->player_data[$i];
        }
      }

      $this->level = $decoded->level;
      $this->difficulty = $decoded->difficulty;
      $this->next_game = $decoded->next_game;
      $this->retry_game = $decoded->retry_game;
    }
  }

  function getNextGame() {
    return $this->next_game;
  }

  function setNextGame($id) {
    $this->next_game = $id;
  }

  function getRetryGame() {
    return $this->retry_game;
  }

  function setRetryGame($id) {
    $this->retry_game = $id;
  }

  function getLevel() {
    return $this->level;
  }

  function setLevel($level) {
    $this->level = $level;
  }

  function getDifficulty() {
    return $this->difficulty;
  }

  function setDifficulty($difficulty) {
    $this->difficulty = $difficulty;
  }

  function serialize($user) {
    $toRet = array(
      'player_data' => $this->player_data,
      'game_started' => $this->game_started ? true : false,
      'difficulty' => $this->difficulty,
      'level' => $this->level,
      'next_game' => $this->next_game,
      'retry_game' => $this->retry_game,
    );
    if ($user) {
      $bouncy_user = BouncyUser::getFromID($user->id);
      $toRet['other_decks'] = array_map(
        function ($deck) use ($bouncy_user) {
          return $deck->serialize($bouncy_user);
        },
        PlayerDeck::getAllDecksForPlayer($user)
      );
    }
    return $toRet;
  }

  function setGameStarted() {
    $this->game_started = true;
  }

  function isGameStarted() {
    return $this->game_started;
  }

  function addPlayer($slot, $user) {
    if (!array_key_exists($slot, $this->player_data)) {
      throw new Exception("Invalid slot: '" . $slot . "'");
    }
    if ($this->isGameStarted()) {
      throw new Exception("Can't edit a game that's already started");
    }
    $player_data_encoded = $this->player_data[$slot];
    if (!!$player_data_encoded) {
      throw new Exception("Can't add a player to a full slot [" . $slot . "]");
    }

    $bouncy_user = BouncyUser::getFromID($user->id);
    $this->player_data[$slot] = json_encode(array(
      "user_id" => $bouncy_user->getID(),
      "user_name" => $bouncy_user->getUserName(),
      "ability_deck" => PlayerDeck::getDeckForPlayer($bouncy_user, null)->serialize($bouncy_user)
    ));
  }

  function removePlayer($slot, $user) {
    if ($this->isGameStarted()) {
      throw new Exception("Can't edit a game that's already started");
    }
    $player_data_encoded = $this->player_data[$slot];
    if (!$player_data_encoded) {
      throw new Exception("No player data in slot [" . $slot . "]");
    }

    $player_data = json_decode($player_data_encoded);
    if ($player_data->user_id !== $user->getID()) {
      throw new Exception("You can't remove someone that isn't yourself.");
    }
    $this->player_data[$slot] = null;
  }

  public function changeDeck($slot, $deck_id, $user) {
    if ($this->game_started) {
      throw new Exception("Can't edit a game that's already started");
    }
    $player_data_encoded = $this->player_data[$slot];
    if (!$player_data_encoded) {
      throw new Exception("Can't change the deck of an empty slot [" . $slot . "]");
    }

    $decoded_metadata = json_decode($this->player_data[$slot]);
    if ($decoded_metadata->user_id !== $user->getID()) {
      throw new Exception("Can't change the deck of someone else [" . $slot . "]");
    }

    $new_deck = PlayerDeck::getDeckForPlayer($user, $deck_id);
    if (!$new_deck) {
      throw new Exception("Couldn't find deck [" . $deck_id . "] for player [" . $user->getUserID() . "]");
    }
    $bouncy_user = BouncyUser::getFromID($user->id);

    $this->player_data[$slot] = json_encode(array(
      "user_id" => $bouncy_user->getID(),
      "user_name" => $bouncy_user->getUserName(),
      "ability_deck" => $new_deck->serialize($bouncy_user)
    ));
  }
}
