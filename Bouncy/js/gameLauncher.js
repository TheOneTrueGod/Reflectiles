//MainGame.loadImages(MainGame.testAbility.bind(MainGame));
import MainGameHandler from './main.js';
import { TurnController } from './Turns/TurnController.js';

//MainGame.runLineTester();
function launchGame() {
  MainGame = new MainGameHandler(TurnController);
  MainGame.redraw();
  //MainGame.runRandomTester();
  MainGame.start();
}

launchGame();
