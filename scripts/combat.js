const POWER_PRIORITY = 1.5;
const SPEED_PRIORITY = 0.25;
const SPEED_STAT_PRIORITY = 0.4;
const DAMAGE_SPEED_SCALE = 0.4;
const CRIT_MULTI = 2;
const PRIORITY_RANDOM_SCALE = 3;
const PRIORITY_ADVANTAGE = 1;
const WINNER_DAMAGE_REDUCTION = 0.7;
const HIT_COOLDOWN = 20;


// ======================
// EVADE
// ======================

function checkEvade(target) {
  return Math.random() < target.stats.evade;
}


// ======================
// BODY COMBAT
// ======================

function bodyCombat(attacker, target) {
  

  // somente personagem sem arma causa body damage
  if (attacker.weapon) {
    return;
  }

  if (attacker.hitCooldown > 0) {
    return;
  }


  if (checkEvade(target)) {
    console.log(target.character.name, " dodge");
    return;
  }

  const damage = attacker.stats.unarmedDamage;


  let isCritical = false;

  if (Math.random() < attacker.unnarmedCrit) {
    damage *= CRIT_MULTI;
    
    isCritical = true;
  }


  target.hp -= damage;
  target.hp = Math.max(0, target.hp);

  const characterName = attacker.character.name;
  const active = skill[characterName].active;

  addActiveMeter(attacker, active.chargeHit);

  

  // Eventos genéricos de dano devem existir
  // independentemente da origem do ataque.
  damageTaken(target, attacker, damage);
  damageDealt(attacker, target, damage);


  if (isCritical) {
    criticalHit(attacker, target, damage);
    console.log("Unarmed CRIT");
  }

  createDamageText(
    target.x,
    target.y,
    damage,
  );

  console.log(attacker.character.name + " HIT  🔴");



  attacker.hitCooldown = HIT_COOLDOWN;
}


// ======================
// WEAPON COMBAT
// ======================

function weaponCombat(attacker, target) {
  
  
    // ======================
  // 1. VALIDAR ATAQUE
  // ======================

  if (!attacker.weapon) {
    return;
  }

  if (attacker.hitCooldown > 0) {
    return;
  }

  const weapon = attacker.weapon;

  // ======================
  // 2. CALCULAR DANO
  // ======================

  let damage = weapon.damage;
  let isCritical = false;

  if (Math.random() < weapon.crit) {
    damage *= CRIT_MULTI;
    isCritical = true;
  }

  // ======================
  // 3. APLICAR DANO
  // ======================

  target.hp -= damage;
  target.hp = Math.max(0, target.hp);

  // ======================
  // 4. CARREGAR ACTIVE
  // ======================

  const characterName = attacker.character.name;
  const active = skill[characterName].active;

  addActiveMeter(attacker, active.chargeHit);

  // ======================
  // 5. GERAR EVENTOS
  // ======================

  // Primeiro os eventos genéricos de dano.
  damageTaken(target, attacker, damage);
  damageDealt(attacker, target, damage);

  // Depois os eventos específicos do golpe.
  weaponHit(attacker, target, damage);

  if (isCritical) {
    criticalHit(attacker, target, damage);
    console.log("WEAPON CRIT");
  }

  // ======================
  // 6. FEEDBACK VISUAL
  // ======================

  createDamageText(
    target.x,
    target.y,
    damage,
  );

  console.log(attacker.character.name + " hit 🔵");

  // ======================
  // 7. KNOCKBACK
  // ======================

  if (weapon.knockback !== 0) {
    const dx = target.x - attacker.x;
    const dy = target.y - attacker.y;
    const dist = Math.hypot(dx, dy);

    if (dist !== 0) {
      const nx = dx / dist;
      const ny = dy / dist;

      const force =
        weapon.knockback +
        attacker.stats.power;

      target.physicsVx +=
        (nx * force) /
        target.FighterType;

      target.physicsVy +=
        (ny * force) /
        target.FighterType;
    }
  }

  // ======================
  // 8. COOLDOWN
  // ======================

  attacker.hitCooldown = HIT_COOLDOWN;
}


// ======================
// UNARMED COMBAT
// ======================

function unarmedCombat(player1, player2) {


    // somente unarmed
    if(
        player1.weapon ||
        player2.weapon
    ){
        return;
    }


    // cooldown
    if (

        player1.hitCooldown > 0 ||

        player2.hitCooldown > 0

    ) {

        return;
    }

const p1Evade = checkEvade(player1)

const p2Evade = checkEvade(player2)

    // ======================
    // VELOCIDADE REAL
    // ======================

 const speed1 =
Math.hypot(
player1.moveVx * player1.stats.speed +
player1.physicsVx,

player1.moveVy * player1.stats.speed +
player1.physicsVy
);

const speed2 =
Math.hypot(
player2.moveVx * player2.stats.speed +
player2.physicsVx,

player2.moveVy * player2.stats.speed +
player2.physicsVy
);   


    // ======================
    // PRIORIDADE
    // ======================

    let priorityP1 =

    (player1.stats.power * POWER_PRIORITY) +

    (speed1 * SPEED_PRIORITY) +

    (player1.stats.speed * SPEED_STAT_PRIORITY);



    let priorityP2 =

    (player2.stats.power * POWER_PRIORITY) +

    (speed2 * SPEED_PRIORITY) +

    (player2.stats.speed * SPEED_STAT_PRIORITY);


    // random
    priorityP1 +=
    Math.random() * PRIORITY_RANDOM_SCALE;

    priorityP2 +=
    Math.random() * PRIORITY_RANDOM_SCALE;


    // ======================
    // DANO
    // ======================

    let damageP1 =

    player1.stats.unarmedDamage +

    (speed1 * DAMAGE_SPEED_SCALE);


    let damageP2 =

    player2.stats.unarmedDamage +

    (speed2 * DAMAGE_SPEED_SCALE);


    // ======================
    // CRIT
    // ======================

    if (
        Math.random() <
        player1.stats.unarmedCrit
    ) {

        damageP1 *= CRIT_MULTI;

        console.log("PLAYER 1 CRITOU");
    }


    if (
        Math.random() <
        player2.stats.unarmedCrit
    ) {

        damageP2 *= CRIT_MULTI;

        console.log("PLAYER 2 CRITOU");
    }


    // ======================
    // RESULTADO
    // ======================

    let result = "";


    // PLAYER 1 venceu
    if (

        priorityP1 >

        priorityP2 + PRIORITY_ADVANTAGE

    ) {

        if(!p1Evade){

        // player1 recebe dano reduzido
        player1.hp -=
        damageP2 * WINNER_DAMAGE_REDUCTION;

        createDamageText(

            player1.x,

            player1.y,

            damageP2 *
            WINNER_DAMAGE_REDUCTION
        );
    }

if(!p2Evade){

        // player2 recebe dano total
        player2.hp -=
        damageP1;

        createDamageText(

            player2.x,

            player2.y,

            damageP1
        );
    }

        result = "player1Win 🔴";
    }


    // PLAYER 2 venceu
    else if (

        priorityP2 >

        priorityP1 + PRIORITY_ADVANTAGE

    ) {

        if(!p2Evade){

        // player2 recebe dano reduzido
        player2.hp -=
        damageP1 * WINNER_DAMAGE_REDUCTION;

        createDamageText(

            player2.x,

            player2.y,

            damageP1 *
            WINNER_DAMAGE_REDUCTION
        );
    }

    if(!p1Evade){

        // player1 recebe dano total
        player1.hp -=
        damageP2;

        createDamageText(

            player1.x,

            player1.y,

            damageP2
        );
    }

        result = "player2Win 🔵";
    }


    // EMPATE
    else {

        if(!p1Evade){

        // player1 recebe dano total
        player1.hp -=
        damageP2;

        createDamageText(

            player1.x,

            player1.y,

            damageP2
        );
    }
    

    
if(!p2Evade){

        // player2 recebe dano total
        player2.hp -=
        damageP1;

        createDamageText(

            player2.x,

            player2.y,

            damageP1
        );
    }

    }

    // ======================
    // CLAMP HP
    // ======================

    player1.hp =
    Math.max(0, player1.hp);

    player2.hp =
    Math.max(0, player2.hp);


    // ======================
    // HIT COOLDOWN
    // ======================

    player1.hitCooldown =
    HIT_COOLDOWN;

    player2.hitCooldown =
    HIT_COOLDOWN;


    // ======================
    // DEBUG
    // ======================

    console.log("RESULTADO:", result);

    console.log(
        "HP PLAYER 1:",
        player1.hp
    );

    console.log(
        "HP PLAYER 2:",
        player2.hp
    );


    const active1 = skill[player1.character.name].active
    
    const active2 = skill[player2.character.name].active


addActiveMeter(player1, player1.active1.chargeHit)

addActiveMeter(player2, player2.active2.chargeHit)


    return result;
}


// ======================
// MATCHUP COMBAT SYSTEM
// ======================

function combatSystem(player1, player2) {


    
    if(IsStunned(player1)){
        return;
    }

    if(IsStunned(player2)){
        return;
    }


    // ======================
    // UNARMED vs UNARMED
    // ======================

    if (
        !player1.weapon &&
        !player2.weapon
    ) {

        unarmedCombat(player1, player2);

        return;
    }


    // ======================
    // UNARMED vs WEAPON
    // ======================

    if (
        !player1.weapon &&
        player2.weapon
    ) {

        // player1 usa corpo
        bodyCombat(player1, player2);

        return;
    }


    // ======================
    // WEAPON vs UNARMED
    // ======================

    if (
        player1.weapon &&
        !player2.weapon
    ) {

        // player2 usa corpo
        bodyCombat(player2, player1);

        return;
    }


    // ======================
    // WEAPON vs WEAPON
    // ======================

    if (
        player1.weapon &&
        player2.weapon
    ) {


        return;
    }
}