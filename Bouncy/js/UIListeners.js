import { PlayerInput } from "./PlayerInput.js";

class UIListenersClass {
  contructor() {
    this.otherDecks = [];
    this.deliberatelyQuit = false;
    this.drawPile = null;
    this.discardPile = null;
    this.lostCardsPile = null;
    this.inactionTimer = null;
    this.inactionTimerFadingIn = false;
    this.currScreen = null;
    this.setupFinished = false;
  }

  createPlayerStatus(players) {
    for (var key in players) {
      var player = players[key];
      var playerControls =
        "<div " +
          "class='playerStatus " + player.getUserID() + "'" +
          "player-index=" + player.player_index +
        ">" +
        "<div class='statusIndicator'></div>" +
        "<div class='playerName noselect'>" + player.getUserName() + "</div>" +
        "</div>";
      $('#missionControlsDisplay .playerStatusContainer').append(playerControls);
    }
  }

  updatePlayerStatus(boardState, players) {
    var turnOrder = boardState.getTurnOrder(players);
    for (var i = 0; i < turnOrder.length; i++) {
      var status = $('.playerStatus[player-index=' + turnOrder[i] + ']');
      //status.remove();
      $('#missionControlsDisplay .playerStatusContainer').append(status);
      //$("#container .row:first").remove().insertAfter($("#container .row:last));
      /*while (status.next()) {
        status.insertAfter(status.next());
      }*/
      /*var parent = status.parent();
      parent.removeChild(status);
      parent.append(status);*/
    }

    var playerID = $('#gameContainer').attr('playerid');
    for (i = 0; i < players.length; i++) {
      if (players[i].user_id === playerID) {
        this.updateDeckAndDiscardTooltips(players[i]);
      }
    }
  }

  getTooltipListingCards(player, cardList, title) {
    let tooltip = $("<div>", {"class": "tooltip"});
    tooltip.append(
      $("<div class='cardTooltipName'>" + title + "</div>", {"class": "tooltipName"})
    );
    for (let i = 0; i < cardList.length; i++) {
      let ability = player.abilityDeck.abilities[cardList[i]];
      let cooldownNumber = Math.ceil(ability.getCooldownNumber());
      tooltip.append(
        $("<div class='cardTooltipDescription'>" + (cooldownNumber > 0 ? "[" + cooldownNumber + "] " : '') + ability.getName() + "</div>", {"class": "tooltipText"})
      );
    }
    return tooltip;
  }

  updateDeckAndDiscardTooltips(player) {
    let tooltip = this.getTooltipListingCards(player, player.deck, "Deck");

    this.drawPile.attr("data-toggle", "tooltip");
    this.drawPile.attr("title", tooltip.html());
    this.drawPile.tooltip({
      constraints: [{'to':'scrollParent','pin':true}],
      html: true
    });

    tooltip = this.getTooltipListingCards(player, player.discard, "Discard");
    this.discardPile.attr("data-toggle", "tooltip");
    this.discardPile.attr("title", tooltip.html());
    this.discardPile.tooltip({
      constraints: [{'to':'scrollParent','pin':true}],
      html: true
    });

    tooltip = this.getTooltipListingCards(player, player.lostCards, "Lost");
    this.lostCardsPile.attr("data-toggle", "tooltip");
    this.lostCardsPile.attr("title", tooltip.html());
    this.lostCardsPile.tooltip({
      constraints: [{'to':'scrollParent','pin':true}],
      html: true
    });
  }

  createAbilityDisplay(players) {
    $('#missionProgramDisplay').empty().append(
      $("<div>", {"class": "missionProgramDisplayLockOverlay"})
    );

    var playerID = $('#gameContainer').attr('playerid');
    var player;
    for (var key in players) {
      if (players[key].getUserID() === playerID) {
        player = players[key];
      }
    }
    if (!player) {
      throw new Error("PlayerID [" + playerID + "] not in Players");
    }

    var $div; var $ability;

    var abilities = player.getHand();
    for (var i = 0; i < abilities.length; i++) {
      $div = $("<div>", {"class": "abilityContainer"});
      $div.append(AbilityCardBuilder.createStandardAbilityCard(abilities[i]));
      $('#missionProgramDisplay').append($div);
      abilities[i].chargeUpdated();
    }

    $div = $("<div>", {"class": "abilityContainer standardAbilityContainer"});
    $div.append(this.getCancelAbilityHTML());
    $div.append(this.getMoveAbilityHTML());
    $('#missionProgramDisplay').append($div);

    let $deckStatusDiv = $("<div>", {class: "deckStatusContainer"});
    this.drawPile = $("<img>", {class: "drawPile", "src": "../Bouncy/assets/icons/card-draw.png"});
    $deckStatusDiv.append(this.drawPile);

    this.discardPile = $("<img>", {class: "discardPile", "src": "../Bouncy/assets/icons/card-burn.png"});
    $deckStatusDiv.append(this.discardPile);

    this.lostCardsPile = $("<img>", {class: "lostCardsPile", "src": "../Bouncy/assets/icons/card-discard.png"});
    $deckStatusDiv.append(this.lostCardsPile);

    $('#missionProgramDisplay').append($deckStatusDiv);
  }

  getCancelAbilityHTML() {
    return this.createStandardAbilityHTML(
      "pass",
      "icon_cancel",
      "Pass",
      "Take no action"
    );
  }

  getMoveAbilityHTML() {
    return this.createStandardAbilityHTML(
      StaticPlayerAbilities.abilities.PLAYER_MOVE.index,
      "icon_walk",
      "Move",
      "Move to a new location"
    );
  }

  createStandardAbilityHTML(
    abilityID,
    icon,
    name,
    tooltipText,
    disabled
  ) {
    let card = $("<div>",
      {"class": "abilityCard halfSize" + (disabled ? " disabled" : ""), "ability-id": abilityID}
    ).append($("<div>", {"class": "abilityCardIcon"})
      .append($("<img>", {"src": "../Bouncy/assets/icons/" + icon + ".png"}))
    );

    let tooltip = $("<div>", {"class": "tooltip"});
    tooltip.append(
      $("<div class='cardTooltipName'>" + name + "</div>", {"class": "tooltipName"})
    );

    tooltip.append(
      $("<div class='cardTooltipDescription'>" + tooltipText + "</div>", {"class": "tooltipText"})
    );

    card.attr("data-toggle", "tooltip");
    card.attr("title", tooltip.html());
    card.tooltip({
      constraints: [{'to':'scrollParent','pin':true}],
      html: true
    });
    return card;
  }

  refreshAbilityDisplay() {
    let player;
    let players = MainGame.players;
    var playerID = $('#gameContainer').attr('playerid');
    for (var key in players) {
      if (players[key].getUserID() === playerID) {
        player = players[key];
      }
    }
    if (!player) {
      throw new Error("PlayerID [" + playerID + "] not in Players");
    }

    var abilities = player.getHand();
    for (var i = 0; i < abilities.length; i++) {
      abilities[i].chargeUpdated();
    }
  }

  updateActionHint(newText) {
    if (!newText) {
      $('#hintBox').addClass("noText");
    } else {
      $('#hintBox').removeClass("noText");
    }
    $('#hintBox').text(newText);
  }

  setupUIListeners(boardState) {
    $('#missionEndTurnButton').on('click', function() {
      MainGame.setPlayerCommand(
        new PlayerCommandSpecial(
          PlayerCommandSpecial.SPECIAL_COMMANDS.END_TURN
        )
      );
      MainGame.playerCommands[$('#gameContainer').attr('playerID')].updateValidTargetChecks();
      $('#missionEndTurnButton').removeClass("flashing");
      //PlayerInput.setSelectedAbility("pass");
      //TurnControls.setPlayState(false);
      //MainGame.finalizeTurn();
    });

    var self = this;

    $('#missionProgramDisplay').on(
      'click',
      '.abilityCard',
      function() {
        // Deselect currently selected abilities
        PlayerInput.setSelectedAbility($(this).attr("ability-id"));
        self.updateSelectedAbility();
      }
    );

    $('#missionActionDisplay').on('click', 'canvas', function(event) {
      PlayerInput.handleClick(this, event);
    });

    $('#missionActionDisplay').on('mousemove', 'canvas', function(event) {
      PlayerInput.handleMouseMotion(event);
    });

    $('#missionActionDisplay').on('contextmenu', 'canvas', function(event) {
      PlayerInput.handleClick(this, event);
      event.preventDefault();
      return false;
    });

    this.invokeHintBoxTimeout();
    var windowMoveCallback = () => {
      if (this.inactionTimerFadingIn) {
        $("#hintBox").stop().fadeOut();
        this.inactionTimerFadingIn = false;
      }

      window.clearTimeout(this.inactionTimer);
      this.invokeHintBoxTimeout();
    };

    $(window).on('mousemove', windowMoveCallback);
    this.setupFinished = true;
    
    this.resetSpawnPreview(boardState);
  }

  resetHintBox() {
    $("#hintBox").stop().fadeOut(0);
    window.clearTimeout(this.inactionTimer);
    this.invokeHintBoxTimeout();
  }

  invokeHintBoxTimeout() {
    this.inactionTimer = window.setTimeout(() => {
      $("#hintBox").fadeIn(2000);
      this.inactionTimerFadingIn = true;
    }, 2000);
  }

  resetHintTimer() {
    this.inactionTimer = window.setTimeout(() => {
      $("#hintBox").fadeIn(2000);
      this.inactionTimerFadingIn = true;
    }, 2000);
  }

  updateSelectedAbility() {
    $('.abilityCard.selected').removeClass('selected');
    if (PlayerInput.getSelectedAbility()) {
      $('.abilityCard[ability-id=' + PlayerInput.getSelectedAbility() + ']')
        .addClass("selected");
    }
  }

  updatePlayerCommands(player_commands, players) {
    $('.playerStatus .statusIndicator').removeClass('ready').removeClass("noicon").removeClass("hasicon");
    $('.playerStatus').css('background-image', 'none').removeClass("ready").removeClass("notready");
    let currPlayer = $('#gameContainer').attr('playerid');
    if (
      player_commands[currPlayer] &&
      player_commands[currPlayer].hasMajor() &&
      !player_commands[currPlayer].isDoneTurn()
    ) {
      $('#missionEndTurnButton').addClass("flashing")
    } else {
      $('#missionEndTurnButton').removeClass("flashing");
    }
    for (var key in players) {
      var player = players[key];
      let doneTurn = false;
      let $playerStatus = $('.playerStatus.' + player.getUserID());
      if (player_commands[player.getUserID()] !== undefined) {
        let $statusIndicator = $('.playerStatus.' + player.getUserID() + ' .statusIndicator');

        let majorAction = player_commands[player.getUserID()].getMajorAction();
        if (player_commands[player.getUserID()].isDoneTurn()) {
          if (!majorAction) {
            $statusIndicator.addClass('noicon');
          }
          $statusIndicator.addClass('ready');
          doneTurn = true;
        }

        if (majorAction) {
          let iconURL = AbilityCardBuilder.getIconURL(majorAction.abilityDef);
          $playerStatus.css('background-image', "url(" + iconURL + ")");
          $statusIndicator.addClass("hasicon");
        }
      }
      if (!doneTurn) {
        $playerStatus.addClass("notready");
      }
    }
  }

  updateTeamHealth(currHealth, maxHealth) {
    let healthPct = currHealth / maxHealth;
    var pct = healthPct * 100;
    $('.healthbar_progress').css('width', pct + '%');
    $('.healthbar_text').text(currHealth);
  }

  showGameOverScreen(playersWon, gameStats) {
    $('#gameContainer').addClass("gameOver");
    if (playersWon) {
      $('#gameOverBox #title').text("A winner is you!");
    } else {
      $('#gameOverBox #title').text("Game Over");
    }

    $('#gameOverBox #stats').empty().append(
      $('<div/>', {class: 'row statRow'}).append(
        $('<div/>', {class: 'statHeaderName', text: 'Player'})
      ).append(
        $('<div/>', {class: 'statHeaderDeck', text: 'Deck'})
      ).append(
        $('<div/>', {class: 'statHeaderDamage', text: 'Damage'})
      )
    );

    for (let player of MainGame.players) {
      if (!gameStats.playerDamage[player.user_id]) {
        $('#gameOverBox #stats').append(
          this.createStatRow(player.user_name, player.abilityDeck.name, '0')
        );
      } else {
        let name = player.user_name;
        let deckName = player.abilityDeck.name;
        let damageSum = 0;
        let tooltip = $("<div/>");
        tooltip.append(
          $("<div/>", {class: "row statTooltip statTooltipTitle"})
          .append(
            $("<div/>", {class: "statTooltipAbilityName"}).text('Name')
          ).append(
            $("<div/>", {class: "statTooltipAbilityUses"}).text('Uses')
          ).append(
            $("<div/>", {class: "statTooltipDamage"}).text('Damage')
          ).append(
            $("<div/>", {class: "statTooltipDamagePerUse"}).text('Dmg/Use')
          )
        );
        for (let abilityIndex in gameStats.playerDamage[player.user_id]) {
          let damage = Math.floor(gameStats.playerDamage[player.user_id][abilityIndex].damage);
          let numUses = gameStats.playerDamage[player.user_id][abilityIndex].uses;
          damageSum += damage;
          let abilDef = AbilityDef.abilityDefList[abilityIndex];
          let abilName = null;
          if (abilDef) {
            abilName = abilDef.rawDef.name;
          }

          let damagePerUse = Math.floor(damage / (numUses ? numUses : 1));

          tooltip.append(
            $("<div/>", {class: "row statTooltip"})
            .append(
              $("<div/>", {class: "statTooltipAbilityName"}).text(abilName ? abilName : '-')
            ).append(
              $("<div/>", {class: "statTooltipAbilityUses"}).text(numUses ? numUses : '0')
            ).append(
              $("<div/>", {class: "statTooltipDamage"}).text(damage)
            ).append(
              $("<div/>", {class: "statTooltipDamagePerUse"}).text(damagePerUse)
            )
          );
        }
        let statRow = this.createStatRow(name, deckName, damageSum);
        statRow.attr("data-toggle", "tooltip");
        statRow.attr("title", tooltip.html());
        statRow.tooltip({
          constraints: [{'to':'scrollParent','pin':true}],
          template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner large"></div></div>',
          placement: 'bottom',
          html: true
        });
        $('#gameOverBox #stats').append(statRow);
      }
    }

    if ('unknown' in gameStats.playerDamage) {
      $('#gameOverBox #stats').append(
        this.createStatRow('Unknown', null, gameStats.playerDamage['unknown'])
      );
    }

    if ('enemy' in gameStats.playerDamage) {
      $('#gameOverBox #stats').append(
        this.createStatRow('Enemy', null, gameStats.playerDamage['enemy'])
      );
    }

    $('#gameOverBox').show();
  }

  createStatRow(playerName, playerDeck, playerDamage) {
    return $('<div/>', {class: 'row statRow'}).append(
      $('<div/>', {class: 'playerName', text: playerName})
    ).append(
      $('<div/>', {class: 'playerDeck', text: playerDeck})
    ).append(
      $('<div/>', {class: 'playerDamage', text: playerDamage})
    )
  }

  updateGameProgress(progressPct) {
    var pct = progressPct * 100;
    $('.timeline_progress').css('width', pct + '%');
  }

  resetSpawnPreview(boardState) {
    if (!this.setupFinished) { return; }
    $('#missionNextWavePreview').empty();
    for (let col = 0; col < boardState.sectors.columns; col++) {
      $('#missionNextWavePreview').append($('<div/>', { class: 'previewColumn', text: col, width: Unit.UNIT_SIZE }));
    }
    this.updateSpawnPreview(boardState);
  }

  hideSpawnPreview() {
    //$('#missionNextWavePreview')
  }

  showSpawnPreview() {

  }

  updateSpawnPreview(boardState) {
    boardState.storeRandomSeeds();
    const { spawnLocation, formation } = AIDirector.getFormationAndSpawnPointForTurn(boardState);
    if (!formation || formation instanceof SkipSpawnFormation) {
      $('#missionNextWavePreview').children().text(!formation ? '' : '-');
      return;
    }
    const spawnList = formation.getSpawnList();
    for (let x = 0; x < boardState.sectors.columns; x++) {
      let spawnCount = 0;
      if (x >= spawnLocation.x) {
        const spawnX = x - spawnLocation.x;
        for (let y = 0; y < spawnList.length; y++) {
          if (spawnX < spawnList[y].length && spawnList[y][spawnX] !== null) {
            spawnCount += 1;
          }
        }
      }
      $('#missionNextWavePreview').children(':nth-child(' + (x + 1) + ')').text(spawnCount);
    }
    boardState.recoverRandomSeeds();
  }

  updateGameSetupScreen(players, difficulty, level) {
    var loggedInPlayerID = $('#gameContainer').attr('playerID');
    this.showCurrentScreen();
    $("#playerSetupBoard .noPlayerSection").hide();
    $("#playerSetupBoard .playerSection").hide();
    $('.levelSelect .level.selected').removeClass('selected');
    $('.levelSelect .level[data-level="' + level + '"]').addClass("selected");
    $('.difficultySelect .button.selected').removeClass('selected');
    $('.difficultySelect .button[data-difficulty="' + difficulty + '"]').addClass("selected");

    $('.levelSelect .level').each((index, item) => {
      let level = $(item).data('level');
      if (LevelDefs.isLevelAvailable(level)) {
        $(item).removeClass("disabled");
      } else {
        $(item).addClass("disabled");
      }
    });

    for (var i = 0; i < 4; i++) {
      var player = players[i];
      var $section = $("#playerSetupBoard .playerSetupSection[data-playerIndex=" + i + "]");
      if (player) {
        $section.addClass("hasPlayer").removeClass('noPlayer');
        $section.find(".playerSection").show();
        $section.find(".playerNameDisplay").text(player.getUserName());
        $section.find(".startButton").hide();
        $section.find(".abilityDeckName").off();
        if (player.getUserID() == loggedInPlayerID) {
          $section.find(".quitButton").show();
          if (i === 0) {
            $section.find(".startButton").show();
          }
          $section.find(".abilityDeckName")
            .on("click", this.switchDeckClick.bind(this, i, player))
            .text(player.getAbilityDeckName());
        } else {
          $section.find(".quitButton").hide();
          $section.find(".abilityDeckName").text(player.getAbilityDeckName());
        }
      } else {
        $section.removeClass("hasPlayer").addClass("noPlayer");
        $section.find(".noPlayerSection").show();
      }
    }

    var alreadyInGame = false;
    for (i = 0; i < 4; i++) {
      if (players[i] && players[i].getUserID() == loggedInPlayerID) {
        alreadyInGame = true;
      }
    }

    if (alreadyInGame) {
      $(".joinGameButton").hide();
    } else if (!this.deliberatelyQuit) {
      $(".joinGameButton").show();
      $(".noPlayer .joinGameButton").first().click();
    }
  }

  startClick(playerID, event) {
    var $section = $("#playerSetupBoard [data-playerIndex=" + playerID + "]");
    $section.find(".startButton").hide();
    $section.find(".quitButton").hide();
    ServerCalls.UpdatePreGameState(
      playerID,
      ServerCalls.SLOT_ACTIONS.START,
      GameInitializer.handleMetaDataLoaded.bind(GameInitializer, false),
      GameInitializer
    );
  }

  quitClick(playerID, event) {
    this.deliberatelyQuit = true;
    var $section = $("#playerSetupBoard [data-playerIndex=" + playerID + "]");
    $(".joinGameButton").show();
    $section.find(".startButton").hide();
    $section.find(".quitButton").hide();
    ServerCalls.UpdatePreGameState(
      playerID,
      ServerCalls.SLOT_ACTIONS.QUIT,
      GameInitializer.handleMetaDataLoaded.bind(GameInitializer, false),
      GameInitializer
    );
  }

  joinGameClick(playerID, event) {
    this.deliberatelyQuit = false;
    $(".joinGameButton").hide();
    ServerCalls.UpdatePreGameState(
      playerID,
      ServerCalls.SLOT_ACTIONS.JOIN,
      GameInitializer.handleMetaDataLoaded.bind(GameInitializer, false),
      GameInitializer
    );
  }

  setOtherDecks(otherDeckData) {
    this.otherDecks = [];
    for (var deck in otherDeckData) {
      this.otherDecks.push(new PlayerDeck(otherDeckData[deck]));
    }
  }

  switchDeckClick(player_slot, player, event) {
    this.showDeckEditorBoard();
    /*var currDeckID = player.getAbilityDeckID();
    var nextDeckIndex = -1;
    for (var i = 0; i < this.otherDecks.length; i++) {
      if (this.otherDecks[i].getID() == currDeckID) {
        nextDeckIndex = (i + 1) % this.otherDecks.length;
      }
    }

    if (nextDeckIndex == -1) { throw new Exception("couldn't find current deck in deck list"); }

    ServerCalls.UpdatePreGameState(
      player_slot,
      ServerCalls.SLOT_ACTIONS.CHANGE_DECK,
      GameInitializer.handleMetaDataLoaded.bind(GameInitializer, false),
      GameInitializer,
      this.otherDecks[nextDeckIndex].getID()
    );*/
  }

  setupPlayerInitListeners() {
    for (var i = 0; i < 4; i++) {
      var playerID = i;
      var $section = $("#playerSetupBoard [data-playerIndex=" + playerID + "]");
      $section.find(".startButton").on("click", this.startClick.bind(this, playerID));
      $section.find(".quitButton").on("click", this.quitClick.bind(this, playerID));
      $section.find(".joinGameButton").on("click", this.joinGameClick.bind(this, playerID));
    }

    $('.isHost .difficultySelect .button').on('click', (event) => {
      let $target = $(event.target);
      if ($target.hasClass('disabled')) {
        return;
      }

      $('.difficultySelect .button.selected').removeClass('selected');
      $target.addClass('selected');
      var difficulty = $target.data('difficulty');
      ServerCalls.UpdatePreGameState(
        null,
        ServerCalls.SLOT_ACTIONS.SET_DIFFICULTY,
        null,
        null,
        difficulty,
      );
    });

    $('.isHost .levelSelect .level').on('click', (event) => {
      let $target = $(event.target);
      if ($target.hasClass('disabled')) {
        return;
      }
      var level = $target.data('level');

      if (!LevelDefs.isLevelAvailable(level)) {
        return;
      }

      $('.levelSelect .level.selected').removeClass('selected');
      $target.addClass('selected');
      ServerCalls.UpdatePreGameState(
        null,
        ServerCalls.SLOT_ACTIONS.SET_LEVEL,
        null,
        null,
        level,
      );
    });
  }

  showCurrentScreen() {
    switch (this.currScreen) {
      case 'deckEditor':
        this.showDeckEditorBoard();
        break;
      case 'gameBoard':
        this.showGameBoard();
        break;
      case 'setup':
      default:
        this.showSetupBoard();
    }
  }

  showSetupBoard() {
    if (this.currScreen !== 'setup') {
      this.currScreen = 'setup';
      $('.screen').hide();
      $('#playerSetupBoard').show();
    }
  }

  showDeckEditorBoard() {
    if (this.currScreen !== 'deckEditor') {
      this.currScreen = 'deckEditor';
      $('.screen').hide();
      $("#deckModifierBoard").show();
    }
  }

  showGameBoard() {
    if (this.currScreen !== 'gameBoard') {
      this.currScreen = 'gameBoard';
      $('.screen').hide();
      $('#gameBoard').show();
    }
  }
}

export let UIListeners = new UIListenersClass();
