class GameStats {
  constructor() {
    this.playerDamage = {};
  }

  addPlayerDamage(player, amount) {
    if (this.playerDamage[player] === undefined) {
      this.playerDamage[player] = 0;
    }

    this.playerDamage[player] += amount;
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
