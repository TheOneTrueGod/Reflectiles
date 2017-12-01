<?php
const BOUNCY_SERVER_ACTIONS = [
  'GET_BOARD_DATA' => 'get_board_data',
  'SET_BOARD_AT_TURN_START' => 'set_board_at_turn_start',
  'FINALIZE_TURN' => 'finalize_turn',
  'SUBMIT_PLAYER_COMMANDS' => 'submit_player_commands',
  'GET_TURN_STATUS' => 'get_turn_status',
  'GET_GAME_METADATA' => 'get_game_metadata',
  'UPDATE_PRE_GAME_STATE' => 'update_pre_game_state'
];

const SLOT_ACTIONS = [
  'JOIN' => 'join',
  'QUIT' => 'quit',
  'KICK' => 'kick',
  'START' => 'start',
  'CHANGE_DECK' => 'change_deck',
  'SET_LEVEL' => 'set_level',
  'SET_DIFFICULTY' => 'set_difficulty',
];

class BouncyController {
  private $gameObject;
  private $request;
  private $user;

  public function getResponse($request, $gameObject, $user) {
    $action = $request->param('action');
    $this->request = $request;
    $this->gameObject = $gameObject;
    $this->user = $user;

    if(!$action) {
      return $this->getGameHTML($user);
    }

    switch ($action) {
      case BOUNCY_SERVER_ACTIONS['GET_BOARD_DATA']:
        return $this->getBoardData();
      case BOUNCY_SERVER_ACTIONS['GET_GAME_METADATA']:
        return $this->getGameMetaData();
      case BOUNCY_SERVER_ACTIONS['GET_TURN_STATUS']:
        return $this->getTurnStatus();
      case BOUNCY_SERVER_ACTIONS['SET_BOARD_AT_TURN_START']:
        if (!$this->user->isHost()) {
          throw new Exception("Only the host can do this action");
        }
        return $this->setBoardAtTurnStart();
      case BOUNCY_SERVER_ACTIONS['FINALIZE_TURN']:
        if (!$this->user->isHost()) {
          throw new Exception("Only the host can do this action");
        }
        return $this->finalizeTurn();
      case BOUNCY_SERVER_ACTIONS['SUBMIT_PLAYER_COMMANDS']:
        return $this->savePlayerCommands();
      case BOUNCY_SERVER_ACTIONS['UPDATE_PRE_GAME_STATE']:
        return $this->updatePreGameState();
      break;
    }
    throw new Exception("$action not handled in BouncyController");
    return "";
  }

  private function getGameHTML($user) {
    $is_host = $this->user->isHost();
    $turn = $this->gameObject->getCurrentTurn();
    $game_id = $this->gameObject->getID();

    ob_start(); ?>
    <?php require('BouncyPageHTML.php'); ?>
    <?php require('Bouncy/js_includes.html'); ?>
    <script src="../Bouncy/js/gameLauncher.js"></script>
    <?php
    return ob_get_clean();
  }

  private function getBoardData() {
    return json_encode(
      [
        'board_state' => $this->gameObject->getBoardState(),
        'player_commands' => $this->gameObject->getPlayerCommands(),
        'finalized' => $this->gameObject->isFinalized(),
      ]
    );
  }

  private function getGameMetaData() {
    return $this->gameObject->getMetadata()->serialize($this->user);
  }

  private function getTurnStatus() {
    return json_encode(
      [
        'player_commands' => $this->gameObject->getPlayerCommands(),
        'finalized' => $this->gameObject->isFinalized(),
        'current_turn' => $this->gameObject->getCurrentTurn(),
      ]
    );
  }

  private function setBoardAtTurnStart() {
    if (!$this->user->isHost()) {
      throw new Exception("You're not the host");
    }

    if ($this->request->param('turn') !== $this->gameObject->getCurrentTurn()) {
      $this->gameObject->setFinalized(false);
      $this->gameObject->resetAllPlayerCommands();
    }

    $this->gameObject->setBoardState(
      $this->request->param('board_state')
    );

    $this->gameObject->setCurrentTurn(
      $this->request->param('turn')
    );
    $this->gameObject->setGameOver(
      $this->request->param('game_over'),
      $this->request->param('players_won')
    );
    $this->gameObject->save();
  }

  private function finalizeTurn() {
    if (
      $this->request->param('turn') !== $this->gameObject->getCurrentTurn() ||
      $this->gameObject->isFinalized()
    ) {
      return json_encode(array('error' => 'don\'t finalize twice'));
    }
    $this->gameObject->setFinalized(true);
    $this->gameObject->save();
    return array(
      'player_commands' => $this->gameObject->getPlayerCommands(),
      'turn' => $this->gameObject->getCurrentTurn()
    );
  }

  private function savePlayerCommands() {
    $this->gameObject->setPlayerCommand(
      $this->user->getID(),
      $this->request->param('playerCommands')
    );
    $this->gameObject->save();
  }
  
  private function getPlayerSlotFromRequest() {
    $player_slot = $this->request->param('player_slot');
    if (!(0 <= $player_slot && $player_slot < 4)) {
      throw new Exception("Not a valid slot [" . $player_slot . "]");
    }
    return $player_slot;
  }

  private function updatePreGameState() {
    switch ($this->request->param('slot_action')) {
      case SLOT_ACTIONS['START']:
        if ($this->user->isAdmin()) {
          $this->gameObject->startGame();
          return $this->getGameMetaData();
        }
        throw new Exception("Only an admin can start the game");
      case SLOT_ACTIONS['QUIT']:
        $this->gameObject->removePlayer($this->getPlayerSlotFromRequest(), $this->user);
        return $this->getGameMetaData();
      case SLOT_ACTIONS['JOIN']:
        $this->gameObject->addPlayer($this->getPlayerSlotFromRequest(), $this->user);
        return $this->getGameMetaData();
      case SLOT_ACTIONS['CHANGE_DECK']:
        $this->gameObject->changeDeck(
          $this->getPlayerSlotFromRequest(),
          $this->request->param('deck_id'),
          $this->user
        );
        return $this->getGameMetaData();
      case SLOT_ACTIONS['SET_LEVEL']:
        if ($this->user->isAdmin()) {
          $this->gameObject->getMetadata()->setLevel($this->request->param('level'));
          $this->gameObject->saveMetadata();
          return $this->getGameMetaData();
        }
        throw new Exception("Only an admin can start the game");
      case SLOT_ACTIONS['SET_DIFFICULTY']:
        if ($this->user->isAdmin()) {
          $this->gameObject->getMetadata()->setDifficulty($this->request->param('difficulty'));
          $this->gameObject->saveMetadata();
          return $this->getGameMetaData();
        }
        throw new Exception("Only an admin can start the game");
      default:
        throw new Exception("Unhandled slot action [" . $this->request->param('slot_action') . "]");
        break;
    }
  }
}
