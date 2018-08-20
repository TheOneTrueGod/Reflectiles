<?php
require_once('server/GameObject.php');
class NewGameController {
  public static $GAME_TYPE_CARDS_N_MAGIC = "cardsNMagic";
  public static $GAME_TYPE_BOUNCY = "bouncy";
  public static function getURLPath(
    $gameType = null,
    $prevGameID = null,
    $nextLevel = false
  ) {
    $toRet = '/new_game';
    if (!$gameType) {
      $toRet .= '/[:gameType]';
    } else {
      $toRet .= "/" . $gameType;
    }

    if ($prevGameID !== null) {
      $toRet .= "?linkedFrom=" . $prevGameID;
      $toRet .= "&nextLevel=" . ($nextLevel ? 'true' : 'false');
    }

    return $toRet;
  }

  public function createNewGame($request, $user) {
    if (!$user->hasPermission("CREATE_NEW_GAME")) {
      throw new Exception("You don't have permission to do that");
    }
    $game_id = DatastoreFactory::getDatastore()->getNewGameID();
    $gameType = $request->gameType;
    if ($game_id == null || $gameType == null) { return null; }
    switch ($gameType) {
      case self::$GAME_TYPE_BOUNCY:
        $gameObj = new BouncyGameObject($game_id, "Created Reflectiles Game", 1, [], [], $user->getID());
        break;
      case self::$GAME_TYPE_CARDS_N_MAGIC:
      default:
        $gameObj = new CardsNMagicGameObject($game_id, "Created Cards n Magic Game", 1, [], []);
        break;
    }

    $gameObj->createInitialMetadata();
    $gameObj->save();
    $gameObj->savePlayerData();
    return $gameObj;
  }

  function loadLinkedGame($request, $user, $prevLinkedGameObj) {
    $isNextGame = $request->param('nextLevel');
    $linkedGameID = null;
    if ($isNextGame === "true") {
      $linkedGameID = $prevLinkedGameObj->getMetadata()->getNextGame();
    } else {
      $linkedGameID = $prevLinkedGameObj->getMetadata()->getRetryGame();
    }

    if ($linkedGameID === null) {
      return null;
    }

    return GameObject::loadFromFile($linkedGameID);
  }

  function incrementLevel($level) {
    $level_exploded = explode("-", $level);
    $world = $level_exploded[0];
    $stage = $level_exploded[1];
    if ($stage === "boss") {
      $stage = "1";
      $world = (string)(((int)$world) + 1);
    } else if ($stage === "3") {
      $stage = "boss";
    } else {
      $stage = (string)(((int)$stage) + 1);
    }
    return $world . "-" . $stage;
  }

  function getResponse($request, $user) {
    $linkedFrom = $request->param('linkedFrom');
    if ($linkedFrom) {
      $linkedGame = GameObject::loadFromFile($linkedFrom);
      if (!$linkedGame) {
        throw new Exception("Couldn't find game [". $linkedFrom . "]");
      }
      $gameObj = $this->loadLinkedGame($request, $user, $linkedGame);
      if (!$gameObj) {
        $gameObj = $this->createNewGame($request, $user);
        if (!$gameObj) {
          throw new Exception("Failed to create a new game");
        }
        $isNextGame = $request->param('nextLevel');
        if ($isNextGame === "true") {
          $linkedGame->getMetadata()->setNextGame($gameObj->getID());
          $gameObj->getMetadata()->setLevel(
            $this->incrementLevel($linkedGame->getMetadata()->getLevel())
          );
        } else {
          $linkedGame->getMetadata()->setRetryGame($gameObj->getID());
          $gameObj->getMetadata()->setLevel($linkedGame->getMetadata()->getLevel());
        }

        $gameObj->getMetadata()->setDifficulty($linkedGame->getMetadata()->getDifficulty());
        $gameObj->saveMetadata();

        $linkedGame->saveMetadata();
      }
    } else {
      $gameObj = $this->createNewGame($request, $user);
    }
    if (!$gameObj) {
      throw new Exception("Too Many Games Created");
      return;
    }
    header("Location: " . GameController::buildURL($gameObj->getID()));
    die();
  }
}
