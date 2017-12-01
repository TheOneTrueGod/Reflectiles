<?php
class LoginController {
  function getResponse($request) {
    $games = DatastoreFactory::getDatastore()->getGameList();
    ob_start(); ?>
      <link rel="stylesheet" type="text/css" href="login.css">
      <div class="pageBorder">
        <div class="titleArea">
          <h2> Sign In </h2>
        </div>
        <form class="form-login" method="post">
          <label for="inputUsername" class="sr-only">Username</label>
          <input name="username" type="username" id="inputUsername" class="form-control" placeholder="Username" required="" autofocus="">
          <label for="inputPassword" class="sr-only">Password</label>
          <input name="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required="">
          <button class="btn btn-lg btn-primary btn-block signInButton" type="submit">Sign in</button>
        </div>
        <script>UserManagement.CheckForTokenOnLoginPage();</script>
      </div>
    <?php
    return ob_get_clean();
  }

  function getAsyncResponse($request) {
    throw new Exception("You're not logged in");
  }

  public static function getUser($request) {
    if ($request->param("userToken")) {
      $user = User::getFromToken($request->param("userToken"));
      if ($user) { return $user; }
    }
    if ($request->param("username") && $request->param("username")) {
      $user = User::getFromUsernamePassword(
        $request->param("username"),
        $request->param("password")
      );
      if ($user) {
        $_SESSION['user_token'] = $user->getToken();
        return $user;
      }
    }

    if ($_SESSION['user_token']) {
      $user = User::getFromToken($_SESSION['user_token']);
      if ($user) { return $user; }
    }
    return null;
  }
}
