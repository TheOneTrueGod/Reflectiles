class NumbersBalancer {
  constructor() {
    this.num_players = 4;
    this.powerLevelBase = 0;
    this.difficulty = this.DIFFICULTIES.MEDIUM;
  }

  setNumPlayers(num_players) {
    this.num_players = num_players;
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  getDifficulty() {
    return this.difficulty;
  }

  setPowerLevelBase(powerLevel) {
    this.powerLevelBase = powerLevel;
  }

  getPowerLevelMultiplier(powerLevel) {
    if (DEBUG_DISABLE_LEVELING) {
      return 1;
    }
    return Math.pow(2, powerLevel / 20);
  }

  getAbilityDamage(level, damageScaling) {
    return 1000 * this.getPowerLevelMultiplier(Math.max(level - 1, 0)) * damageScaling;
  }

  getPlayerStat(stat) {
    switch (stat) {
      case this.PLAYER_STATS.PLAYER_HEALTH:
        return 100;
    }
    throw new Error("getPlayerStat (" + stat + ") not implemented");
  }

  getUnitDamage(unit) {
    var damage = 5;
    if (this.difficulty == this.DIFFICULTIES.HARD) {
    } else if (this.difficulty === this.DIFFICULTIES.NIGHTMARE) {
      damage *= 2;
    }
    if (unit.constructor.name == "UnitBossHealer") { damage = 50; }
    if (unit.constructor.name == "UnitBossSlime") { damage = 50; }

    return damage;
  }

  getUnitSpeed(unit) {
    var speedVal = 1;
    if (unit.constructor.name == "UnitBossHealer") { speedVal = 0.333333333; }
    if (unit.constructor.name == "UnitBossSlime") { speedVal = 0.333333; }
    if (unit.constructor.name == "UnitFast") { speedVal = 2; }
    return speedVal;
  }

  getDifficultyMultiplier() {
    switch (this.difficulty) {
      case this.DIFFICULTIES.EASY:
        return 0.5;
      case this.DIFFICULTIES.MEDIUM:
        return 1;
      case this.DIFFICULTIES.HARD:
        return 4;
      case this.DIFFICULTIES.NIGHTMARE:
        return 12;
    }
    throw new Error("Unknown difficulty");
  }

  getPlayerCountMultiplier() {
    switch (this.num_players) {
      case 1:
        return 1;
      case 2:
        return 1.75;
      case 3:
        return 2.5;
      case 4:
        return 3;
    }
    throw new Error("Unknown player count Multiplier");
  }

  getUnitHealthStats(unit, stat) {
    let powerLevelMultiplier = this.getPowerLevelMultiplier(this.powerLevelBase);
    var healthMultiplier =
      this.getDifficultyMultiplier() *
      this.getPlayerCountMultiplier() *
      powerLevelMultiplier;

    let healthVal = 100;
    let armorVal = 0;
    let shieldVal = 0;
    switch (unit.constructor.name) {
      case "UnitBasicSquare":
      case "UnitBasicDiamond":
        healthVal = 100;
        break;
      case "UnitFast":
        healthVal = 75;
        break;
      case "UnitHeavy":
        healthVal = 200;
        break;
      case "UnitShooter":
        healthVal = 150;
        break;
      case "UnitShover":
        healthVal = 150;
        break;
      case "UnitBomber":
        healthVal = 200;
        break;
      case "UnitKnight":
        healthVal = 100;
        armorVal = 200;
        break;
      case "UnitDefensive":
        healthVal = 500;
        break;
      case "UnitProtector":
        healthVal = 200;
        shieldVal = 100;
        break;
      case "UnitBlocker":
        healthVal = 100;
        shieldVal = 100;
        armorVal = 100;
        break;
      case "UnitBossHealer":
        healthVal = 5000;
        break;
      case "UnitSlime":
        healthVal = 80;
        break;
      case "UnitBossSlime":
        healthVal = 5000;
        break;
      case "UnitSkeleton":
        healthVal = 100;
        break;
      case "UnitNecromancer":
        healthVal = 300;
        shieldVal = 100;
        break;
      case "UnitBossWarlock":
        healthVal = 1000;
        shieldVal = 1000;
        break;
      case "UnitBossGrandWizard":
        healthVal = 2000;
        shieldVal = 4000;
        break;
      case "UnitBossKing":
        healthVal = 5000;
        armorVal = 1000;
        break;
      case "UnitCastleWall":
        healthVal = 50;
        armorVal = 150;
        break;
      case "UnitIceWall":
        healthVal = 50;
        shieldVal = 150;
        break;
      case "UnitFireShard":
        healthVal = 100;
        shieldVal = 100;
    }
    return {
      health: Math.floor(healthVal * healthMultiplier),
      armor: Math.floor(armorVal * healthMultiplier),
      shield: Math.floor(shieldVal * healthMultiplier)
    };
  }

  getPowerLevel(world, stage) {
    let difficulty = this.getDifficulty();
    if (stage === 'boss') { stage = 4; }
    world = Number.parseInt(world) - 1;
    stage = Number.parseInt(stage) - 1;
    let pctDone = (world * 4 + stage) / 20;
    // TODO: REMOVE ME.
    //return 0;
    switch (difficulty) {
      case this.DIFFICULTIES.EASY:
        return Math.floor(lerp(0, 10, pctDone));
      case this.DIFFICULTIES.MEDIUM:
        return Math.floor(lerp(0, 20, pctDone));
      case this.DIFFICULTIES.HARD:
        return Math.floor(lerp(15, 50, pctDone));
      case this.DIFFICULTIES.NIGHTMARE:
        return Math.floor(lerp(30, 75, pctDone));
      case this.DIFFICULTIES.IMPOSSIBLE:
        return Math.floor(lerp(50, 100, pctDone));
    }

    return this.powerLevel;
  }

  getUnitHealth(unit) {
    return this.getUnitHealthStats(unit).health;
  }

  getUnitArmour(unit) {
    return this.getUnitHealthStats(unit).armor;
  }

  getUnitShield(unit) {
    return this.getUnitHealthStats(unit).shield;
  }

  getUnitAbilityNumber(unit, ability) {
    var playerMult = this.getPlayerCountMultiplier();
    var difficultyMult = this.getDifficultyMultiplier();
    let powerLevelMultiplier = this.getPowerLevelMultiplier(this.powerLevelBase);
    switch (ability) {
      case this.UNIT_ABILITIES.PROTECTOR_SHIELD:
        return 50 + 50 * playerMult * difficultyMult * powerLevelMultiplier;
      case this.UNIT_ABILITIES.PROTECTOR_SHIELD_NUM_TARGETS:
        return 2;
      case this.UNIT_ABILITIES.PROTECTOR_SHIELD_RANGE:
        return 2;
      case this.UNIT_ABILITIES.KNIGHT_SHIELD:
        return 50 * playerMult * difficultyMult * powerLevelMultiplier;
      case this.UNIT_ABILITIES.DEFENSIVE_MAX_DAMAGE:
        return 200 * playerMult * difficultyMult * powerLevelMultiplier;
      case this.UNIT_ABILITIES.SHOOTER_DAMAGE:
        return 2;
      case this.UNIT_ABILITIES.BOMBER_EXPLOSION_DAMAGE:
        return 20;
      case this.UNIT_ABILITIES.BOMBER_DURATION:
        return 5;
      case this.UNIT_ABILITIES.UNIT_BOSS_HEALER_RANGE:
        return 100;
      case this.UNIT_ABILITIES.UNIT_BOSS_HEALER_NUM_TARGETS:
        return 4;
      case this.UNIT_ABILITIES.UNIT_BOSS_HEALER_AMOUNT:
        return 50 * playerMult * difficultyMult * powerLevelMultiplier;
      case this.UNIT_ABILITIES.BOSS_SLIME_SPLIT_THRESHOLD:
        return 50 * playerMult * difficultyMult * powerLevelMultiplier;
      case this.UNIT_ABILITIES.SKELETON_MAX_DAMAGE:
        let health = this.getUnitHealth(unit);
        return Math.ceil(health / 2);
      case this.UNIT_ABILITIES.NECROMANCER_MAX_SKELETONS_PER_TURN:
        return 1;
      case this.UNIT_ABILITIES.NECROMANCER_RANGE:
        return 3;
      case this.UNIT_ABILITIES.WARLOCK_MAX_SKELETONS_PER_TURN:
        return 3;
      case this.UNIT_ABILITIES.WARLOCK_RANGE:
        return 5;
      case this.UNIT_ABILITIES.WARLOCK_SHIELD:
        return 50 * playerMult * difficultyMult * powerLevelMultiplier;
      case this.UNIT_ABILITIES.KING_REVIVE_TURNS:
        return 3;
      case this.UNIT_ABILITIES.CASTLE_WALL_REVIVE_TURNS:
        return 4;
      case this.UNIT_ABILITIES.FIRE_SHARD_TOTAL_DAMAGE:
        return 9;
      case this.UNIT_ABILITIES.FIRE_SHARD_NUM_SHOTS:
        return 3;
      case this.UNIT_ABILITIES.WIZARD_NUM_WALLS:
        return 2;
      case this.UNIT_ABILITIES.WIZARD_NUM_SHARDS:
        return 1;
      case this.UNIT_ABILITIES.WIZARD_PROJECTILE_DAMAGE:
        return 2;
    }
    throw new Error("Failure");
  }
}

NumbersBalancer.prototype.PLAYER_STATS = {
  PLAYER_HEALTH: 'player_health'
};

NumbersBalancer.prototype.UNIT_ABILITIES = {
  PROTECTOR_SHIELD: 'protector_shield',
  PROTECTOR_SHIELD_NUM_TARGETS: 'protector_shield_num_targets',
  PROTECTOR_SHIELD_RANGE: 'protector_shield_range',
  KNIGHT_SHIELD: 'knight_shield',
  SHOOTER_DAMAGE: 'shooter_damage',
  BOMBER_EXPLOSION_DAMAGE: 'bomber_explosion_damage',
  BOMBER_DURATION: 'BOMBER_DURATION',
  UNIT_BOSS_HEALER_RANGE: 'UNIT_BOSS_HEALER_RANGE',
  UNIT_BOSS_HEALER_NUM_TARGETS: 'UNIT_BOSS_HEALER_NUM_TARGETS',
  UNIT_BOSS_HEALER_AMOUNT: 'UNIT_BOSS_HEALER_AMOUNT',
  BOSS_SLIME_SPLIT_THRESHOLD: 'BOSS_SLIME_SPLIT_THRESHOLD',
  SKELETON_MAX_DAMAGE: 'SKELETON_MAX_DAMAGE',
  DEFENSIVE_MAX_DAMAGE: 'DEFENSIVE_MAX_DAMAGE',
  NECROMANCER_MAX_SKELETONS_PER_TURN: 'NECROMANCER_MAX_SKELETONS_PER_TURN',
  NECROMANCER_RANGE: 'NECROMANCER_RANGE',
  WARLOCK_MAX_SKELETONS_PER_TURN: 'WARLOCK_MAX_SKELETONS_PER_TURN',
  WARLOCK_RANGE: 'WARLOCK_RANGE',
  KING_REVIVE_TURNS: 'KING_REVIVE_TURNS',
  CASTLE_WALL_REVIVE_TURNS: 'CASTLE_WALL_REVIVE_TURNS',
  FIRE_SHARD_NUM_SHOTS: 'FIRE_SHARD_NUM_SHOTS',
  FIRE_SHARD_TOTAL_DAMAGE: 'FIRE_SHARD_TOTAL_DAMAGE',
  WIZARD_NUM_SHARDS: 'WIZARD_NUM_SHARDS',
  WIZARD_NUM_WALLS: 'WIZARD_NUM_WALLS',
  WIZARD_PROJECTILE_DAMAGE: 'WIZARD_PROJECTILE_DAMAGE',
};

NumbersBalancer.prototype.DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  NIGHTMARE: 'nightmare',
  IMPOSSIBLE: 'impossible',
};

NumbersBalancer = new NumbersBalancer();
