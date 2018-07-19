class ProjectileShadowEffect extends ProjectileTrailEffect {
  createSprite() {
    let sprite = AbilityStyle.FALLBACK_STYLE.createProjectileSprite(this.projectile);
    this.updateScale(sprite);
    return sprite;
  }
}
