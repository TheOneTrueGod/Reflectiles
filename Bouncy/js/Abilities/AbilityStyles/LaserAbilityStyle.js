class SpriteAbilityStyle extends AbilityStyle {
  constructor(defJSON) {
    super(defJSON);
    this.projectile_sprite = idx(defJSON, 'projectile_sprite', 'bullet_sheet');
    this.trail = idx(defJSON, 'trail', null);
    this.scale = 1;
  }

  getSprite() {
    var baseTexture = PIXI.loader.resources[this.projectile_sprite].texture;
    var newSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture,
        new PIXI.Rectangle(baseTexture.height * 0 /* index */, 0, baseTexture.height, baseTexture.height)
      ));
    return newSprite;
  }

  createProjectileTrail(boardState, projectile) {
    if (this.trail === null) { return; }
    if (!projectile.trail_data) {
      projectile.trail_data = [];
      console.log(projectile.lastCollisionPoint);
    }
  }

  createProjectileSprite(projectile) {
    var container = new PIXI.Container();
    container.position.set(projectile.x, projectile.y);

    var newSprite = this.getSprite();
    newSprite.anchor.set(0.5);
    container.addChild(newSprite);
    container.scale.set(this.scale);
    return newSprite;
  }

  static buildStyle() {
    return {
      style_name: 'SPRITE'
    }
  }
}

class SpriteAbilityStyleBuilder {
  build() {
    return {
      style_name: 'SPRITE'
    };
  }
}
