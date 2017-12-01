<?php
class GameDeletionController {
  public static function getURLPath() {
    return '/delete/[:id]';
  }

  public static function buildURL($id) {
    return "/delete/" . $id;
  }

  function getResponse($request, $user) {
    if (!$user->hasPermission("DELETE_GAME")) {
      throw new Exception("You don't have permission to do that");
    }

    $game = GameObject::loadFromFile($request->id);
    if (!$game->isGameOver() && !$user->isAdmin()) {
      throw new Exception("Don't delete a game in progress");
    }

    $game->delete();
    header("Location: /");
    die();
  }
}
