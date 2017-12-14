class GameStats {
  constructor() {
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

  serialize() {
    return {
      player_damage: this.playerDamage
    };
  }

  load(serialized) {
    if (serialized.player_damage) { this.playerDamage = serialized.player_damage; }
  }
}
