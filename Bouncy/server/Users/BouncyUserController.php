<?php
const DECK_ACTIONS = [
  'SAVE_DECKS' => 'save_decks',
];

class BouncyUserController {
  public static function getURLPath() {
    return "/user/reflectiles/deck";
  }

  function getResponse($request, $user) {
    $bouncy_user = BouncyUser::getFromID($user->id);
    if (!$request->action) {
      ob_start();
      require('Bouncy/server/HTML/CardPageHTML.php');
      return ob_get_clean();
    }

    if ($request->action == DECK_ACTIONS['SAVE_DECKS']) {
      // Continue from here
      $bouncy_user->saveDecksFromClient($request->deck_list);
    }
  }
}
 ?>
