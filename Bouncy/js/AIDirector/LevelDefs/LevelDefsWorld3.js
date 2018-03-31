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
    let BB = UnitBasicDiamond;
    let CC = UnitShover;
    let DD = UnitHeavy;
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
      });
    } else if (stage == 2) {
        // Hard level.  15 waves,
        return new LevelDef({
          'initialSpawn':[
            [__, __, __, __, __, __, __, __, __, __, __, __, __, __, __],
            [__, __, NC, __, __, __, __, __, __, __, __, __, NC, __, __],
            [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
            [AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA, AA],
            [__, __, __, __, __, BL, __, __, __, BL, __, __, __, __, __],
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
          [__, __, DD, DD, DD, __, __, __, __, __, DD, DD, DD, __, __],
          [__, __, DD, NC, DD, __, __, __, __, __, DD, NC, DD, __, __],
          [__, __, SK, SK, SK, __, __, __, __, __, SK, SK, SK, __, __],
          [__, SK, SK, SK, SK, SK, __, __, __, SK, SK, SK, SK, SK, __],
        ],
        'waves':[
          {'type': WAVE_TYPES.SKIP},
          {'type': WAVE_TYPES.FORMATION, units: [
            [DD, SH, DD],
            [DD, NC, DD],
            [DD, DD, DD],
          ]},
          {'type': WAVE_TYPES.SKIP},
          {'type': WAVE_TYPES.FORMATION, units: [
            [DD, DD, DD],
            [DD, NC, DD],
            [DD, DD, DD],
          ]},
          {'type': WAVE_TYPES.SKIP},
          {'type': WAVE_TYPES.FORMATION, units: [
            [DD, SH, DD],
            [DD, NC, DD],
            [DD, DD, DD],
          ]},
          {'type': WAVE_TYPES.SKIP},
          {'type': WAVE_TYPES.FORMATION, units: [
            [DD, SH, DD],
            [DD, NC, DD],
            [DD, DD, DD],
          ]},
          {'type': WAVE_TYPES.SKIP},
          {'type': WAVE_TYPES.FORMATION, units: [
            [null, null, null],
            [null, null, null],
            [null, UnitBossWarlock, null],
            [null, null, null],
          ]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[{'unit': UnitBasicSquare, 'count': 6}]},
          {'type': WAVE_TYPES.ADVANCED_WAVE, 'count': 8, 'advanced': [ null]},
          {'type': WAVE_TYPES.GOTO, 'offset': -3, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0}},
        ]
      });
    }
    console.warn("No level def for World 2, stage " + stage);
    return new LevelDef();
  }
}
