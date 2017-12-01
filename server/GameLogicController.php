<?php
class GameLogicController {
  public static function getURLPath() {
    return "/gamelogic/[:id]";
  }

  public static function buildURL($id) {
    return "/gamelogic/" . $id;
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

      return json_encode(
        [
          'success' => true,
          'response' => $response,
        ]
      );
    } catch (Exception $e) {
      return json_encode(
        ['error' => true, 'error_message' => $e->getMessage()]
      );
    }
  }
}
