<?php
require_once('server/GameObject.php');
class TestController {
  public static function getURLPath() {
    return '/test';
  }
  function getResponse($request, $user) {
    $this->user = $user;
    $is_host = true;
    $turn = 1;
    $game_id = 0;
    $bouncy_user = BouncyUser::getFromID($user->id);

    ob_start(); ?>
    <?php require('Bouncy/BouncyPageHTML.php'); ?>
    <?php require_once('Bouncy/js_includes.php'); ?>
    <script type="module" src="../Bouncy/js/tester.js"></script>
    <?php
    return ob_get_clean();
  }
}
