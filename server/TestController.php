<?php
require_once('server/GameObject.php');
class TestController {
  public static function getURLPath() {
    return '/test';
  }
  function getResponse($request, $user) {
    $this->user = $user;
    $is_host = $user->isHost();
    $turn = 1;
    $game_id = 0;

    ob_start(); ?>
    <?php require('Bouncy/BouncyPageHTML.php'); ?>
    <?php require('Bouncy/js_includes.html'); ?>
    <script src="../Bouncy/js/tester.js"></script>
    <?php
    return ob_get_clean();
  }
}
