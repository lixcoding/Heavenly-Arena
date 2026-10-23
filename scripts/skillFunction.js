const skillFunction = {

Van: {

    passive(player, event) {

        player.stats.speed += 1;

        console.log(
            "Van, " +
            skill.Van.passive.name +
            "| SPEED:" +
            player.stats.speed
        );
    },

    active(player) {},

    ultimate(player) {},
},

  Lance: {
    passive(player, event) {
      if (player.hp >= player.maxHp) {
        return;
      } else {


     const target = event.target;

        if(target.stats.unarmedDamage === 0){
player.hp += target.weapon.damage;
        }
        else{
          player.hp += target.stats.unarmedDamage;
        }


        if (player.hp > player.maxHp) {
          player.hp = player.maxHp;
        }

        console.log("Lance, " + skill.Lance.passive.name + "| HP:" + player.hp);
      }
    },

    //fim da passiva

    active(player) {
      const characterName = player.character.name;

      const active = skill[characterName].active;

      // skill já está ativa: não empilha os bônus
      // (devolve false para a barra não ser gasta)
      if (player.skillObjects.active) {
        return false;
      }

      player.skillObjects.active = {
        duration: active.duration,
        speedBonus: active.speedBonus,
        rotationBonus: active.rotationBonus,
        evadeBonus: active.evadeBonus,
        subArchetypeCooldown: 1,

        // cooldown original do sub_archetype,
        // restaurado quando a skill acabar (UpdateLanceActive)
        BeforeSubArchetypeCooldown: player.sub_archetype.cooldown
      };

      const activeObject = player.skillObjects.active;

      player.stats.speed += activeObject.speedBonus;

      player.weapon.rotationSpeed += activeObject.rotationBonus;

      player.stats.evade += activeObject.evadeBonus;


      // durante a skill o comportamento é reavaliado todo frame.
      // sub_archetype é uma cópia só deste jogador (players.js),
      // então isso não afeta ninguém mais.
      player.sub_archetype.cooldown = activeObject.subArchetypeCooldown;

      // reinicia o timer: sem isso o novo cooldown só valeria depois
      // do timer antigo (até 300 frames) zerar, e a skill (180 frames)
      // podia acabar sem o efeito acontecer.
      player.sub_archetypeObject.timer = activeObject.subArchetypeCooldown;

      return true;
    },

    ultimate(player) {},
  },
Stephany: {

    passive(player, event) {

        const characterName = player.character.name;
        const passive = skill[characterName].passive;

        const target = event.target;

        if (!player.skillObjects.poisonHits) {
            player.skillObjects.poisonHits = {
                hit: 0,
            };
        }

        const poisonHits = player.skillObjects.poisonHits;

        poisonHits.hit++;

        console.log("hits:", poisonHits.hit);

        if (poisonHits.hit < passive.hitReq) {
            return;
        }

        poisonHits.hit = 0;

        if (!target.effects.poison) {

            target.effects.poison = {
                // quem aplicou o veneno (usado nos eventos de dano)
                source: player,

                damagePer: passive.damagePer,
                maxDamagePer: passive.maxDamagePer,
                minDamagePer: passive.minDamagePer,
                tick: passive.tick,
                tickRate: passive.tickRate,
            };

            return;
        }

        target.effects.poison.damagePer = Math.min(
            target.effects.poison.maxDamagePer,
            target.effects.poison.damagePer + 0.01
        );

        console.log(
            "veneno evoluiu: " +
            target.effects.poison.damagePer * 100 +
            "%"
        );
    },
    //fim da passiva








    active(player) {
      const target = player === player1 ? player2 : player1;

      const characterName = player.character.name;

      const active = skill[characterName].active;

      // sem veneno no alvo a skill não pode ser usada.
      // false = a barra não é gasta (ver Active / addActiveMeter)
      if (!target.effects.poison) {
        return false;
      }

      target.effects.poison.maxDamagePer = active.poisonLimit;

      target.effects.poison.damagePer = Math.min(
        active.poisonLimit,
        target.effects.poison.damagePer + 0.01,
      );

      console.log(
        "veneno buffado",
        target.character.name,
        target.effects.poison.damagePer * 100,
      );




      //// casting explosao

      player.state.casting = {
        duration: 10,

      };


      ///// explosao

      player.skillObjects.poisonOutput = {
        radius: 0,
        maxRadius: active.maxRadius,
        growth: active.growth,
        knockback: active.knockback,
        hitTargets: [],
      };

      player.arenaObjects.poisonPool.push({
        x: target.x,
        y: target.y,

        radius: 0,
        maxRadius: 80,
        growth: 2,
        alpha: 0,
        maxAlpha: 0.5,

      });


      target.skillObjects.poisonPoolCounter =  {
        counter: 0,
        reqCounter: 3,
        stunTick: 30
      }

      return true;
    },
  },

  ultimate(player) {},
};
