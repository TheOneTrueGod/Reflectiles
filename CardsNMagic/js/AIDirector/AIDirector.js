class AIDirector {
  runTick() {
    if ((MainGame.boardState.tick - 30) % 45 == 0) {
      MainGame.boardState.addUnit(new UnitBit(200, 10, 0));
      MainGame.boardState.addUnit(new UnitBit(250, 10, 0));
      MainGame.boardState.addUnit(new UnitBit(225, 30, 0));
    }
  }
}

AIDirector = new AIDirector();
