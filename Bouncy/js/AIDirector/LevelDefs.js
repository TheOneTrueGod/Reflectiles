class LevelDefs {
  getLevelDef(world, stage) {
    if (world == 1) {
      return LevelDefsWorld1.getStageDef(stage);
    } else if (world == 2) {
      return LevelDefsWorld2.getStageDef(stage);
    } else if (world == 3) {
      return LevelDefsWorld3.getStageDef(stage);
    } else if (world == 4) {
      return LevelDefsWorld4.getStageDef(stage);
    } else if (world == 5) {
      return LevelDefsWorld5.getStageDef(stage);
    }
    return new LevelDef();
  }

  extractWorld(level) {
    return level.split("-")[0];
  }

  extractStage(level) {
    return level.split("-")[1];
  }

  isLevelAvailable(level) {
    let world = this.extractWorld(level);
    let stage = this.extractStage(level);
    if (world <= 5) {
      return true;
    }
    /*if (world == 3) {
      return stage != 'boss';
    }*/
    return false;
  }
}

class LevelDef {
  constructor(levelData) {
    if (!levelData) {
      this.totalWaves = 20;
      this.waves = null;
      this.hudWaves = this.totalWaves;
      this.initialSpawn = null;
      this.powerLevel = 0;
    } else {
      this.totalWaves = levelData.waves.length;
      this.waves = levelData.waves;
      this.hudWaves = levelData.waveCount ? levelData.waveCount : this.totalWaves;
      this.initialSpawn = levelData.initialSpawn;
      this.powerLevel = levelData.powerLevel ? levelData.powerLevel : 0;
    }
  }

  getPowerLevel(world, stage) {
    if (this.powerLevel !== 0) {
      return this.powerLevel;
    }
    return NumbersBalancer.getPowerLevel(world, stage);
  }

  getWaveSpawnFormation(boardState) {
    let wavesSpawned = boardState.getWavesSpawned();
    if (wavesSpawned >= this.waves.length) {
      return null;
    }
    let wave = this.waves[wavesSpawned];
    switch (wave.type) {
      case WAVE_TYPES.UNIT_LIST:
        return new UnitListSpawnFormation(boardState, wave);
      case WAVE_TYPES.BASIC_WAVE:
        return new BasicUnitWaveSpawnFormation(boardState, this.totalWaves, wave);
      case WAVE_TYPES.ADVANCED_WAVE:
        return new AdvancedUnitWaveSpawnFormation(boardState, this.totalWaves, wave);
      case WAVE_TYPES.FORMATION:
        return new UnitFormationSpawnFormation(boardState, wave);
      case WAVE_TYPES.SKIP:
        return new SkipSpawnFormation(boardState, this.totalWaves);
      case WAVE_TYPES.GOTO:
        this.doGoto(boardState, wave);
        if (boardState.getWavesSpawned() === wavesSpawned) {
          throw new Error("Something went wrong in doGoto");
        }
        return this.getWaveSpawnFormation(boardState);
      default:
        throw new Error("wave type (" + wave.type + ") not handled");
    }
  }

  doGoto(boardState, wave) {
    let conditionMet = false;
    switch (wave.until.condition) {
      case WAVE_CONDITION.BOSS_HEALTH:
        conditionMet = true;
        let bossUnits = boardState.getAllUnitsByCondition((u) => {
          return u.isBoss();
        });
        if (bossUnits.length) {
          conditionMet = false;
        }
        bossUnits.forEach((u) => {
          let health = u.getHealth();
          let healthPct = health.max > 0 ? (health.current / health.max) : 0;
          let targetPct = wave.until.health_percent;
          if (healthPct <= targetPct) {
            conditionMet = true;
          }
        });
        break;
    }
    if (!conditionMet) {
      boardState.addWavesSpawned(wave.offset);
    } else {
      boardState.addWavesSpawned(1);

    }
  }

  getSpawnFormation(boardState) {
    if (this.waves) {
      return this.getWaveSpawnFormation(boardState);
    }
    let wavesSpawned = boardState.getWavesSpawned();
    if (
      wavesSpawned / this.totalWaves == 0.5 ||
      wavesSpawned == this.totalWaves - 1
    ) {
      return new KnightAndShooterSpawnFormation(boardState, this.totalWaves);
    }
    if (wavesSpawned % 2 == 0) {
      return new AdvancedUnitWaveSpawnFormation(boardState, this.totalWaves);
    }
    return new BasicUnitWaveSpawnFormation(boardState, this.totalWaves);
  }

  getGameProgress(boardState) {
    return Math.min(boardState.wavesSpawned / this.hudWaves, 1);
  }
}

LevelDefs = new LevelDefs();

const WAVE_TYPES = {
  UNIT_LIST: 'unit_list',
  BASIC_WAVE: 'basic_wave',
  ADVANCED_WAVE: 'advanced_wave',
  FORMATION: 'formation',
  SKIP: 'skip',
  GOTO: 'goto',
};

const WAVE_CONDITION = {
  BOSS_HEALTH: 'boss_health',
}
