<?php
class BouncyUserController {
  public static function getURLPath() {
    return "/user/reflectiles/deck";
  }

  function getResponse($request, $user) {
    $bouncy_user = BouncyUser::getFromID($user->id);
    ob_start();
    require('Bouncy/server/HTML/CardPageHTML.php');
    return ob_get_clean();
  }
}
 ?>
