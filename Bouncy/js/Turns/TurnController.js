class TurnController {
    constructor(mainGameHandler) {
        this.mainGameHandler = mainGameHandler;
        this.playingOutTurn = false;
        this.boardState = null;

        this.TICK_DELAY = 20;
    }

    setBoardState(boardState) {
        this.boardState = boardState;
    }

    debugSpeed() {
        this.TICK_DELAY = 40;
    }

    setPlayingOutTurn(value) {
        this.playingOutTurn = value;
    }

    isPlayingOutTurn() {
        return this.playingOutTurn;
    }

    playOutTurn(currPhase) {
        if (this.playingOutTurn && !currPhase) { return; }
        if (!currPhase) {
            $('#gameContainer').addClass("turnPlaying");
            this.mainGameHandler.removeAllPlayerCommands();
            for (let pid in this.mainGameHandler.playerCommands) {
                for (let command of this.mainGameHandler.playerCommands[pid].getCommands()) {
                    if (command instanceof PlayerCommandUseAbility) {
                        this.boardState.gameStats.addAbilityUseCount(pid, command.abilityID);
                    }
                }
            }
        }

        this.playingOutTurn = true;
        this.mainGameHandler.updateActionHint();
        if (currPhase) {
            this.boardState.endOfPhase(this.mainGameHandler.players, currPhase);
        }
        var phase = !!currPhase ?
            TurnPhasesEnum.getNextPhase(currPhase) :
            TurnPhasesEnum.START_TURN;

        this.startOfPhase(phase);

        if (phase == TurnPhasesEnum.NEXT_TURN) {
            this.finalizedTurnOver();
        } else {
            this.loopTicksForPhase(phase);
        }
    }

    startOfPhase(phase) {
        if (phase == TurnPhasesEnum.ENEMY_MOVE) {
          AIDirector.giveUnitsOrders(this.boardState);
        }
        if (phase == TurnPhasesEnum.ENEMY_MOVE) {
          AIDirector.spawnForTurn(this.boardState);
        }
    
        if (phase == TurnPhasesEnum.ENEMY_ACTION) {
          this.boardState.doUnitActions(this.boardState);
        }
    
        this.boardState.startOfPhase(phase);
      }
    
    loopTicksForPhase(phase) {
        var result = this.mainGameHandler.doTick(phase);
        if (result) {
          this.boardState.endPhase();
          this.playOutTurn.call(this, phase);
        } else {
          this.mainGameHandler.tickLoopTimeout = window.setTimeout(
                this.loopTicksForPhase.bind(this, phase), 
                this.TICK_DELAY,
            );
        }
    }

    readyForTurnEnd(players, playerCommands) {
		var allPlayersDone = true;
		players.forEach((player) => {
			if (
				!playerCommands[player.getUserID()] ||
				!playerCommands[player.getUserID()].isDoneTurn()
			) {
				allPlayersDone = false;
			}
		});

		return allPlayersDone;
    }

    finalizedTurnOver() {
        $('#gameContainer').removeClass("turnPlaying");
        if (!this.boardState.isGameOver(AIDirector)) {
          $('#missionEndTurnButton').prop("disabled", false).removeClass("flashing");
        } else {
          UIListeners.showGameOverScreen(this.boardState.didPlayersWin(AIDirector), this.boardState.gameStats);
        }
    
        this.mainGameHandler.players.forEach((player) => {
          let discardedCards = 0;
          if (player.user_id in this.mainGameHandler.playerCommands) {
            this.mainGameHandler.playerCommands[player.user_id].getCommands().forEach((command) => {
              if (command instanceof PlayerCommandUseAbility) {
                if (player.discardCard(command.abilityID)) {
                  discardedCards += 1;
                }
              }
            });
          }
          player.endOfTurn();
          player.refillHand(this.boardState);
        });
    
        UIListeners.createAbilityDisplay(this.mainGameHandler.players);
    
        this.boardState.incrementTurn(this.mainGameHandler.players);
        this.boardState.saveState();
        if (this.mainGameHandler.isHost) {
          let experienceGained = this.boardState.gameStats.getExperienceEarned();
          ServerCalls.SetBoardStateAtStartOfTurn(this.boardState, this.mainGameHandler, AIDirector, experienceGained);
        } else {
          $('#gameContainer').addClass("turnPlaying");
          this.mainGameHandler.resyncAtTurnEnd();
        }
        this.mainGameHandler.removeAllPlayerCommands();
        this.mainGameHandler.playerCommands = [];
        this.mainGameHandler.isFinalized = false;
        this.mainGameHandler.isFinalizing = false;
        this.setPlayingOutTurn(false);
    
        UIListeners.updatePlayerCommands(this.mainGameHandler.playerCommands, this.mainGameHandler.players);
        this.mainGameHandler.getTurnStatus();
        UIListeners.resetHintBox();
        this.mainGameHandler.updateActionHint();
      }
}