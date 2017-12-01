<?php
require_once('server/GameObject.php');
require_once('server/GameDeletionController.php');
class GameSelectController {
  public static function getURLPath() {
    return '/games';
  }

  function getResponse($request, $user) {
    $games = DatastoreFactory::getDatastore()->getGameList();
    ob_start(); ?>
      <div class="pageBorder">
        <div class="titleArea">
          <h2> Game Select </h2>
          <div class="username"><?php echo $user->getUserName(); ?></div>
        </div>
        <div class="row titleTableRow">
          <div class="col-2">Game ID</div>
          <div class="col-7">Game Name</div>
          <div class="col-3">Actions</div>
        </div>

        <?php
        if ($user->hasPermission("CREATE_NEW_GAME")) {
          /*echo $this->getCreateGameRow(
            "Create Cards 'n Magic Game'",
            NewGameController::$GAME_TYPE_CARDS_N_MAGIC
          );*/
          echo $this->getCreateGameRow(
            "Create Reflectiles Game",
            NewGameController::$GAME_TYPE_BOUNCY
          );
        }

        foreach ($games as $game) {
          echo $this->getGameRow($user, GameObject::loadFromJSON(
            $game['game_json'],
            $game['metadata']
          ));
        }
        ?>
      </div>
    <?php
    return ob_get_clean();
  }

  function getCreateGameRow($text, $gameType) {
    ob_start(); ?>
    <div class="row tableRow">
      <div class="col-2"></div>
      <div class="col-7">
        <a href="<?php echo NewGameController::getURLPath($gameType); ?>">
          <?php echo $text ?>
        </a>
      </div>
      <div class="col-3">
      </div>
    </div>
    <?php
    return ob_get_clean();
  }

  function getGameRow($user, $game) {
    $game_over = $game->isGameOver();
    $players_won = $game->didPlayersWin();
    ob_start(); ?>
    <div class="row tableRow<?php
      if ($game_over) { echo " game_over"; }
      if ($players_won) { echo " players_won"; }
    ?>">
      <div class="col-2"><?php echo $game->getID(); ?></div>
      <div class="col-7"><?php echo $game->getName(); ?></div>
      <div class="col-3">
      <?php if (!$game_over) { ?>
        <a href="<?php echo GameController::buildURL($game->getID()); ?>">Join</a>
      <?php } ?>
      <?php if ($game_over || $user && $user->isAdmin()) { ?>
        <?php if(!$game_over) { ?>
          |
        <?php } ?>
        <a href="<?php echo GameDeletionController::buildURL($game->getID()); ?>">Delete</a>
      <?php }?>
      </div>
    </div>
    <?php
    return ob_get_clean();
  }
}
?>
