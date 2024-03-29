import { BoardState } from './BoardState.js';
import MainGameHandler from './main.js';
import { TurnController } from './Turns/TurnController.js';
import { UIListeners } from './UIListeners.js';
class CardDemo extends MainGameHandler {
  constructor() {
    super(TurnController);
    this.MAX_TURNS_TO_PLAY = 1;
    this.abilitiesToUse = [];
  }

  start() {
    this.unitType = UnitBomber;
    this.loadImages(this.testAbility.bind(this));
    UnitBasic.createAbilityDefs();
    this.cachedAbilities = {};

    this.unitsToSpawn = [
      [null, UnitBasicSquare, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare, UnitBasicSquare],
      [null, UnitBasicSquare, UnitBasicSquare, UnitShooter, UnitBasicSquare, UnitBasicSquare]
    ];
  }

  demoAbility(abilDef, playerCard) {
    let core = AbilityFactory.GetAbilityCore(playerCard.cardID);
    this.unitsToSpawn = core.GetDemoUnits();
    let timesToUse = core.GetDemoTimesToUse();
    this.abilitiesToUse = [];
    for (let i = 0; i < timesToUse; i++) {
      this.abilitiesToUse.push([abilDef.index, core.GetAimOffsets()]);
    }
    this.MAX_TURNS_TO_PLAY = core.GetDemoTurns();

    if (this.boardState) {
      this.abilityTestReset();
      clearTimeout(this.tickLoopTimeout);
      this.playingOutTurn = false;
      this.abilityTestRunCommands();
    }
  }

  testAbility() {
    UIListeners.showGameBoard();
    var width = Unit.UNIT_SIZE * 7; var height = Unit.UNIT_SIZE * 9;
    let boardSize = {width: width, height: height};
    this.boardState = new BoardState(boardSize, this.renderContainers.boardState);
    this.boardState.sectors = new UnitSectors(9, 7, width, height);

    this.players[0] = new Player({user_name: 'totg', user_id: 'totg'}, 'totg');
    this.abilityTestReset();

    AIDirector.spawnForTurn = function() {} ;
    AIDirector.spawnForTurn2 = function() {} ;
    var self = this;
    this.turnsPlayed = 0;
    self.boardState.saveState();
    this.finalizedTurnOver = function() {
      self.playingOutTurn = false;
      self.turnsPlayed += 1;
      self.boardState.turn += 1;
      if (self.turnsPlayed > self.MAX_TURNS_TO_PLAY) {
        self.abilityTestReset();
        self.boardState.teamHealth = [40, 40];
        UIListeners.updateTeamHealth(40, 40);
        self.turnsPlayed = 0;
      }
      self.abilityTestRunCommands();
    };
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
            'totg'
          ),
          false
        );
      }
    }
    if (this.playerCommands[$('#gameContainer').attr('playerID')]) {
      this.playerCommands[$('#gameContainer').attr('playerID')].updateValidTargetChecks();
    }
    this.playOutTurn();
  }

  abilityTestReset() {
    this.turnsPlayed = 0;
    this.boardState.reset();
    this.boardState.resetStage();
    let units = this.unitsToSpawn;

    for (var i = 0; i < units.length; i++) {
      for (var j = 0; j < units[i].length; j++) {
        let unitType = units[i][j];
        if (unitType === null) { continue; }
        var newUnit = new unitType(
          Unit.UNIT_SIZE * (j + 0.5),
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

MainGame = new CardDemo();
MainGame.redraw();

MainGame.start();
