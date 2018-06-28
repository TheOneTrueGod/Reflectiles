class Tester extends MainGame {
  start() {
    NumbersBalancer.setNumPlayers(1);
    //NumbersBalancer.setDifficulty(NumbersBalancer.DIFFICULTIES.NIGHTMARE);
    $('.unitDetailsContainer')
      .append($("<div>", {class: 'damageDealt noselect'}))
      .append($("<div>", {class: 'damageTaken noselect'}));
    this.unitType = UnitBomber;
    this.loadImages(this.testAbility.bind(this));
    UnitBasic.createAbilityDefs();
    this.cachedAbilities = {};

    this.unitsToSpawn = [
      [null, UnitShooter, UnitKnight, UnitShooter, null],
      //[null, null, UnitBossGrandWizard, null, null],
      [null, null, null, null, null],
      [null, null, null, null, null],
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
    let ability = core.BuildAbility(perkList);
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
      [this.buildAbility(AbilityCore4, []).index, {x: 0, y: -100}],
      [this.buildAbility(AbilityCore13).index, {x: 0, y: -100}],
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
    this.boardState.sectors = new UnitSectors(9, 5, width, height);

    this.players[0] = new Player({user_name: 'totg', user_id: 'totg'}, 'totg');
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
      'totg'
    );
    this.boardState.addUnit(newCore);
  }

  loopTicksForPhase(phase) {
    super.loopTicksForPhase(phase);
    for (let key in this.boardState.gameStats.playerDamage.totg) {
      let damageStat = this.boardState.gameStats.playerDamage.totg[key];
      $(".damageDealt").html("Damage Dealt<br>" + damageStat.damage);
    }
    let damageTaken = this.boardState.teamHealth[1] - this.boardState.teamHealth[0];
    $(".damageTaken").html("Damage Taken<br>" + damageTaken);
  }
}

MainGame = new Tester();
MainGame.redraw();

MainGame.start();
