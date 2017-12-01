class ColorizedAbilityStyle extends AbilityStyle {
  constructor(defJSON) {
    super(defJSON);
    this.color = idx(defJSON, 'color', 0xFFFFFF);
    this.size = idx(defJSON, 'size', 5);
  }

  createProjectileSprite(projectile) {
    var sprite = new PIXI.Graphics();
    sprite.position.set(projectile.x, projectile.y);
    sprite.beginFill(this.color);
    sprite.drawCircle(0, 0, this.size);
    return sprite;
  }

  static buildStyle(color) {
    return {
      style_name: 'COLORIZED',
      color: color,
    };
  }
}
