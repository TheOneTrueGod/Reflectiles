<?php
const DECK_ACTIONS = [
  'SAVE_DECKS' => 'save_decks',
  'SAVE_CARD' => 'save_card',
];

class BouncyUserController {
  public static function getURLPath() {
    return "/user/reflectiles/deck";
  }

  function getResponse($request, $user) {
    $bouncy_user = BouncyUser::getFromID($user->id);
    if (!$request->action) {
      ob_start();
      require('Bouncy/server/HTML/DeckManagerHTML.php');
      return ob_get_clean();
    }

    if ($request->action == DECK_ACTIONS['SAVE_DECKS']) {
      $bouncy_user->saveDecksFromClient($request->deck_list);
    } else if ($request->action == DECK_ACTIONS['SAVE_CARD']) {
      $bouncy_user->saveCardFromClient($request->card);
    }
  }
}
 ?>
