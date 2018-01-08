class ProjectileDamageBuff {
  constructor() {
    this.amount = 1.2;
  }

  getAmount() {
    return this.amount;
  }

  clone() {
    return new ProjectileDamageBuff();
  }
}
