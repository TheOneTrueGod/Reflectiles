// World 2 unit ideas
// Skeleton -- low health
// Necromancer -- Every turn summons 3 skeletons in front of him, and then shoves those columns forward
// Abomination -- Every turn, it devours a nearby unit, increasing its health by double that units remaining health.
// Corpse Feeder -- Every time a nearby unit dies, this unit gains 100 armor
// Warlock -- Every time a nearby unit dies, create a bone shield where that unit used to be.
class LevelDefsWorld3 {
  static getStageDef(stage) {
    let __ = null;
    let AA = UnitBasicSquare;
    let B = UnitBasicDiamond;
    let C = UnitShover;
    let D = UnitHeavy;
    let SH = UnitShooter;
    let KN = UnitKnight;
    let BO = UnitBomber;
    let SL = UnitSlime;
    let BL = UnitBlocker;
    let SK = UnitSkeleton;
    let NC = UnitNecromancer;
    let DE = UnitDefensive;

    if (stage == 1) {
      // Hard level.  15 waves,
      return new LevelDef({
        'initialSpawn':[
          [SK, __, SK, __, SK, __, SK, __, SK, __, SK, __, SK, __, SK],
          [SK, SK, SK, __, __, SK, SK, SK, SK, SK, __, __, SK, SK, SK],
          [SK, SK, SK, SK, __, __, SK, SK, SK, __, __, SK, SK, SK, SK],
          [SK, SK, SK, SK, SK, __, __, SK, __, __, SK, SK, SK, SK, SK],
        ],
        'waves':[
          {'type': WAVE_TYPES.FORMATION, units: [
            [SK, SK, __, __, SK, SK, __, SK, __, SK, SK, __, __, SK, SK],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SK, SK, SK, SK, SK, __, __, SK, __, __, SK, SK, SK, SK, SK],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SK, SK, SK, __, __, SK, SK, SK, SK, SK, __, __, SK, SK, SK],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SK, SK, SK, SK, SK, __, __, __, __, __, SK, SK, SK, SK, SK],
          ]},
        ]
      })
    } else if (stage == 2) {
        // Hard level.  15 waves,
        return new LevelDef({
          'waveCount': 2,
          'initialSpawn':[
            [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
            [__, __, NC, __, __, __, __, __, __, __, __, __, NC, __, __],
            [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
            [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
            [BL, __, __, __, __, BL, __, __, __, BL, __, __, __, __, BL],
            [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
          ],
          'waves':[
            {'type': WAVE_TYPES.FORMATION, units: [
              [__, __, __, NC, __, __, __, __, __, __, __, NC, __, __, __],
              [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
              [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
            ]},
            {'type': WAVE_TYPES.FORMATION, units: [
              [__, __, __, NC, __, __, __, __, __, __, __, NC, __, __, __],
              [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
              [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
            ]},
          ]
        });
    } else if (stage == 3) {
      return new LevelDef({
        'waveCount': 2,
        'initialSpawn':[
          [__, __, NC, __, __, __, __, __, __, __, __, __, NC, __, __],
          [__, DE, BO, DE, __, __, __, __, __, __, __, DE, BO, DE, __],
          [__, KN, DE, KN, __, __, __, __, __, __, __, KN, DE, KN, __],
        ],
        'waves':[
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, __, __, __, NC, __, __, __, __, __, NC, __, __, __, __],
            [__, __, __, DE, BO, DE, __, __, __, DE, BO, DE, __, __, __],
            [__, __, __, KN, DE, KN, __, __, __, KN, DE, KN, __, __, __],
            [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, __, __, NC, __, __, __, __, __, __, __, NC, __, __, __],
            [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
            [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
            [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
          ]},

          {'type': WAVE_TYPES.FORMATION, units: [
            [SK, __, SK, __, SK, __, SK, __, SK, __, SK, __, SK, __, SK],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [__, SK, __, SK, __, SK, __, SK, __, SK, __, SK, __, SK, __],
          ]},
          {'type': WAVE_TYPES.FORMATION, units: [
            [SK, __, SK, __, SK, __, SK, __, SK, __, SK, __, SK, __, SK],
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
