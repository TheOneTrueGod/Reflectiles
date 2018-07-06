<?php

require_once('server/User.php');
class DebugController {
  public static function getURLPath() {
    return '/debug';
  }

  function rrmdir($dir) {
    if (is_dir($dir)) {
      $objects = scandir($dir);
      foreach ($objects as $object) {
        if ($object != "." && $object != "..") {
          if (filetype($dir."/".$object) == "dir")
             rrmdir($dir."/".$object);
          else unlink   ($dir."/".$object);
        }
      }
      reset($objects);
      rmdir($dir);
    }
  }

  function getResponse($request, $user) {
    if (!$user->isAdmin()) {
      return "You're not supposed to be here.";
    }
    $message = null;
    ob_start();
    if ($request->set_level) {
      $level = 0;
      if ($request->level) {
        $level = $request->level;
      }
      $message = "Setting level to " . strval($level) . "<br>";

      for ($i = 0; $i < count(User::$all_users); $i++) {
        $currUser = BouncyUser::getFromID(User::$all_users[$i][0]);
        if ($currUser) {
          $currUser->loadUserData();
          foreach ($currUser->cards as $card) {
            $card->card_experience = $card->getExperienceForLevel($level);
            $card->card_perks = [];
          }
          $currUser->saveAllDecks();
        } else {
          $message .= "Unsuccessful for " . User::$all_users[$i][1] . "<br>";
        }
      }
    } else if ($request->clear_users) {
      $files = glob('saves/users/*'); // get all file names
      foreach($files as $file){ // iterate files
        $this->rrmdir($file); // delete file
      }
      $message = "Cleared All Users";
    } else if ($request->unlock_all_cards) {
      $message = "Unlocking all cards";

      for ($i = 0; $i < count(User::$all_users); $i++) {
        $currUser = BouncyUser::getFromID(User::$all_users[$i][0]);
        if ($currUser) {
          $currUser->loadUserData();
          $currUser->resetCardData(!$request->old_cards);
          $currUser->saveAllDecks();
        } else {
          $message .= "Unsuccessful for " . User::$all_users[$i][1] . "<br>";
        }
      }
    }


    ?>
      <div class="pageBorder">
        <div class="titleArea">
          <div class="backLink">
            <a href="/">Back</a>
          </div>
          <h2>Debug Tools</h2>
          <a href="<?php echo BouncyUserController::getURLPath()?>" class="username">
            <?php echo $user->getUserName(); ?>
          </a>
        </div>
        <div class="container">
          <div class="row">
            <div class="col-12">
              <?php echo $message; ?>
            </div>
          </div>
          <form method="post">
            <div class="row">
              <div class="col-4">
                <input name="set_level" type="submit" value="Set Level of All Cards"/>
              </div>
              <div class="col-8">
                <input name="level" type="number" placeholder="Level"/>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <input name="unlock_all_cards" type="submit" value="Unlock All Cards"/>
                <input name="old_cards" type="checkbox"/>
              </div>
            </div>
            <div class="row"><br></div>
            <div class="row">
              <div class="col-4">
                <input name="clear_users" type="submit" value="Clear all users"/>
              </div>
            </div>
          </form>
        </div>
      </div>
    <?php
    return ob_get_clean();
  }
}
?>
