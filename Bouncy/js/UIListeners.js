class UIListeners {
  contructor() {
    this.otherDecks = [];
    this.deliberatelyQuit = false;
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
        "<div class='playerName noselect'>" + player.getUserName() + "</div>"
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
  }

  createAbilityDisplay(players) {
    $('#missionProgramDisplay').append(
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

    var abilities = player.getAbilities();
    for (var i = 0; i < abilities.length; i++) {
      $div = $("<div>", {"class": "abilityContainer"});
      $div.append(abilities[i].getAbilityHTML());
      $('#missionProgramDisplay').append($div);
      abilities[i].chargeUpdated();
    }
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

    var abilities = player.getAbilities();
    for (var i = 0; i < abilities.length; i++) {
      abilities[i].chargeUpdated();
    }
  }

  setupUIListeners() {
    $('#missionEndTurnButton').on('click', function() {
      TurnControls.setPlayState(false);
      MainGame.finalizeTurn();
    });

    var self = this;

    $('#missionProgramDisplay .abilityCard').on(
      'click',
      function() {
        // Deselect currently selected abilities
        PlayerInput.setSelectedAbility($(this).attr("ability-id"));
        self.updateSelectedAbility();
      }
    );

    $('#missionActionDisplay').on('click', function(event) {
      PlayerInput.handleClick(this, event);
    });

    $('#missionActionDisplay').on('mousemove', function(event) {
      PlayerInput.handleMouseMotion(event);
    });

    $('#missionActionDisplay').on('contextmenu', function(event) {
      PlayerInput.handleClick(this, event);
      event.preventDefault();
      return false;
    });
  }

  updateSelectedAbility() {
    $('.abilityCard.selected').removeClass('selected');
    if (PlayerInput.getSelectedAbility()) {
      $('.abilityCard[ability-id=' + PlayerInput.getSelectedAbility() + ']')
        .addClass("selected");
    }
  }

  updatePlayerCommands(player_commands, players) {
    $('.playerStatus .statusIndicator').removeClass('ready');
    for (var key in players) {
      var player = players[key];
      if (player_commands[player.getUserID()] !== undefined) {
        $('.playerStatus.' + player.getUserID() + ' .statusIndicator').addClass('ready');
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
      $('#gameOverBox').text("Game Over");
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
          let damage = gameStats.playerDamage[player.user_id][abilityIndex].damage;
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

  updateGameSetupScreen(players, difficulty, level) {
    var loggedInPlayerID = $('#gameContainer').attr('playerID');
    $('.screen').hide();
    $('#playerSetupBoard').show();
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
          if (player.getUserID() == "totg") {
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
    var currDeckID = player.getAbilityDeckID();
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
    );
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

  showGameBoard() {
    $('.screen').hide();
    $('#gameBoard').show();
  }
}

UIListeners = new UIListeners();
