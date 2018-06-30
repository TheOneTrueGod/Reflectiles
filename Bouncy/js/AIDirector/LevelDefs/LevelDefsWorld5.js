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
    let IW = UnitIceWall;
    let FS = UnitFireShard;

    if (stage == 1) {
      return new LevelDef({
        'initialSpawn':[
          [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
          [__, __, FS, __, __, __, __, BO, __, __, __, __, FS, __, __],
          [__, KN, AA, AA, KN, __, AA, KN, AA, __, KN, AA, AA, KN, __],
          [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
          [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
        ],
        'waves':[
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 6},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, __, IW, FS, IW, __, __, __, __, __, IW, FS, IW, __, __],
            [__, __, IW, IW, IW, __, __, __, __, __, IW, IW, IW, __, __],
          ]},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, __, __, FS, __, IW, FS, IW, FS, IW, __, FS, __, __, __],
            [__, __, __, __, __, IW, IW, IW, IW, IW, __, __, __, __, __],
          ]},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.FORMATION, units: [
            [FS, IW, __, __, __, __, FS, __, FS, __, __, __, __, FS, IW],
            [IW, IW, __, __, __, __, __, __, __, __, __, __, __, IW, IW],
          ]},
        ],
      });
    } else if (stage == 2) {
      return new LevelDef({
        'initialSpawn':[
          [__, __, __, __, FS, __, __, __, __, __, FS, __, __, __, __],
          [__, __, FS, __, __, __, __, FS, __, __, __, __, FS, __, __],
        ],
        'waves':[
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 4}, {'unit': UnitFireShard, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitFireShard, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitShover, 'count': 4}, {'unit': UnitFireShard, 'count': 3}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitShover, 'count': 6}, {'unit': UnitFireShard, 'count': 3}]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [IW, IW, IW, FS, IW, IW, IW, IW, IW, IW, IW, FS, IW, IW, IW],
            [IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW],
          ]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitHeavy, 'count': 3}, {'unit': UnitFireShard, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitHeavy, 'count': 3}, {'unit': UnitFireShard, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitHeavy, 'count': 3}, {'unit': UnitFireShard, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitHeavy, 'count': 3}, {'unit': UnitFireShard, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitHeavy, 'count': 3}, {'unit': UnitFireShard, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitHeavy, 'count': 3}, {'unit': UnitFireShard, 'count': 2}]},
        ],
      });
    } else if (stage == 3) {
      return new LevelDef({
        'initialSpawn':[
          [__, SH, __, __, __, FS, __, __, __, FS, __, __, __, SH, __],
          [KN, __, __, KN, __, __, KN, __, KN, __, __, KN, __, __, KN],
          [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
          [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
          [IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW],
          [IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW],
        ],
        'waves':[
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitFireShard, 'count': 1}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitKnight, 'count': 3}, {'unit': UnitShooter, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitFireShard, 'count': 1}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitKnight, 'count': 3}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBomber, 'count': 1}]},

        ],
      });
    } else if (stage == 'boss') {
      return new LevelDef({
        'initialSpawn':[
          [__, SH, __, __, __, __, __, __, __, __, __, __, __, SH, __],
          [__, __, FS, __, __, __, __, WZ, __, __, __, __, FS, __, __],
          [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
          [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
          [IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW],
          [IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW, IW],
        ],
        'waves':[],
      });
    }
    console.warn("No level def for World 5, stage " + stage);
    return new LevelDef();
  }
}
