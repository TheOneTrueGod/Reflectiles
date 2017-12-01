<?php
class KleinUtils {
  static function addLogicResponder($klein, $loginResponderClass, $responderClass, $requestType='GET', $override='') {
    $responder = new $responderClass();
    $loginResponder = new $loginResponderClass();
    $url_path = $override ?: $responder->getURLPath();
    $klein->respond($requestType, $url_path,
      function ($request) use ($responder, $loginResponder) {
        $user = $loginResponder::getUser($request);
        if (!$user) {
          return $loginResponder->getAsyncResponse($request);
        }
        return $responder->getResponse($request, $user);
      }
    );
  }

  static function addHTMLResponder($klein, $loginResponderClass, $responderClass, $requestType='GET', $override='') {
    $responder = new $responderClass();
    $loginResponder = new $loginResponderClass();
    $url_path = $override ?: $responder->getURLPath();
    $klein->respond($requestType, $url_path,
      function ($request) use ($responder, $loginResponder) {
        $user = $loginResponder::getUser($request);
        if (!$user) {
          return KleinUtils::wrapPageContent($loginResponder->getResponse($request), null);
        }
        return KleinUtils::wrapPageContent($responder->getResponse($request, $user), $user);
      }
    );
  }

  static function wrapPageContent($content, $user) {
    ob_start(); ?>
    <!DOCTYPE html>
    <html>
      <head>
        <!-- Bootstrap core CSS -->
        <link href="../vendor/twbs/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="../style.css" rel="stylesheet" type="text/css">
        <script src="../vendor/jquery/dist/jquery.js"></script>
        <script src="../vendor/js.cookie.js" type="text/javascript"></script>
        <script src="../client/userManagement.js"></script>
<?php if($user) { ?>
        <script>UserManagement.RecieveUserToken("<?php echo $user->getToken(); ?>");</script>
<?php } else { ?>
        <script>UserManagement.GetUserTokenFromCookie();</script>
<?php } ?>

      </head>
      <body>
        <?php echo $content; ?>
      </body>
    </html>
    <?php
    return ob_get_clean();
  }
}
?>
