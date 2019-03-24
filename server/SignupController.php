<?php
require_once('server/NewUserController.php');

class SignupController {
  public static function getURLPath() {
    return '/create-account';
  }

  public static function buildURL() {
    return "/create-account";
  }

  public static function getUser($request) {
    return null;
  }

  function tryToCreateUser($username, $password_raw) {
    if (DatastoreFactory::getDatastore()->doesUserExist($username)) {
      return "User already exists";
    }

    DatastoreFactory::getDatastore()->createUser($username, $password_raw);
    $user = User::getFromID($username);
    $_SESSION['user_token'] = $user->getToken();
    $_SESSION['user_id'] = $user->getID();
    header("location: /");
    die();
  }

  function getResponse($request) {
    $username = $request->param("username");
    $password = $request->param("password");
    $confirmpassword = $request->param("confirmpassword");
    $error = "";

    if ($username && $password === $confirmpassword) {
      $error = $this->tryToCreateUser($username, $password);
      if (!$error) {
        $error = "Success! (TODO: Redirect)";
      }
    } else if ($username && $password !== $confirmpassword) {
      $error = "Password and Password Confirmation must match";
    }

    ob_start(); ?>
      <link rel="stylesheet" type="text/css" href="login.css">
      <div class="pageBorder">
        <div class="titleArea">
          <h2> Create Account </h2>
        </div>
        <form class="form-login" method="post">
          <label for="inputUsername" class="sr-only">Username</label>
          <input name="username" type="username" id="inputUsername" class="form-control" placeholder="Username" required autofocus="" value="<? echo $username; ?>">
          <label for="inputPassword" class="sr-only">Password</label>
          <input name="password" type="password" id="inputPassword" class="form-control" placeholder="Password" required>
          <label for="inputPasswordConfirm" class="sr-only">Confirm Password</label>
          <input name="confirmpassword" type="password" id="inputPasswordConfirm" class="form-control" placeholder="Confirm Password" required>
          <button class="btn btn-lg btn-primary btn-block signInButton" type="submit">Create Account</button>
          <div class="error"><? echo $error; ?></div>
        </div>
        <script>UserManagement.CheckForTokenOnLoginPage();</script>
      </div>
    <?php
    return ob_get_clean();
  }
}
