// World 2 unit ideas
// Skeleton -- low health
// Necromancer -- Every turn summons 3 skeletons in front of him, and then shoves those columns forward
// Abomination -- Every turn, it devours a nearby unit, increasing its health by double that units remaining health.
// Corpse Feeder -- Every time a nearby unit dies, this unit gains 100 armor
// Warlock -- Every time a nearby unit dies, create a bone shield where that unit used to be.
class LevelDefsWorld2 {
  static getStageDef(stage) {
    let __ = null;
    let A = UnitBasicSquare;
    let B = UnitBasicDiamond;
    let C = UnitShover;
    let D = UnitHeavy;
    let SH = UnitShooter;
    let KN = UnitKnight;
    let BO = UnitBomber;
    let SL = UnitSlime;
    let BL = UnitBlocker;

    if (stage == 1) {
      // Hard level.  15 waves,
      return new LevelDef({
        'initialSpawn':[
          [__, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __],
          [SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL],
          [__, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __],
          [SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL],
          [__, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __],
        ],
        'waves':[
          {'type': WAVE_TYPES.FORMATION, units: [
            [SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL],
            [SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL],
          ]},
        ]
      })
    } else if (stage == 2) {
        // Hard level.  15 waves,
        return new LevelDef({
          'waveCount': 2,
          'initialSpawn':[
            [SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL],
            [__, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __],
            [SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL],
            [__, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __],
            [__, __, BL, __, __, __, __, __, __, __, __, __, BL, __, __],
            [BL, __, __, __, __, __, __, __, __, __, __, __, __, __, BL],
          ],
          'waves':[
            {'type': WAVE_TYPES.FORMATION, units: [
              [SL, SL, SH, __, __, __, __, __, __, __, __, __, SH, SL, SL],
              [SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL],
            ]},
            {'type': WAVE_TYPES.FORMATION, units: [
              [SL, SL, SL, SL, SH, SL, BO, BO, SL, SH, SL, SL, SL, SL, SL],
              [__, __, __, SL, SL, SL, SL, SL, SL, SL, SL, SL, __, __, __],
            ]},
          ]
        });
    } else if (stage == 3) {
      return new LevelDef({
        'waveCount': 2,
        'initialSpawn':[
          [SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL],
          [__, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __],
          [SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL],
          [__, SL, BO, SL, __, SL, __, SL, __, SL, __, SL, BO, SL, __],
          [__, KN, BL, KN, __, __, __, __, __, __, __, KN, BL, KN, __],
          [BL, __, __, __, __, __, __, __, __, __, __, __, __, __, BL],
        ],
        'waves':[
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL, __, SL],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SL, SL, SH, __, __, __, __, __, __, __, __, __, SH, SL, SL],
            [SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SL, SL, SL, SL, SH, SL, BO, BO, SL, SH, SL, SL, SL, SL, SL],
            [__, __, __, SL, SL, SL, SL, SL, SL, SL, SL, SL, __, __, __],
          ]},
        ]
      });
    } else if (stage == 'boss') {
      // hard level that culminates in a boss,
      return new LevelDef({
        'waveCount': 12,
        'initialSpawn':[
          [SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL],
          [SL, SL, SL, SL, SL, SL, __, __, __, SL, SL, SL, SL, SL, SL],
          [SL, SL, SL, __, __, SL, SL, SL, SL, SL, __, __, SL, SL, SL],
          [__, __, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, __, __],
          [SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL, SL],
        ],
        'waves':[
          {'type': WAVE_TYPES.FORMATION, units: [
            [null, null, null],
            [null, UnitBossSlime, null],
            [null, null, null],
          ]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitSlime, 'count': 4}]},
          {'type': WAVE_TYPES.GOTO, 'offset': -1, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0.6}},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitSlime, 'count': 5}]},
          {'type': WAVE_TYPES.GOTO, 'offset': -1, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0.3}},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitSlime, 'count': 6}]},
          {'type': WAVE_TYPES.GOTO, 'offset': -1, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0}},
        ]
      })
    }
    console.warn("No level def for World 2, stage " + stage);
    return new LevelDef();
  }
}
