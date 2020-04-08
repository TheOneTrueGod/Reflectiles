class Tester extends MainGameHandler {
  start() {
    NumbersBalancer.setNumPlayers(4);
    NumbersBalancer.setDifficulty(NumbersBalancer.DIFFICULTIES.NIGHTMARE);
    $('.unitDetailsContainer')
      .append($("<div>", {class: 'damageDealt noselect'}))
      .append($("<div>", {class: 'damageTaken noselect'}));
    this.unitType = UnitBomber;
    this.loadImages(this.testAbility.bind(this));
    UnitBasic.createAbilityDefs();
    this.cachedAbilities = {};

    this.unitsToSpawn = [
      //[null, UnitShooter, UnitKnight, UnitShooter, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, null],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, null],
    ];
  }

  buildAbility(core, perkList) {
    if (!perkList) {
      perkList = [];
    }
    let key = core.prototype.constructor.name + perkList.join(",");
    if (key in this.cachedAbilities) {
      return this.cachedAbilities[key];
    }
    let ability = core.BuildAbility(perkList, 0);
    this.cachedAbilities[key] = ability;
    return ability;
  }

  testAbility() {
    /*var ClarenceAbils = ClarenceDeck();
    var TJAbils = TJDeck();
    var TabithaAbils = TabithaDeck();
    var ChipAbils = ChipDeck();
    var TestAbils = TestDeck();*/
    // SET COMMANDS HERE
    this.abilitiesToUse = [
      //[TestAbils[3].index, {x: -100, y: -50}],
      //[this.buildAbility(AbilityCore7, ['shield width 1']).index, {x: 0, y: -100}],
      //[this.buildAbility(AbilityCore1003, []).index, {x: 0, y: -1000}],
      [this.buildAbility(AbilityCore4010, []).index, {x: 0, y: -1000}],
      [this.buildAbility(AbilityCore4010, []).index, {x: 500, y: -1000}],
      [this.buildAbility(AbilityCore4010, []).index, {x: -500, y: -1000}],
      [this.buildAbility(AbilityCore4010, []).index, {x: 0, y: -1000}],
      //[this.buildAbility(AbilityCore3007, []).index, {x: 0, y: -100}],
      //[this.buildAbility(AbilityCore13).index, {x: 0, y: -100}],
      //[this.buildAbility(AbilityCore5,
        /*["pass through 1", "pass through 1", "pass through 1", "damage 1", "damage 1",
        "damage 1", "pass through damage 2", "pass through damage 2", "pass through damage 2",
        "fire damage 2", "fire damage 2", "fire damage 2", "kills explode 3", "kills explode 3",
        "kills explode 3", "kills explode 3", "kills explode 3", "kills explode 3", "kills explode 3",
        "kills explode 3", "kills explode 3", "kills explode 3", "kills explode 3", "kills explode 3",
        "kills explode 3", "kills explode 3", "kills explode 3", "kills explode 3", "kills explode 3",
        "kills explode 3", "kills explode 3", "kills explode 3", "curving 1", "curving 1", "curving 1",
        "damage to far", "damage to far", "damage to far", "damage to far", "damage to far", "damage to far",
        "damage to far", "damage to far", "damage to far", "damage to far", "damage to far", "damage to far",
        "damage to far", "damage to far", "damage to far", "damage to far", "damage to far", "damage to far",
        "damage to far", "damage to far"]*/
      //).index, {x: 0, y: -100}],
      //[this.buildAbility(AbilityCore0, ['damage1', 'damage1', 'damage1', 'rocket count4', 'rocket count4', 'rocket count4']).index, {x: 0, y: -100}],
      //[this.buildAbility(AbilityCore0, ['damage1', 'damage1', 'damage1', 'rocket count4', 'rocket count4', 'rocket count4']).index, {x: 0, y: -100}],
      //[this.buildAbility(AbilityCore0, ['damage1', 'damage1', 'damage1', 'rocket count4', 'rocket count4', 'rocket count4']).index, {x: 0, y: -100}],
      null,
      null,
      null,
      /*[TestAbils[0].index, {x: 0, y: -250}],
      [TestAbils[1].index, {x: 0, y: -250}],
      [TestAbils[0].index, {x: 0, y: -250}],*/
    ];
    // END SET COMMANDS HERE

    UIListeners.showGameBoard();
    var width = Unit.UNIT_SIZE * 5; var height = Unit.UNIT_SIZE * 9;
    let boardSize = {width: width, height: height};
    this.boardState = new BoardState(boardSize, this.stage);
    this.turnController.setBoardState(this.boardState);
    this.boardState.sectors = new UnitSectors(9, 5, width, height);

    this.players[0] = new Player({user_name: Tester.USER_ID, user_id: Tester.USER_ID}, Tester.USER_ID);
    this.abilityTestReset();

    AIDirector.spawnForTurn = function() {} ;
    AIDirector.spawnForTurn2 = function() {} ;
    var self = this;
    this.turnsPlayed = 0;
    self.boardState.saveState();
    /*this.turnController.finalizedTurnOver = function() {
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
    }*/
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
            Tester.USER_ID
          ),
          false
        );
      }
      this.playerCommands[Tester.USER_ID].updateValidTargetChecks();
    }

    this.turnController.playOutTurn();
  }

  abilityTestReset() {
    this.boardState.reset();
    this.boardState.resetStage();
    let units = this.unitsToSpawn;

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
      Tester.USER_ID
    );
    this.boardState.addUnit(newCore);
  }

  doTick(phase) {
    const tickResult = super.doTick(phase);
    let totalDamage = 0;
    for (let key in this.boardState.gameStats.playerDamage[Tester.USER_ID]) {
      let damageStat = this.boardState.gameStats.playerDamage[Tester.USER_ID][key];
      totalDamage += damageStat.damage;
    }
    $(".damageDealt").html("Damage Dealt<br>" + totalDamage);
    let damageTaken = this.boardState.teamHealth[1] - this.boardState.teamHealth[0];
    $(".damageTaken").html("Damage Taken<br>" + damageTaken);
    return tickResult;
  }
}

Tester.USER_ID = 'totg';

MainGame = new Tester(TestTurnController);
MainGame.redraw();

MainGame.start();
