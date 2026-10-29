function createPlayer(character, x, y, vx, vy) {
  const length = Math.hypot(vx, vy);

  const dirX = length === 0 ? 0 : vx / length;

  const dirY = length === 0 ? 0 : vy / length;
  return {
    character: character,

    x: x,
    y: y,

    moveVy: dirY,
    moveVx: dirX,

    physicsVx: 0,
    physicsVy: 0,

    // ======================
    // TRAITS
    // ======================

    activeBar: character.activeBar,
    activeBarMax: character.activeBarMax,



    radius: character.radius,

// movement archtype
   // cópia por jogador: skills como a do Lance alteram o cooldown,
   // e isso não pode afetar o objeto global em sub_archetypes
   sub_archetype: { ...character.sub_archetype },
   sub_archetypeObject: {
    timer: character.sub_archetype.cooldown

},

    FighterType: character.FighterType.knockbackResistance,



    hp: character.stats.hp,
    maxHp: character.stats.maxHp,

    

    stats: {
      ...character.stats,
    },





    // ======================
    // HABILIDADES
    // ======================

    arenaObjects: {
      poisonPool: [],
    },

    skillObjects: {},

    effects: {},
    
    events: [],
    state: {

      portrait: {
        type: "default",
        duration: 0
      }
    },

    // ======================
    // ARMAS
    // ======================

    hitCooldown: 0,

    weapon: createPlayerWeapon(character)
  }
}
function cloneObject(value) {

    if (Array.isArray(value)) {

        return value.map(item =>
            cloneObject(item)
        );
    }


    if (
        value !== null &&
        typeof value === "object"
    ) {

        const prototype =
            Object.getPrototypeOf(value);


        if (
            prototype === Object.prototype ||
            prototype === null
        ) {

            const clone = {};


            for (const key in value) {

                clone[key] =
                    cloneObject(value[key]);
            }


            return clone;
        }


        return value;
    }


    return value;
}



function createPlayerWeapon(character) {

    if (!character.weapon) {
        return null;
    }


    const weapon =
        cloneObject(character.weapon);


    weapon.x = 0;
    weapon.y = 0;

    weapon.angle = 0;

    weapon.rotationDirection = 1;

    weapon.angularVelocity = 0;


    weapon.active = true;


    return weapon;
}
// ======================
// PERSONAGENS ESCOLHIDOS
// ======================

// A tela de seleção (selecao.html) grava a posição do personagem em
// `characters` no sessionStorage. Sem escolha salva (ou com valor
// inválido) usamos o personagem padrão, então o jogo continua
// abrindo direto pelo game.html.

function readSelectedCharacter(key, fallback) {

  let raw = null;

  try {
    raw = sessionStorage.getItem(key);
  } catch (error) {
    return fallback;
  }

  if (raw === null) {
    return fallback;
  }

  const index = Number(raw);

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= characters.length
  ) {
    return fallback;
  }

  return index;
}

const selectedCharacterP1 = readSelectedCharacter("selectedCharacterP1", 2);

const selectedCharacterP2 = readSelectedCharacter("selectedCharacterP2", 1);

const player1 = createPlayer(
  characters[selectedCharacterP1],

  500,
  -200,

  1,
  1,
);

   

player1.color = "red";

const player2 = createPlayer(
  characters[selectedCharacterP2],

  200,
  100,
  -1,
  1,
);

player2.color = "blue";


// ======================
// PORTRAITS DO HUD
// ======================

// O game.html traz um portrait fixo em cada lado do HUD.
// Aqui ele passa a mostrar o personagem realmente escolhido
// (campo hudPortrait em characters.js). Personagem sem
// hudPortrait fica sem imagem em vez de mostrar o de outro.

function applyHudPortrait(player, elementId) {

  const element = document.getElementById(elementId);

  if (!element) {
    return;
  }

  const source = player.character.hudPortrait;

  if (source) {

    element.src = source;
    element.style.visibility = "visible";

  } else {

    element.removeAttribute("src");
    element.style.visibility = "hidden";
  }
}

applyHudPortrait(player1, "portrait-p1");
applyHudPortrait(player2, "portrait-p2");
