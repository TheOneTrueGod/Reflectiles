//MainGame.loadImages(MainGame.testAbility.bind(MainGame));
//MainGame.debugSpeed();

//MainGame.runLineTester();
function launchGame() {
  MainGame = new MainGameHandler();
  MainGame.redraw();
  //MainGame.runRandomTester();
  MainGame.start();
}

launchGame();
