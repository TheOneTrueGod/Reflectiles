class BulletSheetAbilityStyle extends SpriteAbilityStyle {
  constructor(defJSON) {
    super(defJSON);
    this.projectile_sprite = 'bullet_sheet';
    this.imageIndex = idx(defJSON, 'image_index', 0);
    this.colorIndex = idx(defJSON, 'color_index', 0);
  }

  rotateProjectile(projectile, sprite) {
    sprite.rotation = (projectile.angle + Math.PI / 2);
  }

  getSprite() {
    var top = 0;
    var left = 0;
    var bottom = 10;
    var right = 10;

    switch (this.imageIndex) {
      case 0:
        left = 462; top = 193; right = 479; bottom = 209
        break;
      case 1:
        left = 467; top = 216; right = 474; bottom = 228;
        break;
    }

    var baseTexture = PIXI.loader.resources[this.projectile_sprite].texture;
    var newSprite = new PIXI.Sprite(new PIXI.Texture(baseTexture,
        new PIXI.Rectangle(left, top, right - left, bottom - top)
      ));
    return newSprite;
  }

  static buildStyle() {
    toRet = super.buildStyle();
    toRet.style_name = 'BULLET_SHEET_SPRITE';
    return toRet;
  }
}

class BulletSheetSpriteAbilityStyleBuilder extends SpriteAbilityStyleBuilder {
  constructor() {
    super();
    this.image_index = 0;
  }

  setImageIndex(image_index) {
    this.image_index = image_index;
    return this;
  }

  build() {
    return {
      style_name: 'BULLET_SHEET_SPRITE',
      image_index: this.image_index
    };
  }
}
