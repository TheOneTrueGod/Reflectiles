class ProjectileWeakenBuff {
  constructor() {
    this.amount = 0.2;
  }

  getAmount() {
    return this.amount;
  }

  clone() {
    return new ProjectileWeakenBuff();
  }
}
