class ImageLoader {
  static loadImages(callback) {
      PIXI.loader
        .add("byte_diamond_red", "/Bouncy/assets/enemies/byte_diamond_red.png")
        .add("enemy_square",  "/Bouncy/assets/enemies/enemy_square.png")
        .add("enemy_fast",  "/Bouncy/assets/enemies/enemy_fast.png")
        .add("enemy_diamond",  "/Bouncy/assets/enemies/enemy_diamond.png")
        .add("enemy_shoot",  "/Bouncy/assets/enemies/enemy_shoot.png")
        .add("enemy_shover",  "/Bouncy/assets/enemies/enemy_shover.png")
        .add("enemy_strong",  "/Bouncy/assets/enemies/enemy_strong.png")
        .add("enemy_bomber",  "/Bouncy/assets/enemies/enemy_bomber.png")
        .add("enemy_boss_healer",  "/Bouncy/assets/enemies/enemy_boss_healer.png")
        .add("enemy_knight",  "/Bouncy/assets/enemies/enemy_knight.png")
        .add("enemy_blocker",  "/Bouncy/assets/enemies/enemy_blocker.png")
        .add("enemy_blocker_active",  "/Bouncy/assets/enemies/enemy_blocker_active.png")
        .add("enemy_slime",  "/Bouncy/assets/enemies/enemy_slime.png")
        .add("enemy_skeleton",  "/Bouncy/assets/enemies/enemy_skeleton.png")
        .add("enemy_warlock",  "/Bouncy/assets/enemies/enemy_warlock.png")
        .add("enemy_damage_limit",  "/Bouncy/assets/enemies/enemy_damage_limit.png")
        .add("enemy_damage_limit_2",  "/Bouncy/assets/enemies/enemy_damage_limit_2.png")
        .add("enemy_necromancer",  "/Bouncy/assets/enemies/enemy_necromancer.png")
        .add("enemy_castle_wall",  "/Bouncy/assets/enemies/enemy_castle_wall.png")
        .add("enemy_ice_wall",  "/Bouncy/assets/enemies/enemy_ice_wall.png")
        .add("enemy_bone_wall",  "/Bouncy/assets/enemies/enemy_bone_wall.png")
        .add("enemy_boss_slime",  "/Bouncy/assets/enemies/enemy_boss_slime.png")
        .add("enemy_boss_king",  "/Bouncy/assets/enemies/enemy_boss_king.png")
        .add("enemy_boss_wizard",  "/Bouncy/assets/enemies/enemy_boss_wizard.png")
        .add("enemy_boss_wizard_2",  "/Bouncy/assets/enemies/enemy_boss_wizard_2.png")
        .add("fire_shard_0",  "/Bouncy/assets/enemies/fire_shard_0.png")
        .add("fire_shard_1",  "/Bouncy/assets/enemies/fire_shard_1.png")
        .add("fire_shard_2",  "/Bouncy/assets/enemies/fire_shard_2.png")
        .add("fire_shard_3",  "/Bouncy/assets/enemies/fire_shard_3.png")
        .add("zone_shield",  "/Bouncy/assets/sprites/zone_shield.png")
        .add("zone_blocker_barrier",  "/Bouncy/assets/enemies/zone_blocker_barrier.png")
        .add("enemy_protector",  "/Bouncy/assets/enemies/enemy_protector.png")
        .add("zone_energy_shield",  "/Bouncy/assets/sprites/zone_energy_shield.png")
        .add("effect_heal",  "/Bouncy/assets/sprites/effect_heal.png")
        .add("core", "/Bouncy/assets/enemies/core.png")
        .add("sprite_explosion",  "/Bouncy/assets/sprites/explosion.png")
        .add("impact_hit",  "/Bouncy/assets/sprites/impact_hit.png")
        .add("bullet_sheet",  "/Bouncy/assets/sprites/bullet_sheet.png")
        .add("poison_sheet",  "/Bouncy/assets/sprites/poison_sheet.png")
        .add("weapons_sheet",  "/Bouncy/assets/sprites/weapons_sheet.png")
        .add("deployables", "/Bouncy/assets/sprites/deployables.png")
        .add("zone_icon_shield", "/Bouncy/assets/sprites/zone_icon_shield.png")
        .load(callback);
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
