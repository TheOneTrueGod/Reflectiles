<?php

require_once('server/User.php');
class DebugController {
  public static function getURLPath() {
    return '/debug';
  }

  function getResponse($request, $user) {
    $message = null;
    ob_start();
    if ($request->set_level) {
      $level = 0;
      if ($request->level) {
        $level = $request->level;
      }
      $message = "Setting level to " . strval($level) . "<br>";

      for ($i = 0; $i < count(User::$all_users); $i++) {
        $user = BouncyUser::getFromID(User::$all_users[$i][0]);
        if ($user) {
          $user->loadUserData();
          foreach ($user->cards as $card) {
            $card->card_experience = $card->getExperienceForLevel($level);
            $card->card_perks = [];
          }
          $user->saveAllDecks();
        } else {
          $message .= "Unsuccessful for " . User::$all_users[$i][1] . "<br>";
        }
      }
    }


    ?>
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
        </form>
      </div>
    <?php
    return ob_get_clean();
  }
}
?>
