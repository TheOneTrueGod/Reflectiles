<?php
class GameController {
  public static function getURLPath() {
    return "/game/[:id]";
  }

  public static function buildURL($id) {
    return "/game/" . $id;
  }

  function getResponse($request, $user) {
    $game = GameObject::loadFromFile($request->id);
    $controller = $game::getController();
    try {
      $response = $controller->getResponse(
        $request,
        $game,
        $user
      );
      return $response;
    } catch (Exception $e) {
      return json_encode(
        ['error' => true, 'error_message' => $e->getMessage()]
      );
    }
  }
}
