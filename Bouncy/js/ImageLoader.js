class ImageLoader {
  static loadImages(callback) {
      PIXI.loader
        .add("byte_diamond_red", "/Bouncy/assets/enemies/byte_diamond_red.png")
        .add("enemy_boss_healer",  "/Bouncy/assets/enemies/enemy_boss_healer.png")
        .add("enemy_boss_slime",  "/Bouncy/assets/enemies/enemy_boss_slime.png")
        .add("enemy_boss_king",  "/Bouncy/assets/enemies/enemy_boss_king.png")
        .add("enemy_boss_wizard",  "/Bouncy/assets/enemies/enemy_boss_wizard.png")
        .add("enemy_boss_wizard_2",  "/Bouncy/assets/enemies/enemy_boss_wizard_2.png")
        .add("effect_heal",  "/Bouncy/assets/sprites/effect_heal.png")
        .add("core", "/Bouncy/assets/enemies/core.png")
        .add("sprite_explosion",  "/Bouncy/assets/sprites/explosion.png")
        .add("sprite_lightning_explosion",  "/Bouncy/assets/sprites/lightning_explosion.png")
        .add("purple_explosion",  "/Bouncy/assets/sprites/purple_explosion.png")
        .add("impact_hit",  "/Bouncy/assets/sprites/impact_hit.png")
        .add("bullet_sheet",  "/Bouncy/assets/sprites/bullet_sheet.png")
        .add("poison_sheet",  "/Bouncy/assets/sprites/poison_sheet.png")
        .add("weapons_sheet",  "/Bouncy/assets/sprites/weapons_sheet.png")
        .add("deployables", "/Bouncy/assets/sprites/deployables.png")
        .add("zone_icon_shield", "/Bouncy/assets/sprites/zone_icon_shield.png")
        .add("enemy_sheet", "/Bouncy/assets/enemies/Enemies.png")
        .load(callback);
  }

  static getEnemyTexture(sprite) {
    if (sprite in ImageLoader.spriteMap) {
      if (typeof ImageLoader.spriteMap[sprite] === typeof(3)) {
        var baseTexture = PIXI.loader.resources["enemy_sheet"].texture;
        let iWidth = baseTexture.width / 8;
        let iHeight = iWidth;
        let x = ImageLoader.spriteMap[sprite] % 8;
        let y = Math.floor(ImageLoader.spriteMap[sprite] / 8);

        ImageLoader.spriteMap[sprite] =
          new PIXI.Texture(baseTexture,
            new PIXI.Rectangle(
              x * iWidth, y * iHeight,
              iWidth, iHeight
            )
          );
      }
      return ImageLoader.spriteMap[sprite];
    }
    return PIXI.loader.resources[sprite].texture;
  }

  static getSquareTexture(sprite, index) {

    var baseTexture = PIXI.loader.resources[sprite].texture;
    return new PIXI.Texture(baseTexture,
        new PIXI.Rectangle(
          0, baseTexture.width * index,
          baseTexture.width, baseTexture.width
        )
      );
  }
}

ImageLoader.spriteMap = {
  enemy_square: 0, enemy_shoot: 1, enemy_bomber: 3, enemy_knight: 4, zone_shield: 5, enemy_protector: 6, zone_energy_shield: 7,
  enemy_strong: 8, enemy_fast: 9, enemy_shover: 10, enemy_diamond: 11, enemy_necromancer: 14, enemy_bone_wall: 15,
  enemy_castle_wall: 16, enemy_warlock: 17, enemy_skeleton: 18, enemy_blocker: 20, enemy_blocker_active: 21, enemy_damage_limit: 22, enemy_damage_limit_2: 23,
  zone_blocker_barrier: 24, enemy_slime: 25, fire_shard_0: 26, fire_shard_1: 27, fire_shard_2: 28, fire_shard_3: 29, enemy_ice_wall: 30
};
