// =================================

// FUNCOES DE SKILL APENAS VISUAIS

// ==============================

function createHitFlash(player, duration, color) {
  player.skillObjects.hitFlash = {
    duration: duration,
    color: color,
  };
}

function UpdateHitFlash(player) {
  const flash = player.skillObjects.hitFlash;

  if (!flash) {
    return;
  }

  flash.duration--;

  if (flash.duration <= 0) {
    delete player.skillObjects.hitFlash;
  }
}

// =================================

// SKILLS - LANCE

// ==============================

function UpdateLanceActive(player) {
  const active = player.skillObjects.active;

  if (!active) {
    return;
  }

  active.duration--;

  if (active.duration <= 0) {
    player.stats.speed -= active.speedBonus;

    player.weapon.rotationSpeed -= active.rotationBonus;

    player.stats.evade -= active.evadeBonus;

    player.sub_archetype.cooldown = active.BeforeSubArchetypeCooldown

    
    
    delete player.skillObjects.active;

    console.log("skill acabou", player.character.name);
  }
}

// =================================
// SKILLS - STEPHANY
// ==============================

function UpdatePoisonOutput(player) {
  const output = player.skillObjects.poisonOutput;

  if (!output) {
    return;
  }

  if (player.state?.casting?.duration > 0) {
    return;
  }
  output.radius += output.growth;

  if (output.radius >= output.maxRadius) {
    delete player.skillObjects.poisonOutput;
  }

  const target = player === player1 ? player2 : player1;

  if (output.hitTargets.includes(target)) {
    return;
  }
  const distance = Math.hypot(
    target.x - player.x,

    target.y - player.y,
  );

  if (distance > output.radius) {
    return;
  }

  output.hitTargets.push(target);

  const dx = target.x - player.x;

  const dy = target.y - player.y;

  const length = Math.hypot(dx, dy);

  const dirX = dx / length;

  const dirY = dy / length;

  target.physicsVx += dirX * output.knockback;

  target.physicsVy += dirY * output.knockback;

  createHitFlash(target, 40, "purple");

  console.log("onda atingiu", target.character.name);
}function UpdatePoisonPool(player) {

    const pools = player.arenaObjects.poisonPool;

    if (!pools) {
        return;
    }

    if (player.state?.casting?.duration > 0) {
        return;
    }

    // ======================
    // EXPANSÃO DAS POÇAS
    // ======================

    for (const pool of pools) {

        if (pool.radius < pool.maxRadius) {
            pool.radius += pool.growth;
        }

        pool.alpha = Math.min(
            pool.maxAlpha,
            pool.alpha + 0.01
        );
    }

    const target =
        player === player1
            ? player2
            : player1;

    let poolTouch = false;

    // ======================
    // COLISÃO COM QUALQUER POÇA
    // ======================

    for (const pool of pools) {

        const dx =
            target.x - pool.x;

        const dy =
            target.y - pool.y;

        const distance =
            Math.hypot(dx, dy);

        if (distance <= pool.radius + target.radius) {

            poolTouch = true;
            break;

        }

    }

    // ======================
    // DENTRO DA POÇA
    // ======================

    if (poolTouch) {

        if (target.poisonTick === undefined) {
            target.poisonTick = 40;
        }

        if (target.skillObjects.poisonPoolCounter.stunTick === undefined) {
            target.skillObjects.poisonPoolCounter.stunTick = 30;
        }

        target.poisonTick--;
        target.skillObjects.poisonPoolCounter.stunTick--;

        // ----------------------
        // STACK DE STUN
        // ----------------------

        if (target.skillObjects.poisonPoolCounter.stunTick <= 0) {

            target.skillObjects.poisonPoolCounter.counter++;

            target.skillObjects.poisonPoolCounter.stunTick = 30;

            if (
                target.skillObjects.poisonPoolCounter.counter >=
                target.skillObjects.poisonPoolCounter.reqCounter
            ) {
console.log("stun")
                target.state.stunned = {
                    duration: 60
                };
                
                
                target.skillObjects.poisonPoolCounter.counter = 0;
            }
        }

        // ----------------------
        // VENENO
        // ----------------------

        if (target.poisonTick <= 0) {
         

          createHitFlash(target, 15, "purple")
            target.stats.speed--;

            if (target.stats.speed < 5) {
                target.stats.speed = 5;
            }

            console.log(
                "Velocidade reduzida para:",
                target.stats.speed
            );

            target.poisonTick = 40;
        }

        createHitFlash(
            target,
            15,
            "purple"
        );
    }

    // ======================
    // FORA DA POÇA
    // ======================

    else {

        target.poisonTick = undefined;

       

    }

}




function updateSkillObjects(player) {
  UpdateLanceActive(player);

  // stephany

  UpdatePoisonOutput(player);
  UpdatePoisonPool(player);

  //efeito visual
  UpdateHitFlash(player);
}
