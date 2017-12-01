class AbilitySheetAbilityStyle extends SpriteAbilityStyle {
  constructor(defJSON) {
    super(defJSON);
    this.projectile_sprite = idx(defJSON, 'sheet', 'bullet_sheet');
    this.imageIndex = idx(defJSON, 'image_index', 0);
    this.colorIndex = idx(defJSON, 'color_index', 0);
    this.coords = idx(defJSON, 'coords', null);
    this.rotation = idx(defJSON, 'rotation', Math.PI / 2);
    this.fix_rotation = idx(defJSON, 'fix_rotation', false);
    this.scale = idx(defJSON, 'scale', 1);
  }

  rotateProjectile(projectile, sprite) {
    if (this.fix_rotation) {
      sprite.rotation = this.rotation;
    } else {
      sprite.rotation = (projectile.angle + this.rotation);
    }
  }

  getCoords() {
    if (this.coords) { return this.coords; }
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

    return {left: left, right: right, top: top, bottom: bottom};
  }

  getTexture() {
    var coords = this.getCoords();
    var baseTexture = PIXI.loader.resources[this.projectile_sprite].texture;
    return new PIXI.Texture(baseTexture,
        new PIXI.Rectangle(
          coords.left, coords.top,
          coords.right - coords.left, coords.bottom - coords.top
        )
      );
  }

  getSprite() {
    var newSprite = new PIXI.Sprite(this.getTexture());
    newSprite.scale = {x: this.scale, y: this.scale};
    return newSprite;
  }

  static buildStyle() {
    toRet = super.buildStyle();
    toRet.style_name = 'ABILITY_SHEET_SPRITE';
    return toRet;
  }
}

class AbilitySheetSpriteAbilityStyleBuilder extends SpriteAbilityStyleBuilder {
  constructor() {
    super();
    this.image_index = 0;
    this.sheet = 'bullet_sheet';
    this.coords = null;
    this.rotation = Math.PI / 2;
    this.explosion = null;
    this.fix_rotation = false;
  }

  setImageIndex(image_index) {
    this.image_index = image_index;
    return this;
  }

  setSheet(sheet) { this.sheet = sheet; return this; }
  setCoords(coords) { this.coords = coords; return this; }
  setCoordNums(left, top, right, bottom) {
    this.coords = {left: left, top: top, right: right, bottom: bottom};
    return this;
  }
  setRotation(rotation) { this.rotation = rotation; return this; }
  setExplosion(explosion) { this.explosion = explosion; return this; }
  fixRotation(val) { this.fix_rotation = val; return this; }

  createObject() {
    return new AbilitySheetAbilityStyle(this.build());
  }

  build() {
    return {
      style_name: 'ABILITY_SHEET_SPRITE',
      image_index: this.image_index,
      coords: this.coords,
      rotation: this.rotation,
      sheet: this.sheet,
      explosion: this.explosion,
      fix_rotation: this.fix_rotation,
    };
  }
}
