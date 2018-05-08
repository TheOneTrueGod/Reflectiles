
class LevelDefsWorld4 {
  static getStageDef(stage) {
    let __ = null;
    let AA = UnitBasicSquare;
    let BB = UnitBasicDiamond;
    let CC = UnitShover;
    let DD = UnitHeavy;
    let SH = UnitShooter;
    let KN = UnitKnight;
    let BO = UnitBomber;
    let BL = UnitBlocker;
    let DE = UnitDefensive;

    if (stage == 1) {
      return new LevelDef({
        'waveCount': 12,
        'initialSpawn':[
          [__, __, AA, AA, AA, __, __, __, __, __, AA, AA, AA, __, __],
          [__, __, AA, NC, AA, __, __, __, __, __, AA, NC, AA, __, __],
          [__, __, AA, AA, AA, __, __, __, __, __, AA, AA, AA, __, __],
          [__, __, SK, SK, SK, __, __, __, __, __, SK, SK, SK, __, __],
        ],
        'waves':[],
      });
    } else if (stage == 2) {

    } else if (stage == 3) {

    } else if (stage == 'boss') {

    }
    console.warn("No level def for World 4, stage " + stage);
    return new LevelDef();
  }
}
