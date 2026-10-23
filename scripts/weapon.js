// ======================
// UPDATE WEAPON
// ======================

function updateWeapon(player) {

    if (!player.weapon) {
        return;
    }

    if (IsStunned(player)) {
        return;
    }

    switch (player.weapon.type) {

        case "orbit":
            updateOrbitWeapon(player);
            break;

        case "chain":
            updateChainWeapon(player);
            break;
    }
}



// ======================================================
// CHAIN HISTORY
// ======================================================


// ======================
// ADICIONAR PONTO AO HISTÓRICO
// ======================

function addChainHistory(
    chain,
    x,
    y,
    maxDistance
) {

    const history = chain.history;


    // ======================
    // PRIMEIRO PONTO
    // ======================

    if (history.length === 0) {

        history.push({
            x: x,
            y: y
        });

        return;
    }


    const newestPoint =
        history[0];


    const moved =
        Math.hypot(
            x - newestPoint.x,
            y - newestPoint.y
        );


    // ======================
    // MOVIMENTO MUITO PEQUENO
    // ======================

    // evita criar centenas de pontos
    // praticamente iguais

    if (moved < 0.5) {

        newestPoint.x = x;
        newestPoint.y = y;

        return;
    }


    // ======================
    // NOVO PONTO
    // ======================

    // unshift adiciona no começo da lista

    history.unshift({
        x: x,
        y: y
    });



    // ======================
    // LIMITAR COMPRIMENTO
    // DO HISTÓRICO
    // ======================

    let totalDistance = 0;


    for (
        let i = 1;
        i < history.length;
        i++
    ) {

        const previous =
            history[i - 1];

        const current =
            history[i];


        totalDistance +=
            Math.hypot(
                current.x - previous.x,
                current.y - previous.y
            );


        if (totalDistance >= maxDistance) {

            history.length =
                i + 1;

            break;
        }
    }


    // proteção extra

    if (history.length > 300) {

        history.length = 300;

    }
}



// ======================
// PEGAR UM PONTO DO HISTÓRICO
// A UMA CERTA DISTÂNCIA
// ======================

function getChainHistoryPoint(
    history,
    wantedDistance
) {

    if (history.length === 0) {
        return null;
    }


    if (history.length === 1) {
        return history[0];
    }


    let traveled = 0;


    // ======================
    // PERCORRER O CAMINHO
    // ======================

    for (
        let i = 1;
        i < history.length;
        i++
    ) {

        const start =
            history[i - 1];

        const end =
            history[i];


        const dx =
            end.x - start.x;

        const dy =
            end.y - start.y;


        const distance =
            Math.hypot(dx, dy);


        if (distance === 0) {
            continue;
        }


        // encontramos o trecho
        // onde está a distância desejada

        if (
            traveled + distance >=
            wantedDistance
        ) {

            const remaining =
                wantedDistance - traveled;


            const t =
                remaining / distance;


            return {

                x:
                    start.x +
                    dx * t,

                y:
                    start.y +
                    dy * t

            };
        }


        traveled += distance;
    }



    // ======================
    // HISTÓRICO AINDA CURTO
    // ======================

    // caso o histórico ainda não tenha
    // distância suficiente, continua
    // na direção dos últimos dois pontos

    const last =
        history[
            history.length - 1
        ];

    const beforeLast =
        history[
            history.length - 2
        ];


    const dx =
        last.x - beforeLast.x;

    const dy =
        last.y - beforeLast.y;


    const distance =
        Math.hypot(dx, dy);


    if (distance === 0) {

        return {
            x: last.x,
            y: last.y
        };
    }


    const remaining =
        wantedDistance - traveled;


    return {

        x:
            last.x +
            (dx / distance) *
            remaining,

        y:
            last.y +
            (dy / distance) *
            remaining

    };
}



// ======================
// CRIAR HISTÓRICO INICIAL
// ======================

function initializeChainHistory(
    player,
    chain,
    maxDistance
) {

    chain.history.length = 0;


    // queremos criar o histórico
    // atrás do movimento do player

    let dirX =
        -player.moveVx;

    let dirY =
        -player.moveVy;


    let directionLength =
        Math.hypot(
            dirX,
            dirY
        );


    // player parado

    if (directionLength === 0) {

        dirX = -1;
        dirY = 0;

        directionLength = 1;
    }


    // normalizar direção

    dirX /=
        directionLength;

    dirY /=
        directionLength;


    const step = 4;


    for (
        let distance = 0;
        distance <= maxDistance;
        distance += step
    ) {

        chain.history.push({

            x:
                player.x +
                dirX * distance,

            y:
                player.y +
                dirY * distance

        });
    }
}



// ======================================================
// UPDATE CHAIN WEAPON
// ======================================================

function updateChainWeapon(player) {

    const weapon =
        player.weapon;

    const chain =
        weapon.chain;

    const segments =
        chain.segments;


    if (segments.length === 0) {
        return;
    }



    // ==================================================
    // SPIN TIMER
    // ==================================================

    if (!chain.isSpinning) {

        chain.spinTimer--;


        if (chain.spinTimer <= 0) {

            chain.isSpinning = true;


            chain.spinTime =
                chain.spinDuration;


            chain.spinAngle =
                Math.atan2(
                    player.moveVy,
                    player.moveVx
                );


            // durante o spin,
            // não precisamos do histórico normal

            chain.history.length = 0;
        }
    }



    // ==================================================
    // SPIN ATTACK
    // ==================================================

    if (chain.isSpinning) {


        // distância especial da cauda
        // durante o spin

        const spinSpacing =
            chain.spinLength || 50;


        chain.targetLength =
            spinSpacing;



        // ======================
        // ROTAÇÃO DO ATAQUE
        // ======================

        chain.spinAngle +=
            chain.spinSpeed;



        // ======================
        // BASE DA CAUDA
        // ======================

        const rootDistance =
            player.radius;


        segments[0].x =
            player.x +
            Math.cos(
                chain.spinAngle
            ) *
            rootDistance;


        segments[0].y =
            player.y +
            Math.sin(
                chain.spinAngle
            ) *
            rootDistance;



        // ======================
        // RESTANTE DA CAUDA
        // ======================

        for (
            let i = 1;
            i < segments.length;
            i++
        ) {

            const previous =
                segments[i - 1];

            const current =
                segments[i];


            // atraso entre cada segmento
            //
            // quanto maior,
            // mais curvada fica

            const lag =
                i * 0.20;



            // 1 no começo do spin
            // 0 no final

            const progress =
                chain.spinTime /
                chain.spinDuration;



            const angle =
                chain.spinAngle -
                lag * progress;



            const targetX =
                previous.x +
                Math.cos(angle) *
                spinSpacing;


            const targetY =
                previous.y +
                Math.sin(angle) *
                spinSpacing;



            current.x +=
                (
                    targetX -
                    current.x
                ) *
                0.65;


            current.y +=
                (
                    targetY -
                    current.y
                ) *
                0.65;
        }



        // ======================
        // TEMPO DO SPIN
        // ======================

        chain.spinTime--;



        // ======================
        // FIM DO SPIN
        // ======================

        if (chain.spinTime <= 0) {

            chain.isSpinning =
                false;


            chain.targetLength =
                chain.segmentLength;


            chain.spinTimer =
                180;



            // ======================
            // RECRIAR HISTÓRICO
            // ======================

            // usamos a posição atual da
            // cauda para não fazer ela
            // teleportar imediatamente

            chain.history.length = 0;


            chain.history.push({

                x: player.x,
                y: player.y

            });


            for (
                const segment of segments
            ) {

                chain.history.push({

                    x: segment.x,
                    y: segment.y

                });
            }
        }


        return;
    }



    // ==================================================
    // MOVIMENTO NORMAL
    // ==================================================

    const spacing =
        chain.targetLength ||
        chain.segmentLength ||
        18;



    // ======================
    // TAMANHO DO HISTÓRICO
    // ======================

    // precisamos guardar caminho suficiente
    // para acomodar a cauda inteira

    const maxHistoryDistance =

        player.radius +

        spacing *
        (segments.length - 1) +

        spacing * 3;



    // ======================
    // INICIALIZAR HISTÓRICO
    // ======================

    if (chain.history.length < 2) {

        initializeChainHistory(
            player,
            chain,
            maxHistoryDistance
        );
    }



    // ======================
    // REGISTRAR TRAJETÓRIA
    // ======================

    addChainHistory(

        chain,

        player.x,
        player.y,

        maxHistoryDistance
    );



    // ==================================================
    // SEGMENTOS SEGUEM O HISTÓRICO
    // ==================================================

    for (
        let i = 0;
        i < segments.length;
        i++
    ) {

        const current =
            segments[i];


        // segment[0] fica aproximadamente
        // na borda da personagem
        //
        // os próximos ficam cada vez
        // mais longe no histórico

        const wantedDistance =

            player.radius +

            i * spacing;



        const target =
            getChainHistoryPoint(

                chain.history,

                wantedDistance
            );


        if (!target) {
            continue;
        }



        // ======================
        // SUAVIDADE
        // ======================

        // base responde mais rápido
        // ponta responde mais devagar

        const followStrength =
            Math.max(

                0.30,

                0.58 -
                i * 0.03
            );



        current.x +=

            (
                target.x -
                current.x
            ) *
            followStrength;



        current.y +=

            (
                target.y -
                current.y
            ) *
            followStrength;
    }
}



// ======================================================
// UPDATE ORBIT WEAPON
// ======================================================

function updateOrbitWeapon(player) {

    if (!player.weapon) {
        return;
    }


    const weapon =
        player.weapon;



    // ======================
    // DISTÂNCIA DA ÓRBITA
    // ======================

    let distance;


    // arma nasce na borda

    if (
        weapon.originType ===
        "edge"
    ) {

        distance =

            player.radius +

            weapon.orbitRadius;

    }


    // arma nasce no centro

    else if (
        weapon.originType ===
        "center"
    ) {

        distance =
            weapon.orbitRadius;

    }


    // fallback

    else {

        console.log(
            "tipo de arma invalido"
        );


        distance =
            weapon.orbitRadius;
    }



    


    // ======================
    // ROTAÇÃO
    // ======================

    weapon.angle +=

        (
            weapon.rotationSpeed +
            weapon.angularVelocity
        ) *

        weapon.rotationDirection;



    weapon.angularVelocity *=
        0.9;



    // ======================
    // POSIÇÃO
    // ======================

    weapon.x =

        player.x +

        Math.cos(
            weapon.angle
        ) *

        distance;



    weapon.y =

        player.y +

        Math.sin(
            weapon.angle
        ) *

        distance;



    // ======================
    // UPDATE HITBOX
    // ======================

    updateWeaponHitbox(player);
}



// ======================================================
// UPDATE WEAPON HITBOX
// ======================================================

function updateOrbitWeaponHitbox(player) {

    if (!player.weapon) {
        return;
    }


    const weapon =
        player.weapon;


    const dirX =
        Math.cos(
            weapon.angle
        );


    const dirY =
        Math.sin(
            weapon.angle
        );



    // ======================
    // START
    // ======================

    weapon.hitbox.startX =

        weapon.x -

        (
            dirX *
            weapon.hitbox.length
        ) /
        2;



    weapon.hitbox.startY =

        weapon.y -

        (
            dirY *
            weapon.hitbox.length
        ) /
        2;



    // ======================
    // END
    // ======================

    weapon.hitbox.endX =

        weapon.x +

        (
            dirX *
            weapon.hitbox.length
        ) /
        2;



    weapon.hitbox.endY =

        weapon.y +

        (
            dirY *
            weapon.hitbox.length
        ) /
        2;
}



// A Chain já usa os próprios segmentos
// como hitbox.
//
// Por enquanto ela não precisa construir
// uma hitbox separada.

function updateChainWeaponHitbox(player) {

}



// ======================
// UPDATE WEAPON HITBOX
// ======================

function updateWeaponHitbox(player) {

    if (!player.weapon) {
        return;
    }


    switch (player.weapon.type) {

        case "orbit":

            updateOrbitWeaponHitbox(
                player
            );

            break;


        case "chain":

            updateChainWeaponHitbox(
                player
            );

            break;
    }
}



// ======================================================
// POINT TO SEGMENT
// ======================================================

function distancePointToSegment(

    px,
    py,

    x1,
    y1,

    x2,
    y2

) {

    const dx =
        x2 - x1;

    const dy =
        y2 - y1;



    // ======================
    // LINHA SEM TAMANHO
    // ======================

    if (
        dx === 0 &&
        dy === 0
    ) {

        return Math.hypot(

            px - x1,

            py - y1
        );
    }



    // ======================
    // PROJEÇÃO
    // ======================

    let t =

        (
            (px - x1) * dx +
            (py - y1) * dy
        ) /

        (
            dx * dx +
            dy * dy
        );



    // ======================
    // LIMITA AO SEGMENTO
    // ======================

    t =
        Math.max(
            0,
            Math.min(
                1,
                t
            )
        );



    // ======================
    // PONTO MAIS PRÓXIMO
    // ======================

    const closestX =
        x1 +
        t * dx;


    const closestY =
        y1 +
        t * dy;



    // ======================
    // DISTÂNCIA
    // ======================

    return Math.hypot(

        px - closestX,

        py - closestY
    );
}



// ======================================================
// ORBIT WEAPON COLLISION
// ======================================================

function orbitWeaponCollision(
    attacker,
    target
) {

    // impede auto hit

    if (attacker === target) {
        return;
    }


    const weapon =
        attacker.weapon;



    const distance =

        distancePointToSegment(

            target.x,
            target.y,

            weapon.hitbox.startX,
            weapon.hitbox.startY,

            weapon.hitbox.endX,
            weapon.hitbox.endY
        );



    const radiusSum =

        weapon.hitbox.radius +

        target.radius;



    // ======================
    // COLISÃO
    // ======================

    if (distance <= radiusSum) {


        // durante o hitCooldown o golpe não conta.
        // Não invertemos a rotação nesse período, senão a
        // espada fica vibrando para frente e para trás
        // dentro do alvo.

        if (attacker.hitCooldown > 0) {
            return;
        }


        // ======================
        // DANO
        // ======================

        const hit =
            weaponCombat(
                attacker,
                target
            );


        // ======================
        // INVERTER ROTAÇÃO
        // ======================

        // somente quando o golpe realmente acertou
        // (esquiva não inverte)

        if (hit) {

            weapon.rotationDirection *=
                -1;
        }
    }
}



// ======================================================
// CHAIN WEAPON COLLISION
// ======================================================

function chainWeaponCollision(
    attacker,
    target
) {

    if (attacker === target) {
        return;
    }


    const weapon =
        attacker.weapon;


    const chain =
        weapon.chain;


    const segments =
        chain.segments;



   



    // ======================
    // CADA PAR DE SEGMENTOS
    // ======================

    for (
        let i = 1;
        i < segments.length;
        i++
    ) {

        const start =
            segments[i - 1];


        const end =
            segments[i];



        const distance =

            distancePointToSegment(

                target.x,
                target.y,

                start.x,
                start.y,

                end.x,
                end.y
            );



        const radius =

            Math.max(

                start.radius,

                end.radius
            );



        // ======================
        // COLISÃO
        // ======================

        if (
            distance <=
            radius + target.radius
        ) {





            // ======================
            // DANO
            // ======================


                weaponCombat(
                    attacker,
                    target
                );


            

            return;
        }
    }
}



// ======================================================
// WEAPON COLLISION
// ======================================================

function weaponCollision(
    attacker,
    target
) {

    if (!attacker.weapon) {
        return;
    }


    switch (
        attacker.weapon.type
    ) {

        case "orbit":

            orbitWeaponCollision(
                attacker,
                target
            );

            break;


        case "chain":

            chainWeaponCollision(
                attacker,
                target
            );

            break;
    }
}