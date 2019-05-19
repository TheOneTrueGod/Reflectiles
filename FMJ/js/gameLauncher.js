function launchGame() {
    MainGame = new MainGameHandler(TurnController);
    MainGame.redraw();
    MainGame.start();
}

launchGame();
  