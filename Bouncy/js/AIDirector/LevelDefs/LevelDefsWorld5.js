class LevelDefsWorld5 {
  static getStageDef(stage) {
    let __ = null;
    let $$ = null;
    let AA = UnitBasicSquare;
    let BB = UnitBasicDiamond;
    let CC = UnitShover;
    let DD = UnitHeavy;
    let SH = UnitShooter;
    let KN = UnitKnight;
    let BO = UnitBomber;
    let BL = UnitBlocker;
    let DE = UnitDefensive;
    let WW = UnitCastleWall;
    let WZ = UnitBossGrandWizard;

    if (stage == 1) {

    } else if (stage == 2) {

    } else if (stage == 3) {

    } else if (stage == 'boss') {
      return new LevelDef({
        'initialSpawn':[
          [__, SH, __, __, __, __, __, __, __, __, __, __, __, SH, __],
          [__, __, __, __, __, __, __, WZ, __, __, __, __, __, __, __],
          [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
          //[AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
          //[AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
        ],
        'waves':[],
      });
    }
    console.warn("No level def for World 5, stage " + stage);
    return new LevelDef();
  }
}
