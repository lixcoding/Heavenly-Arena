// ======================
// CONSTANTES
// ======================


// força extra usada pra separar
// os players após a colisão
const SEPARATION_FORCE = 2;

// força do knockback baseada
// no atributo POWER
const KNOCKBACK_FORCE = 0.2;


const BOUNCE_FORCE = 3;
// intensidade da aleatoriedade
// aplicada após a colisão
const RANDOM_FORCE = 0.5;





// ======================
// COLLISION PRINCIPAL
// ======================

function collision(player1, player2) {

    // pega todos os dados físicos
    // da colisão
    const collisionData =
    getCollisionData(player1, player2);

    // se não colidiu
    // encerra a função
    if (!collisionData.collided) {
        return;
    }

    // separa os players
    // para evitar atravessamento
    separatePlayers(
        player1,
        player2,
        collisionData
    );

    // aplica o rebote base
    applyBounce(
        player1,
        player2,
        collisionData
    );

    // adiciona knockback
    // baseado no POWER
    applyKnockback(
        player1,
        player2,
        collisionData
    );

    // adiciona pequenas alterações
    // aleatórias no movimento
    applyRandomForce(
        player1,
        player2
    );


playerCollision(player1, player2)
 playerCollision(player2, player1)
 
    // inicia o sistema de combate
    combatSystem(player1, player2);


}





// ======================
// DADOS DA COLISÃO
// ======================

function getCollisionData(player1, player2) {

    // diferença horizontal
    let dx = player1.x - player2.x;

    // diferença vertical
    let dy = player1.y - player2.y;

    // distância real entre os players
    let distance =
    Math.sqrt(dx * dx + dy * dy);

    // evita divisão por zero
    if (distance === 0) {

        distance = 0.1;
    }

    // soma dos raios dos players
    let radiusSum =
    player1.radius + player2.radius;

    // se a distância for maior
    // que a soma dos raios
    // não houve colisão
    if (distance >= radiusSum) {

        return {
            collided: false
        };
    }

    // normaliza a direção da colisão
    // transformando em valores entre -1 e 1
    let nx = dx / distance;
    let ny = dy / distance;

    // calcula quanto os players
    // estão se atravessando
    let overlap =
    radiusSum - distance;

    // retorna todas as informações
    // da colisão
    return {

        // informa que houve colisão
        collided: true,

        // diferenças posicionais
        dx,
        dy,

        // distância real
        distance,

        // direção normalizada
        nx,
        ny,

        // sobreposição
        overlap
    };
}





// ======================
// SEPARAÇÃO
// ======================

function separatePlayers(
    player1,
    player2,
    collisionData
) {

    // calcula a força de separação
    const separation =

    collisionData.overlap / 2 +

    SEPARATION_FORCE;

    // empurra player1
    // para longe da colisão
    player1.x +=
    collisionData.nx * separation;

    player1.y +=
    collisionData.ny * separation;

    // empurra player2
    // para o lado oposto
    player2.x -=
    collisionData.nx * separation;

    player2.y -=
    collisionData.ny * separation;
}


function reflectDirection(player, nx, ny){

    const dot =

    player.moveVx * nx +

    player.moveVy * ny;

    player.moveVx -=

    2 * dot * nx;

    player.moveVy -=

    2 * dot * ny;

    const len = Math.hypot(

        player.moveVx,

        player.moveVy
    );

    if(len > 0){

        player.moveVx /= len;

        player.moveVy /= len;
    }
}


// ======================
// REBOTE
// ======================

function applyBounce(
    player1,
    player2,
    collisionData
) {

    reflectDirection(
        player1,
        collisionData.nx,
        collisionData.ny
    );

    reflectDirection(
        player2,
        -collisionData.nx,
        -collisionData.ny
    );
    
    
    player1.moveVx +=
(Math.random()-0.5)*0.15;

player1.moveVy +=
(Math.random()-0.5)*0.15;


    player2.moveVx +=
(Math.random()-0.5)*0.15;

player2.moveVy +=
(Math.random()-0.5)*0.15;


let len =
Math.hypot(
player1.moveVx,
player1.moveVy
);

player1.moveVx /= len;
player1.moveVy /= len;


let len2 =
Math.hypot(
player2.moveVx,
player2.moveVy
);

player2.moveVx /= len2;
player2.moveVy /= len2;




    player1.physicsVx +=
    player1.moveVx *
    BOUNCE_FORCE;

    player1.physicsVy +=
    player1.moveVy *
    BOUNCE_FORCE;

    player2.physicsVx +=
    player2.moveVx *
    BOUNCE_FORCE;

    player2.physicsVy +=
    player2.moveVy *
    BOUNCE_FORCE;

}



// ======================
// KNOCKBACK
// ======================

function applyKnockback(
    player1,
    player2,
    collisionData
) {

    // player2 recebe força
    // baseada no POWER do player1
    player2.physicsVx -=

    (
        collisionData.nx *

        player1.stats.power *

        KNOCKBACK_FORCE
    )

    /

    player2.FighterType;



    player2.physicsVy -=

    (
        collisionData.ny *

        player1.stats.power *

        KNOCKBACK_FORCE
    )

    /

    player2.FighterType;





    // player1 recebe força
    // baseada no POWER do player2
    player1.physicsVx +=

    (
        collisionData.nx *

        player2.stats.power *

        KNOCKBACK_FORCE
    )

    /

    player1.FighterType;



    player1.physicsVy +=

    (
        collisionData.ny *

        player2.stats.power *

        KNOCKBACK_FORCE
    )

    /

    player1.FighterType;

}
// ======================
// RANDOMIZAÇÃO
// ======================

function applyRandomForce(
    player1,
    player2
) {

    // adiciona pequenas variações
    // aleatórias no movimento
    // do player1
    player1.physicsVx +=

    (Math.random() - 0.5)

    
    * RANDOM_FORCE;

    player1.physicsVy +=

    (Math.random() - 0.5)

    * RANDOM_FORCE;





    // adiciona pequenas variações
    // aleatórias no movimento
    // do player2
    player2.physicsVx +=

    (Math.random() - 0.5)

    * RANDOM_FORCE;

    player2.physicsVy +=

    (Math.random() - 0.5)

    * RANDOM_FORCE;
}