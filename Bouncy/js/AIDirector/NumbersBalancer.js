class NumbersBalancer {
  constructor() {
    this.num_players = 4;
    this.difficulty = this.DIFFICULTIES.MEDIUM;
  }

  setNumPlayers(num_players) {
    this.num_players = num_players;
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
  }

  getPlayerStat(stat) {
    switch (stat) {
      case this.PLAYER_STATS.PLAYER_HEALTH:
        return 40;
    }
    throw new Exception("getPlayerStat (" + stat + ") not implemented");
  }

  getUnitDamage(unit) {
    var damage = 1;
    if (unit.constructor.name == "UnitBossHealer") { damage = 30; }
    if (unit.constructor.name == "UnitBomber") { damage = 10; }
    ///if (unit.constructor.name == "UnitFast") { damage = 2; }
    return damage;
  }

  getUnitSpeed(unit) {
    var speedVal = 1;
    if (unit.constructor.name == "UnitBossHealer") { speedVal = 0.333333333; }
    if (unit.constructor.name == "UnitFast") { speedVal = 2; }
    return speedVal;
  }

  getUnitHealth(unit) {
    var healthMultiplier = 1;
    if (this.num_players == 1) { healthMultiplier *= 1; }
    if (this.num_players == 2) { healthMultiplier *= 2; }
    if (this.num_players == 3) { healthMultiplier *= 3.5; }
    if (this.num_players == 4) { healthMultiplier *= 5; }

    if (this.difficulty == this.DIFFICULTIES.EASY) { healthMultiplier *= 0.75; }
    if (this.difficulty == this.DIFFICULTIES.MEDIUM) { healthMultiplier *= 1; }
    if (this.difficulty == this.DIFFICULTIES.HARD) { healthMultiplier *= 1.25; }
    if (this.difficulty == this.DIFFICULTIES.NIGHTMARE) { healthMultiplier *= 1.5; }

    var healthVal = 100;
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
        healthVal = (300 + 100 * this.num_players) / healthMultiplier;
        break;
      case "UnitProtector":
        healthVal = 200;
        break;
      case "UnitBlocker":
        healthVal = 200;
        break;
      case "UnitBossHealer":
        healthVal = 5000;
        break;
    }
    return Math.floor(healthVal * healthMultiplier);
  }

  getUnitArmour(unit) {
    var multiplier = 1;
    if (this.num_players == 1) { multiplier *= 1; }
    if (this.num_players == 2) { multiplier *= 2; }
    if (this.num_players == 3) { multiplier *= 3; }
    if (this.num_players == 4) { multiplier *= 4; }

    var value = 0;

    switch (unit.constructor.name) {
      case "UnitKnight":
        value = 100;
    }

    return value * multiplier;
  }

  getUnitShield(unit) {
    var multiplier = 1;
    if (this.num_players == 1) { multiplier *= 1; }
    if (this.num_players == 2) { multiplier *= 2; }
    if (this.num_players == 3) { multiplier *= 3; }
    if (this.num_players == 4) { multiplier *= 4; }

    let value = 0;

    switch (unit.constructor.name) {
      case "UnitProtector":
        value = 100;
        break;
      case "UnitBlocker":
        value = 200;
        break;
    }

    return value * multiplier;
  }

  getUnitAbilityNumber(ability) {
    var playerMult = 1;
    if (this.num_players == 2) { playerMult *= 2; }
    if (this.num_players == 3) { playerMult *= 3; }
    if (this.num_players == 4) { playerMult *= 4; }
    switch (ability) {
      case this.UNIT_ABILITIES.PROTECTOR_SHIELD:
        return 100 * playerMult;
      case this.UNIT_ABILITIES.PROTECTOR_SHIELD_NUM_TARGETS:
        return 2;
      case this.UNIT_ABILITIES.PROTECTOR_SHIELD_RANGE:
        return 2;
      case this.UNIT_ABILITIES.KNIGHT_SHIELD:
        return 100 * playerMult;
      case this.UNIT_ABILITIES.SHOOTER_DAMAGE:
        return 1;
      case this.UNIT_ABILITIES.BOMBER_EXPLOSION_DAMAGE:
        return 5;
      case this.UNIT_ABILITIES.BOMBER_DURATION:
        return 4;
      case this.UNIT_ABILITIES.UNIT_BOSS_HEALER_RANGE:
        return 100;
      case this.UNIT_ABILITIES.UNIT_BOSS_HEALER_NUM_TARGETS:
        return 4;
      case this.UNIT_ABILITIES.UNIT_BOSS_HEALER_AMOUNT:
        return 50 * playerMult;
    }
    throw new Exception("Failure");
  }
}

NumbersBalancer.prototype.PLAYER_STATS = {
  PLAYER_HEALTH: 'player_health'
}

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
}

NumbersBalancer.prototype.DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  NIGHTMARE: 'nightmare',
}

NumbersBalancer = new NumbersBalancer();
