<?php
require_once('server/GameObject.php');
class NewGameController {
  public static $GAME_TYPE_CARDS_N_MAGIC = "cardsNMagic";
  public static $GAME_TYPE_BOUNCY = "bouncy";
  public static $GAME_TYPE_FMJ = 'fmj';
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
    $gameType = $request->gameType;
    $game_id = DatastoreFactory::getDatastore()->getNewGameID($gameType);
    if ($game_id == null || $gameType == null) { return null; }
    switch ($gameType) {
      case self::$GAME_TYPE_BOUNCY:
        $game_id = $game_id;
        $gameObj = new BouncyGameObject($game_id, "Created Reflectiles Game", 1, [], [], $user->getID());
        break;
      case self::$GAME_TYPE_FMJ:
        $game_id = $game_id;
        $gameObj = new FMJGameObject($game_id, "Created Full Metal Jacket Game", 1, [], [], $user->getID());
        break;
      case self::$GAME_TYPE_CARDS_N_MAGIC:
      default:
        $game_id = $game_id;
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
    echo $linkedFrom;
    if ($linkedFrom) {
      echo "B";
      $linkedGame = GameObject::loadFromFile($linkedFrom);
      echo $linkedGame;
      if (!$linkedGame) {
        echo "No Link";
        throw new Exception("Couldn't find game [". $linkedFrom . "]");
      }
      echo "A Link";
      $gameObj = $this->loadLinkedGame($request, $user, $linkedGame);
      echo $gameObj;
      if (!$gameObj) {
        $gameObj = $this->createNewGame($request, $user);
        if (!$gameObj) {
          throw new Exception("Failed to create a new game");
        }
        $isNextGame = $request->param('nextLevel');
        echo "Next Game";
        echo $isNextGame;
        die();
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
