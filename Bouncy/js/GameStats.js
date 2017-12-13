class GameStats {
  constructor() {
    this.playerDamage = {};
  }

  addPlayerDamage(player, ability, amount) {
    if (this.playerDamage[player] === undefined) {
      this.playerDamage[player] = {};
    }
    if (this.playerDamage[player][ability] === undefined) {
      this.playerDamage[player][ability] = 0;
    }

    this.playerDamage[player][ability] += amount;
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
