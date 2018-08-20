<?php
class NewUserController {
  static function requiresNewUserRedirect($request) {
    $user = LoginController::getUser($request);
    $bouncy_user = BouncyUser::getFromID($user->id);
    return $bouncy_user->decks === null || $bouncy_user->decks === [];
  }

  public static function getFromToken($token) {
    for ($i = 0; $i < count(User::$all_users); $i++) {
      $user = User::$all_users[$i];
      if ($user[3] == $token) {
        return new static($user[0], $user[1], $user[2], $user[3]);
      }
    }
    return null;
  }

  function findCardIndex($cards, $cardID) {
    foreach ($cards as $card) {
      if ($card->card_id === $cardID) {
        return $card->card_index;
      }
    }
    throw new Exception("Couldn't find card index " . $cardID);
    return null;
  }

  function initializeWithCards($bouncy_user, $deckName, $cardIDs) {
    $bouncy_user->resetCardData(true);
    $bouncy_user->saveAllCards();
    $bouncy_user->decks = [];
    $bouncy_user->saveAllDecks();

    $deck = json_encode(array_map(function($cardID) use ($bouncy_user) {
      return $this->findCardIndex($bouncy_user->cards, $cardID);
    }, $cardIDs));


    $bouncy_user->decks = array(new PlayerDeck(0, $deckName, $deck));

    $bouncy_user->saveAllDecks();
    header("Location: /");
    die();
  }

  function getResponse($request) {
    $user = LoginController::getUser($request);
    $bouncy_user = BouncyUser::getFromID($user->id);
    if ($request->param("deckWeapons")) {
      $this->initializeWithCards($bouncy_user, "Damage", [1000, 1001, 1002, 1003, 1004]);
    } else if ($request->param("deckDefender")) {
      $this->initializeWithCards($bouncy_user, "Defender", [2000, 2001, 2002, 2006, 2007]);
    } else if ($request->param("deckMagic")) {
      $this->initializeWithCards($bouncy_user, "Magic", [3000, 3001, 3002, 3003, 3004]);
    } else if ($request->param("deckEngineer")) {
      $this->initializeWithCards($bouncy_user, "Engineer", [4000, 4001, 4002, 4003, 4004]);
    }
    ob_start(); ?>
      <link rel="stylesheet" type="text/css" href="newUser.css">
      <div class="pageBorder">
        <div class="titleArea">
          <h2> Choose Your Deck </h2>
        </div>
        <form class="form-select-starting-deck" method="post">
          <div class="deckOption weapon">
            Weapons
            <div class="selectDeckButton">
              <input class="btn btn-lg btn-primary btn-block selectDeckButton" name="deckWeapons" type="submit" value="Choose Me">
            </div>
          </div>
          <div class="deckOption defender">
            Defender
            <div class="selectDeckButton">
              <input class="btn btn-lg btn-primary btn-block selectDeckButton" name="deckDefender" type="submit" value="Choose Me">
            </div>
          </div>
          <div class="deckOption chaos">
            Magic
            <div class="selectDeckButton">
              <input class="btn btn-lg btn-primary btn-block" name="deckMagic" type="submit" value="Choose Me">
            </div>
          </div>
          <div class="deckOption poison">
            Engineer
            <div class="selectDeckButton">
              <input class="btn btn-lg btn-primary btn-block selectDeckButton" name="deckEngineer" type="submit" value="Choose Me">
            </div>
          </div>
        </div>
        <script>UserManagement.CheckForTokenOnLoginPage();</script>
      </div>
    <?php
    return ob_get_clean();
  }

  function getAsyncResponse($request) {
    throw new Exception("You're not logged in");
  }

  public static function getUser($request) {
    if ($request->param("userToken")) {
      $user = User::getFromToken($request->param("userToken"));
      if ($user) { return $user; }
    }
    if ($request->param("username") && $request->param("username")) {
      $user = User::getFromUsernamePassword(
        $request->param("username"),
        $request->param("password")
      );
      if ($user) {
        $_SESSION['user_token'] = $user->getToken();
        return $user;
      }
    }

    if ($_SESSION['user_token']) {
      $user = User::getFromToken($_SESSION['user_token']);
      if ($user) { return $user; }
    }
    return null;
  }
}
