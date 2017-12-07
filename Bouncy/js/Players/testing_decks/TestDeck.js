function TestDeck() {
  var abilities = [
    {
      ability_type: AbilityDef.AbilityTypes.PROJECTILE,
      shape: "TRI_SHOT",
      projectile_type: ProjectileShape.ProjectileTypes.HIT,
      num_bullets: 3,
      hit_effects:[{"effect": ProjectileShape.HitEffects.DAMAGE,"base_damage":200}]
    },
    {
      ability_type: AbilityDef.AbilityTypes.ZONE,
      unit_interaction: {
        prevent_unit_entry: true,
        unit_enter:[{
          effect: "ABILITY",
          ability_source: "BELOW_UNIT",
          abil_def: {
            "ability_type": AbilityDef.AbilityTypes.PROJECTILE,
            "shape": ProjectileAbilityDef.Shapes.SINGLE_SHOT,
            "projectile_type":"PENETRATE",
            "hit_effects":[{"effect": ProjectileShape.HitEffects.DAMAGE, "base_damage":400}]
          }
        }]
      },
      projectile_interaction: {enemy_projectiles: {destroy: true}},
      duration: 6,
      zone_size: {left:1, right:1, top:0, bottom:0, y_range: 0},
      max_range: {left: 5, right: 5, top: 1, bottom: 1},
      unit_enter_effect: {},
      icon: "../Bouncy/assets/icons/icon_plain_shield.png",
      charge: {"initial_charge":-1,"max_charge":3,"charge_type":"TURNS"},
    }
  ];
  for (var i = 0; i < abilities.length; i++) {
    abilities[i] = AbilityDef.createFromJSON(abilities[i]);
  }
  return abilities;
}
