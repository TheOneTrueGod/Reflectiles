class TestTurnController extends TurnController {
    finalizedTurnOver() {
        window.setTimeout(() => {
          this.playingOutTurn = false;
          this.mainGameHandler.turnsPlayed += 1;
          this.mainGameHandler.boardState.turn += 1;
          if (this.mainGameHandler.turnsPlayed > 6) {
            this.mainGameHandler.abilityTestReset();
            this.mainGameHandler.boardState.teamHealth = [40, 40];
            UIListeners.updateTeamHealth(40, 40);
            this.mainGameHandler.turnsPlayed = 0;
          }
          this.mainGameHandler.abilityTestRunCommands();
        }, 500);
      }
}