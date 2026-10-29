// ======================
// DESENHAR ARMA
// ======================

function drawWeapon(player) {

    if (!player.weapon) {
        return;
    }

    switch (player.weapon.type) {

        case "orbit":

            drawOrbitWeapon(player);

            break;


        case "chain":

            drawChainWeapon(player);

            break;
    }
}



// ======================
// DESENHAR ORBIT
// ======================

function drawOrbitWeapon(player) {

    const weapon = player.weapon;

    if (!weapon || !weapon.sprite) {
        return;
    }

    ctx.save();

    ctx.imageSmoothingEnabled = false;


    // posição da arma
    ctx.translate(
        weapon.x,
        weapon.y
    );


    // rotação da arma
    ctx.rotate(
        weapon.angle +
        weapon.spriteAngle
    );


    // sprite
    ctx.drawImage(

        weapon.sprite,

        -weapon.pivotX,
        -weapon.pivotY,

        weapon.spriteWidth,
        weapon.spriteHeight
    );


    ctx.restore();
}



// ======================
// DESENHAR CHAIN / CAUDA
// ======================

function drawChainWeapon(player) {

    const weapon = player.weapon;

    if (!weapon || !weapon.chain) {
        return;
    }

    if (!weapon.sprite) {
        return;
    }


    const chain =
        weapon.chain;

    const segments =
        chain.segments;

    const sprite =
        weapon.sprite;


    if (segments.length < 2) {
        return;
    }


    if (
        !sprite.complete ||
        sprite.naturalWidth === 0
    ) {
        return;
    }


    // ======================
    // SPRITE
    // ======================

    const spriteWidth =
        sprite.naturalWidth;

    const spriteHeight =
        sprite.naturalHeight;


    // quantidade de trechos físicos
    const pieceCount =
        segments.length - 1;


    // largura de cada pedaço da imagem
    const sourcePieceWidth =
        spriteWidth / pieceCount;


    // altura visual da cauda
    const drawHeight =
        chain.spriteHeight || 35;


    // evita pequenos espaços
    const overlap =
        chain.spriteOverlap || 0;


    // correção opcional da direção
    const spriteAngle =
        chain.spriteAngle || 0;


    ctx.save();

    ctx.imageSmoothingEnabled = false;


    // ======================
    // CADA TRECHO DA CAUDA
    // ======================

    for (
        let i = 0;
        i < segments.length - 1;
        i++
    ) {

        const start =
            segments[i];

        const end =
            segments[i + 1];


        // direção
        const dx =
            end.x - start.x;

        const dy =
            end.y - start.y;


        // comprimento real deste trecho
        const distance =
            Math.hypot(dx, dy);


        if (distance === 0) {
            continue;
        }


        // direção do trecho
        const angle =
            Math.atan2(dy, dx);


        // ======================
        // PARTE CORRESPONDENTE
        // DO SPRITE
        // ======================

        const sourceX =
            i * sourcePieceWidth;


        let sourceWidth =
            sourcePieceWidth;


        if (i === pieceCount - 1) {

            sourceWidth =
                spriteWidth - sourceX;

        }


        ctx.save();


        // coloca a origem no segmento
        ctx.translate(
            start.x,
            start.y
        );


        // aponta para o próximo segmento
        ctx.rotate(
            angle + spriteAngle
        );

ctx.drawImage(
    sprite,

    sourceX,
    0,
    sourceWidth,
    spriteHeight,

    chain.spriteOffsetX,
    -drawHeight / 2 + chain.spriteOffsetY,

    distance + overlap,
    drawHeight
);

        ctx.restore();
    }


    ctx.restore();
}



// ======================
// DESENHAR HITBOX
// ======================

function drawWeaponHitbox(player) {

    if (!player.weapon) {
        return;
    }


    if (
        player.weapon.showHitbox === false
    ) {
        return;
    }


    switch (player.weapon.type) {

        case "orbit":

            drawOrbitWeaponHitbox(player);

            break;


        case "chain":

            drawChainWeaponHitbox(player);

            break;
    }
}



// ======================
// HITBOX CHAIN
// ======================

function drawChainWeaponHitbox(player) {

    if (
        !player.weapon ||
        !player.weapon.chain
    ) {
        return;
    }


    const chain =
        player.weapon.chain;

    const segments =
        chain.segments;


    if (segments.length < 2) {
        return;
    }


    ctx.lineWidth = 1.5;


    // ======================
    // ESPINHA CENTRAL
    // ======================

    ctx.strokeStyle =
        "rgba(0, 255, 255, 0.6)";


    ctx.beginPath();


    ctx.moveTo(
        segments[0].x,
        segments[0].y
    );


    for (
        let i = 1;
        i < segments.length;
        i++
    ) {

        ctx.lineTo(
            segments[i].x,
            segments[i].y
        );

    }


    ctx.stroke();



    // ======================
    // CONTORNO
    // ======================

    ctx.strokeStyle =
        "rgba(255, 0, 0, 0.8)";


    ctx.beginPath();


    const leftSides = [];

    const rightSides = [];


    for (
        let i = 0;
        i < segments.length - 1;
        i++
    ) {

        const start =
            segments[i];

        const end =
            segments[i + 1];


        const rStart =
            start.radius;


        const rEnd =
            (i === segments.length - 2)
                ? 0
                : end.radius;


        const dx =
            end.x - start.x;

        const dy =
            end.y - start.y;


        const dist =
            Math.hypot(dx, dy);


        if (dist === 0) {
            continue;
        }


        const angle =
            Math.atan2(dy, dx);


        const dr =
            rStart - rEnd;


        const sinAlpha =
            dr / dist;


        const alpha =
            Math.asin(

                Math.max(
                    -1,
                    Math.min(
                        1,
                        sinAlpha
                    )
                )

            );


        const angleLeft =
            angle +
            Math.PI / 2 +
            alpha;


        const angleRight =
            angle -
            Math.PI / 2 -
            alpha;


        leftSides.push({

            x:
                start.x +
                Math.cos(angleLeft) *
                rStart,

            y:
                start.y +
                Math.sin(angleLeft) *
                rStart

        });


        rightSides.push({

            x:
                start.x +
                Math.cos(angleRight) *
                rStart,

            y:
                start.y +
                Math.sin(angleRight) *
                rStart

        });


        if (
            i ===
            segments.length - 2
        ) {

            leftSides.push({

                x: end.x,
                y: end.y

            });


            rightSides.push({

                x: end.x,
                y: end.y

            });

        }
    }


    if (leftSides.length > 0) {

        ctx.moveTo(

            leftSides[0].x,
            leftSides[0].y

        );


        for (
            let i = 1;
            i < leftSides.length;
            i++
        ) {

            ctx.lineTo(

                leftSides[i].x,
                leftSides[i].y

            );

        }
    }


    if (rightSides.length > 0) {

        for (
            let i =
                rightSides.length - 1;

            i >= 0;

            i--
        ) {

            ctx.lineTo(

                rightSides[i].x,
                rightSides[i].y

            );

        }
    }


    ctx.closePath();

    ctx.stroke();



    // ======================
    // CÍRCULOS DEBUG
    // ======================

    ctx.strokeStyle =
        "rgba(255, 0, 0, 0.3)";


    for (
        let i = 0;
        i < segments.length;
        i++
    ) {

        const r =
            (i === segments.length - 1)
                ? 0
                : segments[i].radius;


        if (r <= 0) {
            continue;
        }


        ctx.beginPath();


        ctx.arc(

            segments[i].x,
            segments[i].y,

            r,

            0,
            Math.PI * 2

        );


        ctx.stroke();
    }
}



// ======================
// HITBOX ORBIT
// ======================

function drawOrbitWeaponHitbox(player) {

    const weapon =
        player.weapon;

    const hitbox =
        weapon.hitbox;


    ctx.strokeStyle =
        "red";

    ctx.lineWidth =
        3;


    // linha
    ctx.beginPath();

    ctx.moveTo(
        hitbox.startX,
        hitbox.startY
    );

    ctx.lineTo(
        hitbox.endX,
        hitbox.endY
    );

    ctx.stroke();


    // start
    ctx.beginPath();

    ctx.arc(

        hitbox.startX,
        hitbox.startY,

        hitbox.radius,

        0,
        Math.PI * 2
    );

    ctx.stroke();


    // end
    ctx.beginPath();

    ctx.arc(

        hitbox.endX,
        hitbox.endY,

        hitbox.radius,

        0,
        Math.PI * 2
    );

    ctx.stroke();
}