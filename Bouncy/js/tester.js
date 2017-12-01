class Tester extends MainGame {
  start() {
    this.unitType = UnitBomber;
    this.loadImages(this.testAbility.bind(this));
    UnitBasic.createAbilityDefs();
  }

  testAbility() {
    var ClarenceAbils = ClarenceDeck();
    var TJAbils = TJDeck();
    var ChipAbils = ChipDeck();
    // SET COMMANDS HERE
    this.abilitiesToUse = [
      [ChipAbils[1].index, {x: 250, y: -250}],
      [TJAbils[2].index, {x: 0, y: -250}],
      [TJAbils[4].index, {x: 0, y: -250}],
      [TJAbils[3].index, {x: 0, y: -250}],
      [TJAbils[1].index, {x: 0, y: -250}],
      [TJAbils[0].index, {x: 0, y: -250}],
      /*[ClarenceAbils[4].index, {x: 0, y: -250}],
      [TJAbils[4].index, {x: 0, y: -250}],
      [TJAbils[0].index, {x: 0, y: -250}],*/
    ];

    // END SET COMMANDS HERE
    UIListeners.showGameBoard();
    var width = Unit.UNIT_SIZE * 5; var height = Unit.UNIT_SIZE * 9;
    let boardSize = {width: width, height: height};
    this.boardState = new BoardState(boardSize, this.stage);
    this.boardState.sectors = new UnitSectors(9, 5, width, height);

    this.players[0] = Player({user_name: 'totg', user_id: 'totg'}, 'totg');
    //this.TICK_DELAY = 10;
    this.abilityTestReset();

    AIDirector.spawnForTurn = function() {} ;
    AIDirector.spawnForTurn2 = function() {} ;
    var self = this;
    this.turnsPlayed = 0;
    self.boardState.saveState();
    this.finalizedTurnOver = function() {
      window.setTimeout(function() {
        self.playingOutTurn = false;
        self.turnsPlayed += 1;
        self.boardState.turn += 1;
        if (self.turnsPlayed > 6) {
          self.abilityTestReset();
          self.boardState.teamHealth = [40, 40];
          UIListeners.updateTeamHealth(40, 40);
          self.turnsPlayed = 0;
        }
        self.abilityTestRunCommands();
      }, 500);
    }
    this.abilityTestRunCommands();
  }

  abilityTestRunCommands() {
    this.playerCommands = [];
    var abilIndex = this.abilitiesToUse[this.turnsPlayed];
    if (abilIndex !== undefined && abilIndex !== null) {
      var target = abilIndex[1];
      if (abilIndex[0] == "move") {
          this.setPlayerCommand(
            new PlayerCommandMove(
              (this.boardState.boardSize.width / 2) + target.x,
              (this.boardState.boardSize.height - 25) + target.y
            ),
            false
          );
      } else {
        this.setPlayerCommand(
          new PlayerCommandUseAbility(
            (this.boardState.boardSize.width / 2) + target.x,
            (this.boardState.boardSize.height - 25) + target.y,
            abilIndex[0],
            $('#gameContainer').attr('playerID')
          ),
          false
        );
      }
    }
    this.playOutTurn();
  }

  abilityTestReset() {
    this.boardState.reset();
    this.boardState.resetStage();
    let units = [
      [null, UnitKnight, UnitShooter, UnitKnight],
      [null, UnitBasicSquare, null, UnitBasicSquare],
      [UnitBlocker, null, UnitBasicSquare, null, UnitBlocker],
    ];
    /*var newUnit = new UnitBossHealer(
      Unit.UNIT_SIZE * (2.5),
      Unit.UNIT_SIZE * (1.5),
      0
    );

    this.boardState.addUnit(newUnit);*/
    for (var i = 0; i < units.length; i++) {
      for (var j = 0; j < units[i].length; j++) {
        let unitType = units[i][j];
        if (unitType == null) { continue; }
        var newUnit = new unitType(
          Unit.UNIT_SIZE * (j + .5),
          Unit.UNIT_SIZE * (i + 1.5),
          0
        );

        this.boardState.addUnit(newUnit);
      }
    }

    var newCore = new UnitCore(
      this.boardState.boardSize.width / 2,
      this.boardState.boardSize.height - Unit.UNIT_SIZE / 2,
      'totg'
    );
    this.boardState.addUnit(newCore);
  }
}

MainGame = new Tester();
MainGame.redraw();

MainGame.start();
