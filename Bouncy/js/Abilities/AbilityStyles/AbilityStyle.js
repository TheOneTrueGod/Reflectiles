class AbilityStyle {
  constructor(defJSON) {
    this.projectileColor = defJSON.color ? defJSON.color : 0xffffff
    //this.color = defJSON.
    this.explosionDef = defJSON.explosion;
    if (this.explosionDef) {
      this.explosionStyleList = [];
      for (var i = 0; i < this.explosionDef.style_defs.length; i++) {
        var style_def = this.explosionDef.style_defs[i];
        var style = AbilityStyle.loadFromJSON(style_def);
        this.explosionStyleList.push(style);
      }
    }
    this.trailDef = new ProjectileTrailDef(idx(defJSON, 'trail_def', null));
  }

  createProjectileSprite(projectile) {
    var sprite = new PIXI.Graphics();
    sprite.position.set(projectile.x, projectile.y);
    sprite.beginFill(this.projectileColor);
    sprite.drawCircle(0, 0, projectile.size);
    return sprite;
  }

  createProjectileTrail(boardState, projectile) {
    this.trailDef.createProjectileTrail(boardState, projectile);
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

    if (this.explosionDef.animationSpeed) {
      effect.setAnimationSpeed(this.explosionDef.animationSpeed);
    }

    if (this.explosionDef.radius !== 0) {
      let size = this.explosionDef.radius * 2;
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

  static getExplosionPrefab(type, radius) {
    if (!radius) {
      radius = 0;
    }
    switch (type) {
      case AbilityStyle.EXPLOSION_PREFABS.POISON:
        return {
          radius: radius,
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
          radius: radius,
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
      case AbilityStyle.EXPLOSION_PREFABS.LIGHTNING:
        return {
          radius: radius,
          style_defs: [
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('sprite_lightning_explosion').setCoordNums(0, 0, 44, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('sprite_lightning_explosion').setCoordNums(44, 0, 44 * 2, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('sprite_lightning_explosion').setCoordNums(44 * 2, 0, 44 * 3, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('sprite_lightning_explosion').setCoordNums(44 * 3, 0, 44 * 4, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('sprite_lightning_explosion').setCoordNums(44 * 4, 0, 44 * 5, 44)
              .build(),
          ]
        }
      case AbilityStyle.EXPLOSION_PREFABS.PURPLE_EXPLOSION:
        return {
          radius: radius,
          style_defs: [
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('purple_explosion').setCoordNums(0, 0, 44, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('purple_explosion').setCoordNums(44, 0, 44 * 2, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('purple_explosion').setCoordNums(44 * 2, 0, 44 * 3, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('purple_explosion').setCoordNums(44 * 3, 0, 44 * 4, 44)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('purple_explosion').setCoordNums(44 * 4, 0, 44 * 5, 44)
              .build(),
          ]
        }
      case AbilityStyle.EXPLOSION_PREFABS.IMPACT:
        return {
          radius: radius,
          style_defs: [
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('impact_hit').setCoordIndex(0, 0, 25, 25)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('impact_hit').setCoordIndex(1, 0, 25, 25)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('impact_hit').setCoordIndex(2, 0, 25, 25)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('impact_hit').setCoordIndex(3, 0, 25, 25)
              .build(),
            (new AbilitySheetSpriteAbilityStyleBuilder())
              .setSheet('impact_hit').setCoordIndex(4, 0, 25, 25)
              .build(),
          ]
        };
      case AbilityStyle.EXPLOSION_PREFABS.BLUE_PARTICLES:
        /*let defs = [];
        for (let y = 0; y < 4; y++) {
          for (let x = 8; x < 16; x++) {
            defs.push(
              (new AbilitySheetSpriteAbilityStyleBuilder())
                .setSheet('fusionGenesisExplosions').setCoordIndex(x, y, 64, 64)
                .build()
            );
          }
        }*/
        return {
          radius: radius,
          animationSpeed: 1,
          style_defs: defs
        };
    }
    return {};
  }
}

AbilityStyle.FALLBACK_STYLE = new AbilityStyle({});
AbilityStyle.EXPLOSION_PREFABS = {
  POISON: 'POISON',
  WHITE: 'WHITE',
  LIGHTNING: 'LIGHTNING',
  IMPACT: 'IMPACT',
  PURPLE_EXPLOSION: 'PURPLE_EXPLOSION',
  BLUE_PARTICLES: 'BLUE_PARTICLES',
};
