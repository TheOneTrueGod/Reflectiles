class ServerCalls {
  constructor() {
    this.gameID = $('#gameBoard').attr('data-gameID');
    this.userToken = UserManagement.getUserToken();
    this.loadingMetadata = false;
    this.commands = [];
  }

  SavePlayerDecks(callback, playerDecks) {
    $.post({
      url: "/user/reflectiles/deck",
      data: {
        action: ServerCalls.DECK_ACTIONS.SAVE_DECKS,
        deck_list: JSON.stringify(
          playerDecks.map((deck) => { return deck.serialize(); })
        ),
      }
    })
  }

  SavePlayerCard(callback, playerCard) {
    $.post({
      url: "/user/reflectiles/deck",
      data: {
        action: ServerCalls.DECK_ACTIONS.SAVE_CARD,
        card: JSON.stringify(playerCard.serialize()),
      }
    });
  }

  MakeServerCall(callback, command, context) {
    $.get({
      url: "../gamelogic/" + this.gameID,
      context: context,
      data: {
        action: command,
        userToken: this.userToken,
      },
      success: function( result ) {
        result = $.parseJSON(result);
        if (result['success']) {
          callback.call(context, result['response']);
        }
      }
    });
  }

  LoadInitialBoard(callback, context) {
    this.MakeServerCall(
      callback,
      ServerCalls.SERVER_ACTIONS.GET_BOARD_DATA,
      context
    );
  }

  LoadGameMetaData(callback, context) {
    if (ServerCalls.loadingMetadata) { return; }
    ServerCalls.loadingMetadata = true;
    this.MakeServerCall(
      (response) => {
        ServerCalls.loadingMetadata = false;
        callback.call(context, response);
      },
      ServerCalls.SERVER_ACTIONS.GET_GAME_METADATA,
      context
    );
  }

  GetTurnStatus(callback, context) {
    if (ServerCalls.gettingTurnStatus) { return; }

    ServerCalls.gettingTurnStatus = true;
    $.get({
      url: "../gamelogic/" + this.gameID,
      context: context,
      data: {
        action: ServerCalls.SERVER_ACTIONS.GET_TURN_STATUS,
        userToken: this.userToken,
      },
      success: function( result ) {
        result = $.parseJSON(result);
        if (result['success']) {
          callback.call(context, result['response']);
        }
        ServerCalls.gettingTurnStatus = false;
      }
    });
  }

  SetupBoardAtGameStart(boardStateObj, context, aiDirector) {
    $.post({
      url: "../gamelogic/" + this.gameID,
      context: context,
      data: {
        action: ServerCalls.SERVER_ACTIONS.SET_BOARD_AT_TURN_START,
        board_state: JSON.stringify(boardStateObj.serializeBoardState()),
        turn: 1,
        userToken: this.userToken,
        game_over: boardStateObj.isGameOver(aiDirector),
        players_won: boardStateObj.didPlayersWin(aiDirector)
      },
    });
  };

  SetBoardStateAtStartOfTurn(boardStateObj, context, aiDirector, experienceGained) {
    $.post({
      url: "../gamelogic/" + this.gameID,
      context: context,
      data: {
        action: ServerCalls.SERVER_ACTIONS.SET_BOARD_AT_TURN_START,
        board_state: JSON.stringify(boardStateObj.serializeBoardState()),
        turn: boardStateObj.turn,
        userToken: this.userToken,
        game_over: boardStateObj.isGameOver(aiDirector),
        players_won: boardStateObj.didPlayersWin(aiDirector),
        experience_gained: experienceGained
      },
    });
  };

  //Slot action must be one of; join, quit, kick, start, change_deck
  UpdatePreGameState(player_slot, slot_action, callback, context, other_data) {
    var data = {
      action: ServerCalls.SERVER_ACTIONS.UPDATE_PRE_GAME_STATE,
      slot_action: slot_action,
      userToken: this.userToken
    };
    if (player_slot !== null) { data.player_slot = player_slot; }

    if (slot_action === this.SLOT_ACTIONS.CHANGE_DECK) {
      data.deck_id = other_data;
    } else if (slot_action == this.SLOT_ACTIONS.SET_LEVEL) {
      data.level = other_data;
    } else if (slot_action == this.SLOT_ACTIONS.SET_DIFFICULTY) {
      data.difficulty = other_data;
    }
    $.get({
      url: "../gamelogic/" + this.gameID,
      data: data,
      success: function( result ) {
        result = $.parseJSON(result);
        if (result.success && callback) {
          callback.call(context, result.response);
        }
      }
    });
  }

  FinalizeTurn(turn, context, callback) {
    $.get({
      url: "../gamelogic/" + this.gameID,
      context: context,
      data: {
        action: ServerCalls.SERVER_ACTIONS.FINALIZE_TURN,
        userToken: this.userToken,
        turn: turn
      },
    }).done(function(data) {
      if (!data) {
        throw new Error("Error Finalizing turn on server");
        return;
      }
      var parsedData = $.parseJSON(data);
      if (parsedData['error']) {
        alert(parsedData['error_message']);
        return;
      }
      callback.call(context, parsedData.response);
    });
  }

  FinishGame(context, experience) {
    $.post({
      url: "../gamelogic/" + this.gameID,
      context: context,
      data: {
        action: ServerCalls.SERVER_ACTIONS.FINISH_GAME,
        experience: experience,
        userToken: this.userToken,
      },
    });
  }

  SavePlayerCommands(boardStateObj, playerCommands, context, callback) {
    var command = $.get({
      url: "../gamelogic/" + this.gameID,
      data: {
        action: ServerCalls.SERVER_ACTIONS.SUBMIT_PLAYER_COMMANDS,
        turn: boardStateObj.turn,
        userToken: this.userToken,
        playerCommands: playerCommands
      },
    }).done((data) => {
      if (!data) {
        throw new Error("Error saving player commands on server");
        return;
      }
      var parsedData = $.parseJSON(data);
      if (parsedData['error']) {
        alert(parsedData['error_message']);
        return;
      }
      if (callback) {
        callback.call(context, parsedData.response);
      }
    });
    command.callIndex = ServerCalls.prototype.CALL_INDEX ++;
    this.OverwriteExistingCommand('SavePlayerCommands', command);
  }

  OverwriteExistingCommand(commandName, command) {
    if (
      this.commands[commandName] &&
      this.commands[commandName].state !== "resolved"
    ) {
      this.commands[commandName].abort();
    }
    this.commands[commandName] = command;
  }
}

ServerCalls.SERVER_ACTIONS = {
  GET_BOARD_DATA: 'get_board_data',
  SET_BOARD_AT_TURN_START: 'set_board_at_turn_start',
  FINALIZE_TURN: 'finalize_turn',
  FINISH_GAME: 'finish_game',
  SUBMIT_PLAYER_COMMANDS: 'submit_player_commands',
  GET_TURN_STATUS: 'get_turn_status',
  GET_GAME_METADATA: 'get_game_metadata',
  UPDATE_PRE_GAME_STATE: 'update_pre_game_state'
};

ServerCalls.DECK_ACTIONS = {
  SAVE_DECKS: 'save_decks',
  SAVE_CARD: 'save_card',
};

ServerCalls.prototype.SLOT_ACTIONS = {
  JOIN: 'join',
  QUIT: 'quit',
  KICK: 'kick',
  START: 'start',
  CHANGE_DECK: 'change_deck',
  SET_LEVEL: 'set_level',
  SET_DIFFICULTY: 'set_difficulty',
};

ServerCalls.prototype.CALL_INDEX = 0;

ServerCalls = new ServerCalls();
