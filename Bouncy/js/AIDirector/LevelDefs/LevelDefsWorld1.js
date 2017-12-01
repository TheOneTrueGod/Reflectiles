class LevelDefsWorld1 {
  static getStageDef(stage) {
    if (stage == 1) {
      // Nothing hard here at all.  Bunch of basic units, with one knight in the middle
      return new LevelDef({
        'waves':[
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitKnight, 'count': 1}, {'unit': UnitShover, 'count': 6}, {'unit': UnitBasicSquare, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitShover, 'count': 10}]},
        ]
      })
    } else if (stage == 2) {
      // Introduction to advanced units.  Throw a few of 'em in there, scattered around
      return new LevelDef({
        'waves':[
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}, {'unit': UnitBasicDiamond, 'count': 2}]},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 10, 'advanced': [null, null]},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 10, 'advanced': [null, null]},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 12},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 12},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 15, 'advanced': [UnitShooter, UnitKnight, UnitShooter, UnitKnight]},
        ]
      })
    } else if (stage == 3) {
      // Introduction to a formation.  6 waves, and then a "boss" wave of a formation
      return new LevelDef({
        'waves':[
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 10, 'advanced': [null, null]},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 10, 'advanced': [null, null]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [UnitShover, UnitShooter, UnitProtector, UnitShooter, UnitShover],
            [UnitShover, UnitKnight, UnitKnight, UnitKnight, UnitShover]
          ]},
        ]
      })
    } else if (stage == 'boss') {
      // Hard level.  15 waves, 
      return new LevelDef({
        'waveCount': 12,
        'waves':[
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 8, 'advanced': [UnitBomber, UnitBomber]},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 8},
          {'type': WAVE_TYPES.FORMATION, units: [
            [UnitHeavy, UnitShooter, UnitShooter, UnitHeavy],
            [UnitHeavy, UnitKnight, UnitKnight, UnitHeavy]
          ]},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 10},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 10, 'advanced': [UnitBomber, UnitBomber]},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 10},
          {'type': WAVE_TYPES.FORMATION, units: [
            [UnitHeavy, UnitShooter, UnitShooter, UnitHeavy],
            [UnitHeavy, UnitKnight, UnitKnight, UnitHeavy]
          ]},
          {'type': WAVE_TYPES.BASIC_WAVE, 'count': 12},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 12, 'advanced': [UnitBomber, UnitBomber]},
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
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 3}, {'unit': UnitShover, 'count': 2}, {'unit': UnitBomber, 'count': 1}]},
          {'type': WAVE_TYPES.GOTO, 'offset': -2, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0.3}},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 1}, {'unit': UnitHeavy, 'count': 5}, {'unit': UnitBomber, 'count': 1}]},
          {'type': WAVE_TYPES.GOTO, 'offset': -1, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0}},
        ]
      })
    }
    return new LevelDef();
  }
}