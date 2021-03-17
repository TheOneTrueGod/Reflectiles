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
    if (stage == 1) {
      // Nothing hard here at all.  Bunch of basic units, with one knight in the middle
      return new LevelDef({
        'initialSpawn':[
          [_, _, _, _, A, A, A, A, A, A, A, _, _, _, _],
          [_, _, _, A, B, B, A, _, A, B, B, A, _, _, _],
          [_, _, A, B, B, A, _, _, _, A, B, B, A, _, _],
          [_, A, B, B, A, _, _, _, _, _, A, B, B, A, _],
          [A, A, A, A, _, _, _, _, _, _, _, A, A, A, A],
        ],
        'waves':[
          { 
            'type': WAVE_TYPES.ADVANCED_WAVE,
            'count': 8,
            'advanced': [null, null]
          },
          { 
            'type': WAVE_TYPES.BASIC_WAVE, 
            'count': 17
          },
          { 'type': WAVE_TYPES.UNIT_LIST,
            'units':[{'unit': UnitBasicSquare, 'count': 20}, {'unit': UnitBasicDiamond, 'count': 2}]
          },
          {
            'type': WAVE_TYPES.SKIP,
          },
          {
          'type': WAVE_TYPES.FORMATION, units: [
            [_, S, S, S, _, _, _, _, _, _, _, S, S, S, _],
            [_, _, B, S, _, _, _, _, _, _, _, S, B, _, _]
          /*{'type': WAVE_TYPES.FORMATION, units: [
            [_, _, _, _, _, _, S, _, S, _, _, _, _, _, _]
          ]},*/
          ]}
        ]
      });
    } else if (stage == 2) {
      // Introduction to advanced units.  Throw a few of 'em in there, scattered around
      return new LevelDef({
        'initialSpawn':[
          [A, A, A, A, A, A, A, A, A, A, A, A, A, A, A],
          [_, _, S, _, _, _, _, _, _, _, _, _, S, _, _],
          [_, K, A, K, _, _, _, _, _, _, _, K, A, K, _],
          [A, A, A, A, A, A, A, A, A, A, A, A, A, A, A],
          [A, A, A, A, A, A, A, A, A, A, A, A, A, A, A],
        ],
        'waves':[
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 12},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 12},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 10, 'advanced': [null, null]},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 10, 'advanced': [null, null]},
        ]
      });
    } else if (stage == 3) {
      // Introduction to a formation.  6 waves, and then a "boss" wave of a formation
      return new LevelDef({
        'initialSpawn':[
          [A, A, A, A, A, A, A, A, A, A, A, A, A, A, A],
          [_, O, _, O, _, _, _, _, _, _, _, O, _, O, _],
          [_, K, A, K, _, _, _, _, _, _, _, K, A, K, _],
          [_, C, _, C, _, C, _, C, _, C, _, C, _, C, _],
          [A, A, A, A, A, A, A, A, A, A, A, A, A, A, A],
        ],
        'waves':[
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 10, 'advanced': [null, null]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [UnitShover, UnitShooter, UnitProtector, UnitShooter, UnitShover],
            [UnitShover, UnitKnight, UnitKnight, UnitKnight, UnitShover]
          ]},
        ]
      });
    } else if (stage == 'boss') {
      // Hard level.  15 waves,
      return new LevelDef({
        'waveCount': 12,
        'initialSpawn':[
          [_, _, O, S, _, _, S, K, S, _, _, S, O, _, _],
          [_, _, B, A, _, _, C, C, C, _, _, A, B, _, _],
          [A, D, K, D, A, D, K, D, K, D, A, D, K, D, A],
        ],
        'waves':[
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 12},
          {'type': WAVE_TYPES.FORMATION, units: [
            [null, null, null],
            [null, UnitBossHealer, null],
            [null, null, null],
          ]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 2}, {'unit': UnitBasicDiamond, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 3}, {'unit': UnitBasicDiamond, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 3}, {'unit': UnitBasicDiamond, 'count': 2}, {'unit': UnitBomber, 'count': 1}]},
          {'type': WAVE_TYPES.GOTO, 'offset': -3, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0.6}},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 4}, {'unit': UnitShover, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 3}, {'unit': UnitShover, 'count': 1}, {'unit': UnitBomber, 'count': 1}, {'unit': UnitProtector, 'count': 1}]},
          {'type': WAVE_TYPES.GOTO, 'offset': -2, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0.3}},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 3}, {'unit': UnitHeavy, 'count': 2}, {'unit': UnitBomber, 'count': 1}]},
          {'type': WAVE_TYPES.GOTO, 'offset': -1, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0}},
        ]
      });
    }
    return new LevelDef();
  }
}
