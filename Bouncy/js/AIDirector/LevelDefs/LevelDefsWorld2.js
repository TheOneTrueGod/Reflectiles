// World 2 unit ideas
// Skeleton -- low health
// Necromancer -- Every turn summons 3 skeletons in front of him, and then shoves those columns forward
// Abomination -- Every turn, it devours a nearby unit, increasing its health by double that units remaining health.
// Corpse Feeder -- Every time a nearby unit dies, this unit gains 100 armor
// Warlock -- Every time a nearby unit dies, create a bone shield where that unit used to be.
class LevelDefsWorld2 {
  static getStageDef(stage) {
    if (stage == 1) {
      // Hard level.  15 waves, 
      return new LevelDef({
        'waveCount': 2,
        'waves':[
          {'type': WAVE_TYPES.FORMATION, units: [
            [null, null, null],
            [null, UnitBossHealer, null],
            [null, null, null],
          ]},
          {'type': WAVE_TYPES.UNIT_LIST, 'units':[]},
          {'type': WAVE_TYPES.GOTO, 'offset': -1, 'until': {'condition': WAVE_CONDITION.BOSS_HEALTH, 'health_percent': 0}},
        ]
      })
    }
    console.warn("No level def for World 2, stage " + stage);
    return new LevelDef();
  }
}