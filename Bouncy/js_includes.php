<script type="text/javascript" src="/vendor/pixi/pixinew.js"></script>
<script type="text/javascript" src="/vendor/pixi/pixi-filters.js"></script>
<script type="text/javascript" src="/vendor/victor/victor.js"></script>
<script type="text/javascript" src="/vendor/physics/physics.js"></script>
<script type="text/javascript" src="/vendor/twbs/tether/dist/js/tether.js"></script>
<script type="text/javascript" src="/vendor/twbs/bootstrap/dist/js/bootstrap.js"></script>

<!-- Utils are free floating functions.  They go first. -->
<script src="/client/utils.js"></script>
<script src="/client/ServerCalls.js"></script>
<script src="/client/GameInitializer.js"></script>
<script src="/Bouncy/js/Enums/TurnPhases.js"></script>
<script src="/Bouncy/js/ImageLoader.js"></script>

<!-- Order of these doesn't matter.  They're all classes -->
<script src="/Bouncy/js/GameElements/Unit.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/Projectile.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/AbilitySource.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/ProjectileCurveHandler.js"></script>
<script src="/Bouncy/js/BoardState.js"></script>
<script src="/Bouncy/js/GameStats.js"></script>
<script src="/Bouncy/js/Board/UnitSectors.js"></script>
<script src="/Bouncy/js/Abilities/AbilityFactory.js"></script>
<script src="/Bouncy/js/Abilities/AbilityPerkNode.js"></script>
<script src="/Bouncy/js/Abilities/AbilityCores/AbilityCore.js"></script>
<script src="/Bouncy/js/Abilities/AbilityDef.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityShapes/ProjectileShape.js"></script>
<script src="/Bouncy/js/Abilities/AbilityStyles/AbilityStyle.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/HitEffect.js"></script>
<script src="/Bouncy/js/Abilities/PositionBasedEffects/PositionBasedEffect.js"></script>
<script src="/Bouncy/js/Abilities/AbilityCardBuilder.js"></script>
<script src="/Bouncy/js/PlayerCommands/PlayerCommand.js"></script>
<script src="/Bouncy/js/PlayerInput.js"></script>
<script src="/Bouncy/js/UIListeners.js"></script>
<script src="/Bouncy/js/TurnControls.js"></script>
<script src="/Bouncy/js/AIDirector/AIDirector.js"></script>
<script src="/Bouncy/js/AIDirector/SpawnFormations.js"></script>
<script src="/Bouncy/js/AIDirector/UnitsToSpawn.js"></script>
<script src="/Bouncy/js/AIDirector/NumbersBalancer.js"></script>
<script src="/Bouncy/js/AIDirector/UnitTooltips.js"></script>
<script src="/Bouncy/js/AIDirector/LevelDefs.js"></script>
<script src="/Bouncy/js/AIDirector/LevelDefs/LevelDefsWorld1.js"></script>
<script src="/Bouncy/js/AIDirector/LevelDefs/LevelDefsWorld2.js"></script>
<script src="/Bouncy/js/AIDirector/LevelDefs/LevelDefsWorld3.js"></script>
<script src="/Bouncy/js/AIDirector/LevelDefs/LevelDefsWorld4.js"></script>
<script src="/Bouncy/js/AIDirector/LevelDefs/LevelDefsWorld5.js"></script>
<script src="/Bouncy/js/Players/Player.js"></script>
<script src="/Bouncy/js/Players/PlayerDeck.js"></script>
<script src="/Bouncy/js/Players/PlayerCard.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/StatusEffects/StatusEffect.js"></script>
<script src="/Bouncy/js/GameElements/GameLines.js"></script>
<script src="/Bouncy/js/GameElements/Effects/EffectFactory.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/ProjectileBuffs/ProjectileDamageBuff.js"></script>
<script src="/Bouncy/js/Errors/Errors.js"></script>

<!-- Extends the above -->
<script src="/Bouncy/js/GameElements/Enemies/UnitBasic.js"></script>
<script src="/Bouncy/js/GameElements/ZoneEffect.js"></script>
<script src="/Bouncy/js/GameElements/UnitCore.js"></script>
<script src="/Bouncy/js/PlayerCommands/PlayerCommandUseAbility.js"></script>
<script src="/Bouncy/js/PlayerCommands/PlayerCommandMove.js"></script>
<script src="/Bouncy/js/GameElements/Effects/Effect.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/SpriteLerpProjectile.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityDef.js"></script>
<script src="/Bouncy/js/Abilities/PlayerMoveAbilityDef.js"></script>
<script src="/Bouncy/js/Abilities/PositionBasedAbilityDef.js"></script>
<script src="/Bouncy/js/Abilities/ZoneAbilityDef.js"></script>
<script src="/Bouncy/js/Abilities/Targetting/AbilityTargetCalculations.js"></script>
<script src="/Bouncy/js/Abilities/TargettingDrawHandler.js"></script>
<script src="/Bouncy/js/Abilities/SummonUnitAbilityDef.js"></script>
<script src="/Bouncy/js/Abilities/MultipartAbilityDef.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityShapes/ProjectileShapeSingleShot.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityShapes/ProjectileShapeTriShot.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityShapes/ProjectileShapeChainShot.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityShapes/ProjectileShapeSprayShot.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityShapes/ProjectileShapeRainShot.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityShapes/ProjectileShapeBulletExplosion.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityShapes/ProjectileShapeWave.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityShapes/ProjectileShapeDoubleWave.js"></script>
<script src="/Bouncy/js/Abilities/ProjectileAbilityShapes/ProjectileShapeInstantAoE.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/StandardProjectile.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/PenetrateProjectile.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/TimeoutProjectile.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/FrozenOrbProjectile.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/EnemyProjectile.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/GhostProjectile.js"></script>
<script src="/Bouncy/js/GameElements/Projectiles/GrenadeProjectile.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/StatusEffects/PoisonStatusEffect.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/StatusEffects/InfectStatusEffect.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/StatusEffects/FreezeStatusEffect.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/StatusEffects/ImmobilizeStatusEffect.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/StatusEffects/WeaknessStatusEffect.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/StatusEffects/ShieldStatusEffect.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/StatusEffects/PlayerDamageStatusEffect.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/PoisonHitEffect.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/InfectHitEffect.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/FreezeHitEffect.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/WeaknessHitEffect.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/DamageHitEffect.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/BulletSplitHitEffect.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/CooldownReductionHitEffect.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/ShooterBuffEffect.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/NegativeConditionModifierHitEffect.js"></script>
<script src="/Bouncy/js/Abilities/HitEffects/ApplyDamageOverTimeEffectHitEffect.js"></script>
<script src="/Bouncy/js/Abilities/PositionBasedEffects/BulletExplosionEffect.js"></script>
<script src="/Bouncy/js/Abilities/PositionBasedEffects/UseAbilityEffect.js"></script>
<script src="/Bouncy/js/Abilities/AbilityStyles/SpriteAbilityStyle.js"></script>
<script src="/Bouncy/js/Abilities/AbilityStyles/BulletSheetAbilityStyle.js"></script>
<script src="/Bouncy/js/Abilities/AbilityStyles/AbilitySheetAbilityStyle.js"></script>
<script src="/Bouncy/js/Abilities/AbilityStyles/ColorizedAbilityStyle.js"></script>
<script src="/Bouncy/js/Abilities/AbilityCores/AbilityConstants.js"></script>
<script src="/Bouncy/js/Abilities/AbilityCores/AbilityList.js"></script>
<?php
  for ($i = 0; $i < 5; $i++) {
?>
    <script src="/Bouncy/js/Abilities/AbilityCores/WeaponAbilityCores/AbilityCore<?php echo $i; ?>.js"></script>
    <script src="/Bouncy/js/Abilities/AbilityCores/DefenderAbilityCores/AbilityCore<?php echo $i + 5; ?>.js"></script>
    <script src="/Bouncy/js/Abilities/AbilityCores/ChaosAbilityCores/AbilityCore<?php echo $i + 10; ?>.js"></script>
    <script src="/Bouncy/js/Abilities/AbilityCores/PoisonAbilityCores/AbilityCore<?php echo $i + 15; ?>.js"></script>
    <script src="/Bouncy/js/Abilities/AbilityCores/EngineerAbilityCores/AbilityCore<?php echo $i + 20; ?>.js"></script>
<?php
  }
?>
<script src="/Bouncy/js/Abilities/AbilityCores/DefenderAbilityCores/AbilityCore25.js"></script>
<script type="text/javascript">
  <?
  foreach (glob('Bouncy/js/Abilities/AbilityCores/NewCores/*.js') as $file)
  {
    if (strpos($file, 'Template') === False) {
      readfile($file);
    }
  }
  ?>
</script>

<!-- Extends the above -->
<script src="/Bouncy/js/GameElements/Effects/LineEffect.js"></script>
<script src="/Bouncy/js/GameElements/Effects/SpriteEffect.js"></script>
<script src="/Bouncy/js/GameElements/Effects/SpriteShatterEffect.js"></script>
<script src="/Bouncy/js/GameElements/Effects/CircleEffect.js"></script>
<script src="/Bouncy/js/GameElements/Effects/ProjectileTrailEffect.js"></script>
<script src="/Bouncy/js/GameElements/Effects/ProjectileShadowEffect.js"></script>
<script src="/Bouncy/js/GameElements/Effects/CustomAnimatedSprite.js"></script>
<script src="/Bouncy/js/GameElements/Deployables/Turret.js"></script>
<script src="/Bouncy/js/GameElements/Deployables/Landmine.js"></script>
<script src="/Bouncy/js/GameElements/Deployables/PushableExplosive.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitBasicSquare.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitBomber.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitKnight.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitDefensive.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitProtector.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitBossHealer.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitBossWarlock.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitBossKing.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitBossGrandWizard.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitBasicDiamond.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitFast.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitHeavy.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitShover.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitShooter.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitBlocker.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitSlime.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitSkeleton.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitNecromancer.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitCastleWall.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitIceWall.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitFireShard.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitSpawningPlaceholder.js"></script>

<script src="/Bouncy/js/GameElements/Enemies/EnemyAbilities/EnemyAbility.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/EnemyAbilities/EnemyAbilitySummonUnits.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/EnemyAbilities/EnemyAbilitySummonFireShards.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/EnemyAbilities/EnemyAbilitySummonIceWall.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/EnemyAbilities/EnemyAbilityShootProjectile.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/EnemyAbilities/EnemyAbilityShieldWall.js"></script>

<script src="/Bouncy/js/GameElements/Enemies/UnitBossSlime.js"></script>
<script src="/Bouncy/js/GameElements/Enemies/UnitMovementEffects.js"></script>

<script src="/Bouncy/js/Players/testing_decks/TJDeck.js"></script>
<script src="/Bouncy/js/Players/testing_decks/ChipDeck.js"></script>
<script src="/Bouncy/js/Players/testing_decks/TestDeck.js"></script>
<script src="/Bouncy/js/Players/testing_decks/TabithaDeck.js"></script>
<script src="/Bouncy/js/Players/testing_decks/SeanDeck.js"></script>
<script src="/Bouncy/js/Players/testing_decks/ClarenceDeck.js"></script>

<script src="/Bouncy/js/Players/AbilityManager.js"></script>

<!-- MUST GO LAST -->
<script src="/Bouncy/js/main.js"></script>
