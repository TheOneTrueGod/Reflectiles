//MainGame.loadImages(MainGame.testAbility.bind(MainGame));

//MainGame.runLineTester();
function launchGame() {
  MainGame = new MainGameHandler(TurnController);
  MainGame.redraw();
  //MainGame.runRandomTester();
  MainGame.start();
}

launchGame();
