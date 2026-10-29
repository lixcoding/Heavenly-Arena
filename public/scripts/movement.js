// ======================================================
// CONFIGURAÇÃO DA COLISÃO DA ARENA
// ======================================================

// Quanto o personagem precisa se afastar da parede
// depois de um rebote.
//
// Menor = permite rebotes mais rasantes.
// Maior = afasta mais da parede.
const ARENA_MIN_BOUNCE = 0.30;


// Margem usada para colocar o personagem
// levemente para dentro da arena.
const ARENA_SAFE_MARGIN = 1;



// ======================================================
// MOVIMENTO
// ======================================================

function updateMove(ball) {

    if (IsCasting(ball)) {
        return;
    }


    if (IsStunned(ball)) {
        return;
    }


    // ======================
    // MOVIMENTO PRINCIPAL
    // ======================

    ball.x +=
        (ball.moveVx * ball.stats.speed)
        + ball.physicsVx;


    ball.y +=
        (ball.moveVy * ball.stats.speed)
        + ball.physicsVy;


    // ======================
    // REDUZ IMPULSO FÍSICO
    // ======================

    ball.physicsVx *= 0.90;

    ball.physicsVy *= 0.90;


    // ======================
    // COLISÃO DA ARENA
    // ======================

    updateArenaCollision(ball);
}



// ======================================================
// BOOST WEAPON
// ======================================================

function boostWeapon(ball) {

    if (ball.weapon) {

        ball.weapon.angularVelocity =
            0.08;
    }
}



// ======================================================
// ESCOLHER COLISÃO DA ARENA
// ======================================================
function updateArenaCollision(ball) {

    switch (arena.type) {

        case "rectangle":

            rectangleArenaCollision(ball);

            break;


        case "circle":

            circleArenaCollision(ball);

            break;


        case "oval":

            ovalArenaCollision(ball);

            break;


        case "hexagon":

            hexagonArenaCollision(ball);

            break;
    }
}
function hexagonArenaCollision(ball) {

    const vertices =
        getHexagonVertices();


    /*
        Podemos tocar mais de uma parede
        ao mesmo tempo perto de uma ponta.

        Por isso repetimos algumas vezes
        a correção.
    */

    for (
        let pass = 0;
        pass < 3;
        pass++
    ) {

        let collided =
            false;


        for (
            let i = 0;
            i < vertices.length;
            i++
        ) {

            // ======================
            // PONTOS DA PAREDE
            // ======================

            const start =
                vertices[i];


            const end =
                vertices[
                    (i + 1) %
                    vertices.length
                ];


            // ======================
            // DIREÇÃO DA PAREDE
            // ======================

            const edgeX =
                end.x -
                start.x;


            const edgeY =
                end.y -
                start.y;


            const edgeLength =
                Math.hypot(
                    edgeX,
                    edgeY
                );


            if (
                edgeLength === 0
            ) {

                continue;
            }


            // ======================
            // DIREÇÃO PERPENDICULAR
            // ======================

            let nx =
                edgeY /
                edgeLength;


            let ny =
                -edgeX /
                edgeLength;


            /*
                Nesse momento a direção
                pode estar apontando para
                dentro OU para fora.

                Então verificamos onde
                está o centro da arena.
            */

            const centerDirection =

                (arena.x - start.x) *
                nx

                +

                (arena.y - start.y) *
                ny;


            // queremos nx / ny
            // apontando PARA DENTRO

            if (
                centerDirection < 0
            ) {

                nx *= -1;

                ny *= -1;
            }


            // ======================
            // DISTÂNCIA DO PLAYER
            // ATÉ A PAREDE
            // ======================

            const distance =

                (ball.x - start.x) *
                nx

                +

                (ball.y - start.y) *
                ny;


            /*
                O centro do player precisa
                ficar pelo menos:

                ball.radius

                para dentro da parede.
            */

            if (
                distance >=
                ball.radius
            ) {

                continue;
            }


            // ======================
            // COLISÃO
            // ======================

            collided =
                true;


            const penetration =

                ball.radius -
                distance

                +

                ARENA_SAFE_MARGIN;


            // ======================
            // EMPURRAR PARA DENTRO
            // ======================

            ball.x +=
                nx *
                penetration;


            ball.y +=
                ny *
                penetration;


            // ======================
            // REBOTE
            // ======================

            /*
                reflectArenaDirection()
                recebe uma direção que
                aponta PARA FORA.

                nx / ny atualmente apontam
                PARA DENTRO.

                Por isso usamos:
            */

            const outwardX =
                -nx;


            const outwardY =
                -ny;


            reflectArenaDirection(
                ball,
                outwardX,
                outwardY
            );
        }


        // nenhuma parede foi atingida
        if (!collided) {

            break;
        }
    }
}
function getHexagonVertices() {

    // ======================
    // TAMANHO
    // ======================

    const radiusX =
        arena.width != null
            ? arena.width / 2
            : arena.radius;


    const radiusY =
        arena.height != null
            ? arena.height / 2
            : arena.radius;


    // ======================
    // CRIAR PONTOS
    // ======================

    const vertices = [];


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const angle =
            -Math.PI / 2 +
            i * Math.PI / 3;


        vertices.push({

            x:
                arena.x +
                Math.cos(angle) *
                radiusX,

            y:
                arena.y +
                Math.sin(angle) *
                radiusY
        });
    }


    return vertices;
}

// ======================================================
// ARENA RETANGULAR
// ======================================================

function rectangleArenaCollision(ball) {


    const left =
        arena.x -
        arena.width / 2;


    const right =
        arena.x +
        arena.width / 2;


    const top =
        arena.y -
        arena.height / 2;


    const bottom =
        arena.y +
        arena.height / 2;


    /*
        Em cada parede:

        1. corrigimos a posição (um pouco para dentro)
        2. delegamos o rebote para reflectArenaDirection,
           o mesmo usado pelas outras arenas.

        As normais passadas apontam PARA FORA da arena.

        reflectArenaDirection só reflete se o personagem
        estiver realmente indo para a parede, então ele
        não é invertido de novo quando já está voltando.
    */


    // ======================
    // PAREDE ESQUERDA
    // ======================

    if (
        ball.x - ball.radius <
        left
    ) {

        ball.x =
            left +
            ball.radius +
            ARENA_SAFE_MARGIN;


        reflectArenaDirection(
            ball,
            -1,
            0
        );
    }



    // ======================
    // PAREDE DIREITA
    // ======================

    if (
        ball.x + ball.radius >
        right
    ) {

        ball.x =
            right -
            ball.radius -
            ARENA_SAFE_MARGIN;


        reflectArenaDirection(
            ball,
            1,
            0
        );
    }



    // ======================
    // TETO
    // ======================

    if (
        ball.y - ball.radius <
        top
    ) {

        ball.y =
            top +
            ball.radius +
            ARENA_SAFE_MARGIN;


        reflectArenaDirection(
            ball,
            0,
            -1
        );
    }



    // ======================
    // CHÃO
    // ======================

    if (
        ball.y + ball.radius >
        bottom
    ) {

        ball.y =
            bottom -
            ball.radius -
            ARENA_SAFE_MARGIN;


        reflectArenaDirection(
            ball,
            0,
            1
        );
    }
}



// ======================================================
// ARENA CIRCULAR
// ======================================================

function circleArenaCollision(ball) {


    // ======================
    // POSIÇÃO EM RELAÇÃO
    // AO CENTRO
    // ======================

    const dx =
        ball.x -
        arena.x;


    const dy =
        ball.y -
        arena.y;



    // ======================
    // DISTÂNCIA DO CENTRO
    // ======================

    const distance =
        Math.hypot(
            dx,
            dy
        );



    // ======================
    // LIMITE DO PLAYER
    // ======================

    /*
        Não usamos apenas:

        arena.radius

        porque o player também
        possui tamanho.

        O centro dele só pode chegar até:

        arena.radius - ball.radius
    */

    const maxDistance =
        arena.radius -
        ball.radius;



    // segurança
    if (
        maxDistance <=
        ARENA_SAFE_MARGIN
    ) {

        return;
    }



    // ======================
    // AINDA ESTÁ DENTRO
    // ======================

    if (
        distance <=
        maxDistance
    ) {

        return;
    }



    // segurança
    if (
        distance === 0
    ) {

        return;
    }



    // ======================
    // DIREÇÃO DA PAREDE
    // ======================

    /*
        Essa direção aponta
        PARA FORA da arena.

        No círculo ela é simplesmente
        a direção do centro até o player.
    */

    const nx =
        dx /
        distance;


    const ny =
        dy /
        distance;



    // ======================
    // CORRIGIR POSIÇÃO
    // ======================

    /*
        Colocamos o personagem
        levemente para dentro.

        Isso impede que ele continue
        sendo detectado como "fora"
        no próximo frame.
    */

    const safeDistance =

        maxDistance -

        ARENA_SAFE_MARGIN;



    ball.x =

        arena.x +

        nx * safeDistance;



    ball.y =

        arena.y +

        ny * safeDistance;



    // ======================
    // REBOTE NORMAL
    // ======================

    reflectArenaDirection(
        ball,
        nx,
        ny
    );
}



// ======================================================
// ARENA OVAL
// ======================================================

function ovalArenaCollision(ball) {


    // ======================
    // TAMANHO PERMITIDO
    // ======================

    /*
        rx = raio horizontal

        ry = raio vertical

        Também descontamos o raio
        do próprio personagem.
    */

    const rx =

        arena.width / 2 -

        ball.radius;


    const ry =

        arena.height / 2 -

        ball.radius;



    // segurança
    if (
        rx <= ARENA_SAFE_MARGIN ||
        ry <= ARENA_SAFE_MARGIN
    ) {

        return;
    }



    // ======================
    // POSIÇÃO EM RELAÇÃO
    // AO CENTRO
    // ======================

    const dx =
        ball.x -
        arena.x;


    const dy =
        ball.y -
        arena.y;



    // ======================
    // VERIFICAR SE ESTÁ
    // DENTRO DA ELIPSE
    // ======================

    /*
        Fórmula:

        x² / rx²
        +
        y² / ry²

        <= 1 = dentro

        > 1 = fora
    */

    const value =

        (dx * dx) /
        (rx * rx)

        +

        (dy * dy) /
        (ry * ry);



    // ainda dentro
    if (
        value <= 1
    ) {

        return;
    }



    // ======================
    // ENCONTRAR A BORDA
    // ======================

    /*
        Descobre o quanto precisamos
        reduzir dx e dy para voltar
        até a elipse.
    */

    const scale =

        1 /

        Math.sqrt(value);



    // ======================
    // MARGEM PARA DENTRO
    // ======================

    /*
        0.995 deixa o personagem
        um pouco para dentro.

        Isso evita:

        colisão
        ↓
        continua exatamente na borda
        ↓
        nova colisão
        ↓
        tremedeira / travamento
    */

    const safeScale =

        scale *

        0.995;



    // posição relativa corrigida

    const correctedX =

        dx *
        safeScale;


    const correctedY =

        dy *
        safeScale;



    // ======================
    // CORRIGIR POSIÇÃO
    // ======================

    ball.x =

        arena.x +

        correctedX;


    ball.y =

        arena.y +

        correctedY;



    // ======================
    // DIREÇÃO REAL
    // DA PAREDE OVAL
    // ======================

    /*
        Aqui está uma das partes
        mais importantes.

        Não podemos simplesmente usar:

        dx / distance

        como no círculo.

        O oval possui largura
        e altura diferentes.

        Então calculamos a direção
        da parede usando rx e ry.
    */

    let nx =

        correctedX /

        (rx * rx);


    let ny =

        correctedY /

        (ry * ry);



    // ======================
    // NORMALIZAR DIREÇÃO
    // DA PAREDE
    // ======================

    const normalLength =

        Math.hypot(
            nx,
            ny
        );



    if (
        normalLength === 0
    ) {

        return;
    }



    nx /=
        normalLength;


    ny /=
        normalLength;



    // ======================
    // REBOTE NORMAL
    // ======================

    reflectArenaDirection(
        ball,
        nx,
        ny
    );
}



// ======================================================
// REFLETIR MOVIMENTO NA PAREDE
// ======================================================

function reflectArenaDirection(
    ball,
    nx,
    ny
) {


    // ==================================================
    // DIREÇÃO PRINCIPAL
    // ==================================================

    /*
        Descobre quanto do movimento
        está indo na direção da parede.

        nx / ny apontam PARA FORA.
    */

    let moveDot =

        ball.moveVx * nx +

        ball.moveVy * ny;



    // ======================
    // SÓ REBATE SE ESTIVER
    // INDO PARA FORA
    // ======================

    /*
        Isso evita inverter novamente
        um personagem que já está
        tentando voltar para dentro.
    */

    if (
        moveDot > 0
    ) {

        ball.moveVx -=

            2 *
            moveDot *
            nx;


        ball.moveVy -=

            2 *
            moveDot *
            ny;
    }



    // ==================================================
    // EVITAR DESLIZAMENTO
    // ==================================================

    /*
        Depois da reflexão normal,
        podemos acabar com algo assim:

              →→→→

            ╭────────
           ●

        O personagem estaria tecnicamente
        indo para dentro, mas tão pouco
        que parece deslizar pela parede.

        Então garantimos que exista
        um mínimo de movimento para dentro.
    */

    moveDot =

        ball.moveVx * nx +

        ball.moveVy * ny;



    if (
        moveDot >
        -ARENA_MIN_BOUNCE
    ) {


        /*
            Queremos que:

            moveDot = -ARENA_MIN_BOUNCE

            O valor negativo significa:

            direção para DENTRO.
        */

        const correction =

            moveDot +

            ARENA_MIN_BOUNCE;



        ball.moveVx -=

            correction *
            nx;


        ball.moveVy -=

            correction *
            ny;
    }



    // ==================================================
    // NORMALIZAR MOVIMENTO
    // ==================================================

    let moveLength =

        Math.hypot(
            ball.moveVx,
            ball.moveVy
        );



    if (
        moveLength > 0
    ) {

        ball.moveVx /=
            moveLength;


        ball.moveVy /=
            moveLength;
    }



    // ==================================================
    // REFLETIR IMPULSO FÍSICO
    // ==================================================

    /*
        O player também pode estar sendo
        empurrado por:

        knockback
        colisões
        outras forças

        Então precisamos impedir que
        physics continue empurrando
        para fora da arena.
    */

    const physicsDot =

        ball.physicsVx * nx +

        ball.physicsVy * ny;



    // somente se estiver indo para fora
    if (
        physicsDot > 0
    ) {


        ball.physicsVx -=

            2 *
            physicsDot *
            nx;


        ball.physicsVy -=

            2 *
            physicsDot *
            ny;
    }



    // ==================================================
    // BOOST WEAPON
    // ==================================================

    boostWeapon(ball);
}