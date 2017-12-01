class BulletExplosionEffect {
  doEffect(boardState, projectile) {
    //AbilityDef.createFromJSON(this.positionEffectDef.ability_def);
    var num_bullets = 12;
    for (var j = 0; j < num_bullets; j++) {
      var angle = (Math.PI * 2 / num_bullets * j);

      boardState.addProjectile(
        Projectile.createProjectile(
          idx(this.hitEffectDef, 'projectile_type', ProjectileShape.ProjectileTypes.HIT),
          {x: projectile.x, y: projectile.y},
          null,
          angle,
          null,
          {
            //hit_effects: this.hitEffectDef['hit_effects'],
            speed: 4,
            size: Math.floor(projectile.size * 0.75),
            trail_length: Math.floor(projectile.trailLength * 0.75),
          }
        )//.addUnitHitCallback(this.projectileShape.unitHitCallback.bind(this.projectileShape))
      );
    }
  }
}
