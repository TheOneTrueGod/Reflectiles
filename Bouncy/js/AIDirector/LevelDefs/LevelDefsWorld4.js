
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
    let WW = UnitCastleWall;

    if (stage == 1) {
      return new LevelDef({
        'initialSpawn':[
          [AA, __, AA, AA, AA, __, AA, AA, AA, __, AA, AA, AA, __, AA],
          [__, AA, DD, BO, DD, __, DD, BO, DD, __, DD, BO, DD, AA, __],
          [__, __, DE, DE, DE, AA, DE, DE, DE, AA, DE, DE, DE, __, __],
          [__, AA, AA, AA, AA, __, AA, AA, AA, __, AA, AA, AA, AA, __],
          [AA, __, AA, AA, AA, __, AA, AA, AA, __, AA, AA, AA, __, AA],
          [AA, CC, AA, CC, AA, CC, AA, CC, AA, CC, AA, CC, AA, CC, AA],
          [WW, WW, WW, WW, WW, WW, WW, WW, WW, WW, WW, WW, WW, WW, WW]
        ],
        'waves':[],
      });
    } else if (stage == 2) {
      return new LevelDef({
        'initialSpawn':[
          [WW, __, WW, __, __, __, SH, __, SH, __, __, __, WW, __, WW],
          [WW, WW, WW, __, __, DE, KN, __, KN, DE, __, __, WW, WW, WW],
          [WW, WW, WW, __, __, __, DE, __, DE, __, __, __, WW, WW, WW],
          [WW, WW, WW, __, __, __, __, __, __, __, __, __, WW, WW, WW],
          [WW, WW, WW, __, __, __, __, __, __, __, __, __, WW, WW, WW],
          [WW, WW, WW, __, __, __, __, __, __, __, __, __, WW, WW, WW],
          [WW, WW, WW, __, __, __, __, __, __, __, __, __, WW, WW, WW]
        ],
        'waves':[
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, __, __, __, __, __, __, SH, __, __, __, __, __, __, __],
            [__, __, __, __, DE, KN, __, DE, __, KN, DE, __, __, __, __],
            [__, __, __, __, __, DE, __, __, __, DE, __, __, __, __, __],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, __, __, __, __, SH, __, BO, __, SH, __, __, __, __, __],
            [__, __, __, __, KN, __, DE, __, DE, __, KN, __, __, __, __],
            [__, __, __, __, __, DE, __, DE, __, DE, __, __, __, __, __],
          ]},
        ],
      });
    } else if (stage == 3) {
      return new LevelDef({
        'initialSpawn':[
          [WW, WW, WW, WW, __, __, SH, __, SH, __, __, WW, WW, WW, WW],
          [WW, WW, WW, WW, __, DE, KN, __, KN, DE, __, WW, WW, WW, WW],
          [WW, WW, WW, WW, __, __, DE, __, DE, __, __, WW, WW, WW, WW],
          [WW, WW, WW, WW, __, __, __, __, __, __, __, WW, WW, WW, WW],
          [WW, WW, WW, WW, __, __, __, __, __, __, __, WW, WW, WW, WW],
          [WW, WW, WW, WW, __, __, __, __, __, __, __, WW, WW, WW, WW],
          [WW, WW, WW, WW, WW, WW, WW, WW, WW, WW, WW, WW, WW, WW, WW]
        ],
        'waves':[
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, __, __, __, __, __, __, SH, __, __, __, __, __, __, __],
            [__, __, __, __, DE, KN, __, DE, __, KN, DE, __, __, __, __],
            [__, __, __, __, __, DE, __, __, __, DE, __, __, __, __, __],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, __, __, __, __, SH, __, BO, __, SH, __, __, __, __, __],
            [__, __, __, __, KN, __, DE, __, DE, __, KN, __, __, __, __],
            [__, __, __, __, __, DE, __, DE, __, DE, __, __, __, __, __],
          ]},
        ],
      });
    } else if (stage == 'boss') {

    }
    console.warn("No level def for World 4, stage " + stage);
    return new LevelDef();
  }
}
