// ======================
// STATS
// ======================

const SPEED = {
  SLOW_SPEED: 4,
  NORMAL_SPEED: 7,
  FAST_SPEED: 9,
  FRENETIC_SPEED: 11, //  resistance fragile.
};
const RESISTANCE_HP = {
  FRAGILE: 100, // size small
  NORMAL: 120, //size normal
  TANK: 150, // size giant
};
const POWER = {
  WEAK_POWER: 5,
  NORMAL_POWER: 10,
  STRONG_POWER: 15,
};
const WEIGHT = {
  LIGHT: 0.7, // size normal (pode ser small, vai depender do design)
  MEDIUM: 1, //  size normal
  HEAVY: 1.5, // size giant
};
const SIZE = {
  SMALL: 62,
  NORMAL: 70,
  GIANT: 90,
};


// ======================
// CHARACTERS
// ======================

const characters = [
  // C0 - Van - UNARMED
  {
    name: "Van",

    archetype: null,
    portrait: assets.portraits.van,
    hudPortrait: null, // ainda sem arte de moldura para o HUD
    sub_archetype: sub_archetypes.Aggressive,

    radius: SIZE.NORMAL,

    activeBar: 0,
    activeBarMax: 100,

    ultimateBar: 0,
    ultimateBarMax: 100,

    skillData: {},

    FighterType: {
      weightClass: "Light",

      knockbackResistance: WEIGHT.LIGHT,
    },
    stats: {
      hp: RESISTANCE_HP.NORMAL,
      maxHp: RESISTANCE_HP.NORMAL,

      unarmedDamage: 5,
      power: POWER.STRONG_POWER,
      unarmedCrit: 0.15,

      evade: 0.05,
      speed: SPEED.FAST_SPEED,
      maxSpeed: null,
    },

    weapon: null,

    skills: {
      passive: "Rainbolt",
      active: "Shockwave",
      ultimate: null,
    },
  },

  // C1 - Lance - SWORD USER

  {
     id: "lance",
    name: "Lance",
    archetype: null,
    portrait: assets.portraits.lance,
    hudPortrait: "../assets/portrait/lance/lanceFramePortrait.jpeg",
    sub_archetype: sub_archetypes.LanceBehavior,
    radius: SIZE.NORMAL,

    activeBar: 0,
    activeBarMax: 100,

    ultimateBar: 0,
    ultimateBarMax: 100,

    skillData: {},

    FighterType: {
      weightClass: "Medium",

      knockbackResistance: WEIGHT.MEDIUM,
    },

    stats: {
      hp: RESISTANCE_HP.FRAGILE,
      maxHp: RESISTANCE_HP.FRAGILE,

      unarmedDamage: 0,
      power: POWER.WEAK_POWER,
      unarmedCrit: 0,

      evade: 0.05,
      speed: SPEED.NORMAL_SPEED,
      maxSpeed: null,
    },

    weapon: {
       showHitbox: false,
      type: "orbit",
      name: "sword",
  
      pivotX:60,
      pivotY: 80,


      
      sprite: assets.weapons.sword,
      spriteWidth: 120,
      spriteHeight: 120,

     spriteAngle: 0.75,
      hitbox: {
        type: "capsule",
       
        length: 110,
        radius: 12,
      },

      orbitRadius: 60,
      rotationSpeed: 0.10,

      damage: 3,
      knockback: 2,
      crit: 0.1,

      originType: "edge",
    },

    skills: {
      passive: "vampirism",
      active: "SwordDance",
      ultimate: null,
    },
  },

  // C2 - Stephany Warstinger - Fighter

  {
    id: "stephanny",
    name: "Stephany",
    archetype: null,
    portrait: assets.portraits.stephanny,
    hudPortrait: "../assets/portrait/stephanny/stephannyFramePortrait.png",
    sub_archetype: sub_archetypes.StephannyBehavior,
    radius: SIZE.SMALL,

    activeBar: 0,
    activeBarMax: 100,

    ultimateBar: 0, 
    ultimateBarMax: 100,

    skillData: {},

    FighterType: {
      weightClass: "Medium",

      knockbackResistance: WEIGHT.MEDIUM,
    },

    stats: {
      hp: RESISTANCE_HP.FRAGILE,
      maxHp: RESISTANCE_HP.FRAGILE,

      unarmedDamage: 0,
      power: POWER.NORMAL_POWER,
      unarmedCrit: 0,

      evade: 0.05,
      speed: SPEED.FRENETIC_SPEED,
      maxSpeed: null,
    },

    weapon: {
      
      showHitbox: false,
      type: "chain",

      name: "tail",

      damage: 3,
      knockback: 2,
      crit: 0.1,


       sprite: assets.weapons.stephannyTail,

      chain: {
        
        targetLength: 40,

        segmentLength: 40,

        followSpeed: 0.13,
        spinTimer: 180,


        spriteHeight: 40,

        // pequena sobreposição entre os pedaços
        spriteOverlap: 2,

        // como a imagem já aponta da esquerda para direita
        spriteAngle: 0,

    spriteOffsetX: -20,    // move ao longo da cauda
    spriteOffsetY: 0,     // move para os lados da hitbox



        history: [],

        spinDuration: 90,
        spinTime: 0,

        isSpinning: false,

        spinAngle: 0,

        spinSpeed: 0.25,

        segments: [

  { radius: 11, x: 0, y: 0 },
  { radius: 9, x: 0, y: 0 },
  { radius: 7, x: 0, y: 0 },
  { radius: 6, x: 0, y: 0 },
  { radius: 3, x: 0, y: 0 },
  { radius: 2, x: 0, y: 0 },

        ],
      },
    },

    skills: {
      passive: "poison",
      active: "poison2",
      ultimate: null,
    },
  },
  
  
  // C1 - Lance - SWORD USER

  {
     id: "ellios",
    name: "Ellios Logan",
    archetype: null,
    portrait: assets.portraits.ellios ,
    hudPortrait: "../assets/portrait/ellios/elliosFramePortrait.jpeg",
    sub_archetype: sub_archetypes.elliosBehavior,
    radius: SIZE.GIANT,

    activeBar: 0,
    activeBarMax: 100,

    ultimateBar: 0,
    ultimateBarMax: 100,

    skillData: {},

    FighterType: {
      weightClass: "Medium",

      knockbackResistance: WEIGHT.MEDIUM,
    },

    stats: {
      hp: RESISTANCE_HP.FRAGILE,
      maxHp: RESISTANCE_HP.FRAGILE,

      unarmedDamage: 0,
      power: POWER.WEAK_POWER,
      unarmedCrit: 0,

      evade: 0.05,
      speed: SPEED.NORMAL_SPEED,
      maxSpeed: null,
    },

    weapon: {
       showHitbox: false,
      type: "orbit",
      name: "sword",
  
      pivotX:60,
      pivotY: 80,


      
      sprite: assets.weapons.sword,
      spriteWidth: 120,
      spriteHeight: 120,

     spriteAngle: 0.75,
      hitbox: {
        type: "capsule",
       
        length: 110,
        radius: 12,
      },

      orbitRadius: 60,
      rotationSpeed: 0.10,

      damage: 3,
      knockback: 2,
      crit: 0.1,

      originType: "edge",
    },

    skills: {
      passive: "vampirism",
      active: "SwordDance",
      ultimate: null,
    },
  },


];
