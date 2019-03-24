<link rel="stylesheet" type="text/css" href="../Bouncy/style/style.css">
<link rel="stylesheet" type="text/css" href="../Bouncy/style/deckbuilderstyle.css">
<link rel="stylesheet" type="text/css" href="../Bouncy/style/unitTooltips.css">
<div class="pageBorder">
  <div class="titleArea">
    <div class="backLink"><a href="/">&lt; Back</a></div>
    <h2> Reflectiles </h2>
    <a href="<?php echo BouncyUserController::getURLPath()?>" class="username">
      <?php echo $user->getUserName(); ?>
    </a>
  </div>
  <div id="gameContainer"
    class="<?php echo $is_host ? 'isHost': ''; ?>"
    host="<?php echo $is_host ? 'true' : 'false'; ?>"
    playerID="<?php echo $this->user->getID(); ?>"
  >
    <div
      id="loadingContainer"
      class="screen"
    >
      <div class="loadingScreen">
        Loading
      </div>
    </div>
    <div
      id="gameBoard"
      class="screen"
      style="display: none;"
      data-gameID="<?php echo $game_id ?>"
    >
      <div id="inMissionScreen">
        <div id="missionControlsActionBox">
          <div id="missionActionDisplay">
            <div id="errorBox"></div>
            <div id="hintBox"></div>
            <div id="warningMessageBox" class="noselect" style="display: none;"></div>
            <div id="gameOverBox" class="noselect" style="display: none;">
              <div id="title"></div>
              <div id="stats"></div>
              <div id="controls">
                <a href="<?php
                  echo NewGameController::getURLPath(
                    NewGameController::$GAME_TYPE_FMJ,
                    $game_id,
                    false
                  );
                ?>" class="retryButton button green small">Retry</a>
                <a href="<?php
                  echo NewGameController::getURLPath(
                    NewGameController::$GAME_TYPE_FMJ,
                    $game_id,
                    true
                  );
                ?>" class="nextLevelButton button green small">Next Level</a>
              </div>
            </div>
            <div class="overlay"></div>
          </div>
          <div id="missionControlsDisplay">
            <div class="playerStatusContainer"></div>
            <div class="unitDetailsContainer"></div>
            <div class="endTurnContainer">
              <button id="missionEndTurnButton">Finish Turn</button>
            </div>
          </div>
        </div>
        <div class="turnControls">
          <div class="timeline"><div class="timeline_progress"></div></div>
          <div class="healthbar_container">
            <div class="healthbar_progress"></div>
            <div class="healthbar_text"></div>
          </div>
        </div>
        <div id="missionProgramDisplay"></div>
      </div>
    </div>
  </div>
</div>
