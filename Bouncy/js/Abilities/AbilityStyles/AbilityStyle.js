class AbilityStyle {
  constructor(defJSON) {
    this.explosionDef = defJSON.explosion;
    if (this.explosionDef) {
      this.explosionStyleList = [];
      for (var i = 0; i < this.explosionDef.style_defs.length; i++) {
        var style_def = this.explosionDef.style_defs[i];
        var style = AbilityStyle.loadFromJSON(style_def);
        this.explosionStyleList.push(style);
      }
    }
  }

  createProjectileSprite(projectile) {
    var sprite = new PIXI.Graphics();
    sprite.position.set(projectile.x, projectile.y);
    sprite.beginFill(0xffffff);
    sprite.drawCircle(0, 0, projectile.size);
    return sprite;
  }

  createProjectileTrail(boardState, projectile) {
    if (boardState.tick % 1 == 0) {
      boardState.addProjectile(
        new ProjectileTrailEffect(projectile, projectile.trailLength)
      );
    }
  }

  createExplosion(boardState, targetPos, projectile) {
    if (!this.explosionDef) {
      EffectFactory.createExplosionSpriteAtUnit(boardState, targetPos, 'sprite_explosion');
      return;
    }

    var effect = new CustomAnimatedSprite(
      {
        x: targetPos.x + (Math.random() * 0.1 - 0.05) * Unit.UNIT_SIZE,
        y: targetPos.y + (Math.random() * 0.1 - 0.05) * Unit.UNIT_SIZE
      },
      this.explosionStyleList.map((style) => {return style.getTexture(); })
    );
    if (this.explosionDef.size !== 0) {
      let size = this.explosionDef.size;
      let scaleX = size / effect.width;
      let scaleY = size / effect.height;
      effect.scale.x = scaleX;
      effect.scale.y = scaleY;
    }
    boardState.addEffect(effect);
  }

  rotateProjectile(projectile, sprite) { }

  static buildStyle() {
    return {style_name: 'ERROR'};
  }

  static loadFromJSON(json) {
    switch (json.style_name) {
      case 'COLORIZED':
        return new ColorizedAbilityStyle(json);
      case 'SPRITE':
        return new SpriteAbilityStyle(json);
      case 'BULLET_SHEET_SPRITE':
        return new BulletSheetAbilityStyle(json);
      case 'ABILITY_SHEET_SPRITE':
        return new AbilitySheetAbilityStyle(json);
      default:
        console.warn("AbilityStyle.loadFromJSON: unsupported style name; [" + json.style_name + "]");
        return new AbilityStyle(json);
    }
  }

  static getExplosionPrefab(type, size) {
    if (!size) {
      size = 0;
    }
    switch (type) {
      case AbilityStyle.EXPLOSION_PREFABS.POISON:
        return {
          size: size,
          style_defs: [
          (new AbilitySheetSpriteAbilityStyleBuilder())
            .setSheet('poison_sheet').setCoordNums(4, 17, 17, 29)
            .build(),
          (new AbilitySheetSpriteAbilityStyleBuilder()).setSheet('poison_sheet')
            .setSheet('poison_sheet').setCoordNums(21, 13, 41, 32)
            .build(),
          (new AbilitySheetSpriteAbilityStyleBuilder())
            .setSheet('poison_sheet').setCoordNums(46, 12, 68, 33)
            .build(),
          (new AbilitySheetSpriteAbilityStyleBuilder())
            .setSheet('poison_sheet').setCoordNums(74, 12, 96, 33)
            .build(),
          (new AbilitySheetSpriteAbilityStyleBuilder())
            .setSheet('poison_sheet').setCoordNums(102, 10, 128, 35)
            .build(),
          (new AbilitySheetSpriteAbilityStyleBuilder())
            .setSheet('poison_sheet').setCoordNums(137, 8, 164, 38)
            .build(),
        ]};
      case AbilityStyle.EXPLOSION_PREFABS.WHITE:
        return {
          size: size,
          style_defs: [
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('sprite_explosion').setCoordNums(0, 0, 44, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('sprite_explosion').setCoordNums(44, 0, 44 * 2, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('sprite_explosion').setCoordNums(44 * 2, 0, 44 * 3, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('sprite_explosion').setCoordNums(44 * 3, 0, 44 * 4, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('sprite_explosion').setCoordNums(44 * 4, 0, 44 * 5, 44)
              .build(),
          ]
        }
    }
    return {};
  }
}

AbilityStyle.FALLBACK_STYLE = new AbilityStyle({});
AbilityStyle.EXPLOSION_PREFABS = {
  POISON: 'POISON',
  WHITE: 'WHITE',
};
