class GameStats {
  constructor() {
    this.playerDamage = {};
  }

  reset() {
    this.playerDamage = {};
  }

  doNullPlayerCheck(player, ability) {
    if (this.playerDamage[player] === undefined) {
      this.playerDamage[player] = {};
    }
    if (this.playerDamage[player][ability] === undefined) {
      this.playerDamage[player][ability] = {damage: 0, uses: 0};
    }
  }

  addPlayerDamage(player, ability, amount) {
    if (isNaN(amount)) { return; }
    this.doNullPlayerCheck(player, ability);
    this.playerDamage[player][ability].damage += amount;
  }

  addAbilityUseCount(player, ability) {
    this.doNullPlayerCheck(player, ability);
    this.playerDamage[player][ability].uses += 1;
  }

  getExperienceEarned() {
    let damageDealt = 0;
    for (let playerID in this.playerDamage) {
      for (let ability in this.playerDamage[playerID]) {
        damageDealt += this.playerDamage[playerID][ability].damage;
      }
    }
    return Math.floor(damageDealt / 10);
  }

  serialize() {
    return {
      player_damage: this.playerDamage
    };
  }

  load(serialized) {
    if (serialized.player_damage) { this.playerDamage = serialized.player_damage; }
  }
}
