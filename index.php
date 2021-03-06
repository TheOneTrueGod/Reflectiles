<?php 
session_start();
error_reporting(E_ERROR);
?>
<?php

require_once __DIR__ . '/vendor/autoload.php';
require_once('server/GameSelectController.php');
require_once('server/NewGameController.php');
require_once('server/LoginController.php');
require_once('server/NewUserController.php');
require_once('server/GameController.php');
require_once('server/GameDeletionController.php');
require_once('server/User.php');
require_once('Bouncy/server/Users/BouncyUser.php');
require_once('server/GameLogicController.php');
require_once('Bouncy/server/Users/BouncyUserController.php');
require_once('server/DebugController.php');
require_once('server/KleinUtils.php');
require_once('server/TestController.php');
require_once('server/SignupController.php');
require_once('./testing_utils/TestingUtils.php');

$klein = new \Klein\Klein();

KleinUtils::addHTMLResponder($klein, 'LoginController', 'GameSelectController', 'GET', '/');
KleinUtils::addHTMLResponder($klein, 'LoginController', 'GameSelectController', 'POST', '/');
KleinUtils::addHTMLResponder($klein, 'LoginController', 'TestController', 'GET', '/test');
//KleinUtils::addHTMLResponder($klein, 'LoginController', GameSelectController);
KleinUtils::addHTMLResponder($klein, 'LoginController', 'NewGameController', 'GET');
KleinUtils::addHTMLResponder($klein, 'LoginController', 'GameController', 'GET');
KleinUtils::addHTMLResponder($klein, 'LoginController', 'GameController', 'POST');
KleinUtils::addLogicResponder($klein, 'LoginController', 'GameLogicController');
KleinUtils::addLogicResponder($klein, 'LoginController', 'GameLogicController', 'POST');
KleinUtils::addHTMLResponder($klein, 'LoginController', 'GameDeletionController', 'GET');
KleinUtils::addHTMLResponder($klein, 'LoginController', 'GameDeletionController', 'POST');
KleinUtils::addHTMLResponder($klein, 'LoginController', 'BouncyUserController', 'GET');
KleinUtils::addLogicResponder($klein, 'LoginController', 'BouncyUserController', 'POST');
KleinUtils::addHTMLResponder($klein, 'LoginController', 'DebugController', 'GET');
KleinUtils::addHTMLResponder($klein, 'LoginController', 'DebugController', 'POST');
// Signup
KleinUtils::addHTMLResponder($klein, 'SignupController', 'SignupController', 'GET');
KleinUtils::addHTMLResponder($klein, 'SignupController', 'SignupController', 'POST');

$klein->respond('GET', '/logout', function($request, $response) {
  $_SESSION['user_token'] = null;
  $_SESSION['user_id'] = null;
  $response->redirect("/");
});

$klein->onHttpError(function ($code, $router) {
  switch ($code) {
    case 404:
      $router->response()->body('Y U so lost?!');
      break;
    case 405:
      $router->response()->body('You can\'t do that!');
      break;
    default:
      $router->response()->body(
          'Oh no, a bad error happened that caused a '. $code
      );
  }
});

$klein->dispatch();
?>

<?php /*
********* Art Asset Credits *********
Poison Explosion - https://o-fiveasone-o.deviantart.com/art/Poison-Explosion-354590620
*/ ?>
