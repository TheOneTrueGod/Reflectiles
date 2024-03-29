class LevelDefsWorld1 {
  static getStageDef(stage) {
    let _ = null;
    let A = UnitBasicSquare;
    let B = UnitBasicDiamond;
    let C = UnitShover;
    let D = UnitHeavy;
    let S = UnitShooter;
    let K = UnitKnight;
    let O = UnitBomber;

    let F = UnitFireShard;
    if (stage == 1) {
      // Nothing hard here at all.  Bunch of basic units, with one knight in the middle
      /*return new LevelDef({
        'initialSpawn':[
          [A, B, C, D, K, O, _, _, _, _, _, _, A, B, C],
          [S, F, _, _, _, _, _, _, _, _, _, _, _, _, _],
        ],
        'waves': [],
      });*/

      return new LevelDef({
        initialSpawn: [
          [_, _, _, _, A, A, A, A, A, A, A, _, _, _, _],
          [_, _, _, A, B, B, A, _, A, B, B, A, _, _, _],
          [_, _, A, B, B, A, _, _, _, A, B, B, A, _, _],
          [_, A, B, B, A, _, _, _, _, _, A, B, B, A, _],
          [A, A, A, A, _, _, _, _, _, _, _, A, A, A, A],
        ],
        waves: [
          {
            type: WAVE_TYPES.BASIC_WAVE,
            count: 15,
          },
          {
            type: WAVE_TYPES.FORMATION,
            units: [
              [_, _, _, _, A, _, S, _, S, _, A, _, _, _, _],
              [_, _, _, _, A, A, A, A, A, A, A, _, _, _, _],
            ],
          },
        ],
      });
    } else if (stage == 2) {
      // Introduction to advanced units.  Throw a few of 'em in there, scattered around
      return new LevelDef({
        initialSpawn: [
          [A, A, A, A, A, A, A, A, A, A, A, A, A, A, A],
          [_, _, S, _, _, _, _, _, _, _, _, _, S, _, _],
          [_, K, A, K, _, _, _, _, _, _, _, K, A, K, _],
          [A, A, A, A, A, A, A, A, A, A, A, A, A, A, A],
          [A, A, A, A, A, A, A, A, A, A, A, A, A, A, A],
        ],
        waves: [
          { type: WAVE_TYPES.BASIC_WAVE, count: 12 },
          { type: WAVE_TYPES.BASIC_WAVE, count: 12 },
          { type: WAVE_TYPES.ADVANCED_WAVE, count: 10, advanced: [null, null] },
          { type: WAVE_TYPES.ADVANCED_WAVE, count: 10, advanced: [null, null] },
        ],
      });
    } else if (stage == 3) {
      // Introduction to a formation.  6 waves, and then a "boss" wave of a formation
      return new LevelDef({
        initialSpawn: [
          [A, A, A, A, A, A, A, A, A, A, A, A, A, A, A],
          [_, O, _, O, _, _, _, _, _, _, _, O, _, O, _],
          [_, K, A, K, _, _, _, _, _, _, _, K, A, K, _],
          [_, C, _, C, _, C, _, C, _, C, _, C, _, C, _],
          [A, A, A, A, A, A, A, A, A, A, A, A, A, A, A],
        ],
        waves: [
          { type: WAVE_TYPES.BASIC_WAVE, count: 8 },
          { type: WAVE_TYPES.BASIC_WAVE, count: 8 },
          { type: WAVE_TYPES.ADVANCED_WAVE, count: 10, advanced: [null, null] },
          {
            type: WAVE_TYPES.FORMATION,
            units: [
              [UnitShover, UnitShooter, UnitProtector, UnitShooter, UnitShover],
              [UnitShover, UnitKnight, UnitKnight, UnitKnight, UnitShover],
            ],
          },
        ],
      });
    } else if (stage == "boss") {
      // Hard level.  15 waves,
      return new LevelDef({
        waveCount: 12,
        initialSpawn: [
          [_, _, O, S, _, _, _, _, _, _, _, S, O, _, _],
          [_, _, B, A, _, _, C, C, C, _, _, A, B, _, _],
          [A, A, K, D, A, A, K, A, K, A, A, A, K, D, A],
        ],
        waves: [
          {
            type: WAVE_TYPES.FORMATION,
            units: [
              [_, _, S, _, _, _, _, _, _, _, _, _, _, S, _],
              [_, K, _, A, A, A, A, UnitBossHealer, A, A, A, A, _, K, _],
              [_],
            ],
          },
          {
            type: WAVE_TYPES.UNIT_LIST,
            units: [
              { unit: UnitBasicSquare, count: 1 },
              { unit: UnitBasicDiamond, count: 2 },
            ],
          },
          {
            type: WAVE_TYPES.UNIT_LIST,
            units: [
              { unit: UnitBasicSquare, count: 2 },
              { unit: UnitBasicDiamond, count: 1 },
            ],
          },
          {
            type: WAVE_TYPES.UNIT_LIST,
            units: [
              { unit: UnitBasicSquare, count: 2 },
              { unit: UnitBasicDiamond, count: 2 },
              { unit: UnitBomber, count: 1 },
            ],
          },
          {
            type: WAVE_TYPES.GOTO,
            offset: -3,
            until: {
              condition: WAVE_CONDITION.BOSS_HEALTH,
              health_percent: 0.6,
            },
          },
          {
            type: WAVE_TYPES.UNIT_LIST,
            units: [
              { unit: UnitBasicSquare, count: 2 },
              { unit: UnitBasicDiamond, count: 2 },
            ],
          },
          {
            type: WAVE_TYPES.UNIT_LIST,
            units: [
              { unit: UnitBasicSquare, count: 1 },
              { unit: UnitBasicDiamond, count: 1 },
              { unit: UnitShover, count: 1 },
              { unit: UnitBomber, count: 1 },
            ],
          },
          {
            type: WAVE_TYPES.GOTO,
            offset: -2,
            until: {
              condition: WAVE_CONDITION.BOSS_HEALTH,
              health_percent: 0.3,
            },
          },
          {
            type: WAVE_TYPES.UNIT_LIST,
            units: [
              { unit: UnitBasicSquare, count: 2 },
              { unit: UnitHeavy, count: 1 },
              { unit: UnitBomber, count: 1 },
            ],
          },
          {
            type: WAVE_TYPES.GOTO,
            offset: -1,
            until: { condition: WAVE_CONDITION.BOSS_HEALTH, health_percent: 0 },
          },
        ],
      });
    } else if (stage === "test") {
      let W = UnitIceWall;
      return new LevelDef({
        initialSpawn: [
          [_, _, _, A, B, B, A, _, A, B, B, A, _, _, _],
          [_, _, A, B, B, A, _, _, _, A, B, B, A, _, _],
          [_, A, B, B, A, _, _, _, _, _, A, B, B, A, _],
          [A, A, A, A, _, _, _, _, _, _, _, A, A, A, A],
        ],
        waves: [
          { type: WAVE_TYPES.FORMATION, units: [[A, A, A, A, A, A, A, A]] },
          { type: WAVE_TYPES.FORMATION, units: [[B, B, B, B, B, B, B, B]] },
          { type: WAVE_TYPES.FORMATION, units: [[C, C, C, C, C, C, C, C]] },
          { type: WAVE_TYPES.FORMATION, units: [[D, D, D, D, D, D, D, D]] },
          { type: WAVE_TYPES.FORMATION, units: [[A, A, A, A, A, A, A, A]] },
          { type: WAVE_TYPES.FORMATION, units: [[B, B, B, B, B, B, B, B]] },
          { type: WAVE_TYPES.FORMATION, units: [[C, C, C, C, C, C, C, C]] },
          { type: WAVE_TYPES.FORMATION, units: [[D, D, D, D, D, D, D, D]] },
          {
            type: WAVE_TYPES.FORMATION,
            units: [
              [A, _, _, _, _, _, _, A],
              [A, A, A, A, A, A, A, A],
            ],
          },
          {
            type: WAVE_TYPES.FORMATION,
            units: [
              [A, A, A, A, A, A, A, A],
              [A, _, _, _, _, _, _, A],
            ],
          },
          {
            type: WAVE_TYPES.BASIC_WAVE,
            count: 19,
          },
          {
            type: WAVE_TYPES.ADVANCED_WAVE,
            count: 8,
            advanced: [null, null],
          },
          {
            type: WAVE_TYPES.SKIP,
          },
        ],
      });
    }
    return new LevelDef();
  }
}
