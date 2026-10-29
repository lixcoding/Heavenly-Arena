function drawPlayer(ball) {

    // --------------------------------------------------
    // LÓGICA DINÂMICA DE SELEÇÃO DO PORTRAIT
    // --------------------------------------------------

    const portraits = ball.character?.portrait;

    let portraitImg = null;

    if (portraits) {

        const portraitState = ball.state?.portrait;

        // 1. PORTRAIT DE DANO
        if (
            portraitState?.type === "pain" &&
            portraits.painPortrait
        ) {
            portraitImg = portraits.painPortrait;

        // 2. FLASH / HIT
        } else if (
            ball.skillObjects?.hitFlash &&
            portraits.angryPortrait
        ) {
            portraitImg = portraits.angryPortrait;

        // 3. DEFAULT
        } else {
            portraitImg =
                portraits.defaultPortrait ||
                portraits.angryPortrait;
        }
    }


    ctx.save();


    // --------------------------------------------------
    // 1. DESENHAR A BORDA EXTERNA
    // --------------------------------------------------

    ctx.beginPath();

    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );


    const flash = ball.skillObjects?.hitFlash;

    if (flash) {

        ctx.fillStyle =
            flash.duration % 2 === 0
                ? flash.color
                : ball.color;

    } else {

        ctx.fillStyle = ball.color;

    }

    ctx.fill();


    // --------------------------------------------------
    // 2. RECORTAR O INTERIOR
    // --------------------------------------------------

    const borderWidth = 4;

    const innerRadius =
        ball.radius - borderWidth;


    if (innerRadius > 0) {

        ctx.beginPath();

        ctx.arc(
            ball.x,
            ball.y,
            innerRadius,
            0,
            Math.PI * 2
        );

        ctx.clip();


        // --------------------------------------------------
        // 3. DESENHAR PORTRAIT
        // --------------------------------------------------

        if (
            portraitImg &&
            portraitImg.complete &&
            portraitImg.naturalWidth !== 0
        ) {

            const size = innerRadius * 2;

            ctx.drawImage(
                portraitImg,
                ball.x - innerRadius,
                ball.y - innerRadius,
                size,
                size
            );

        } else {

            ctx.fillStyle = "#333";
            ctx.fill();

        }
    }


    ctx.restore();
}
// / ======================
// DESENHAR PLAYER
// ======================


function drawArena() {

    switch (arena.type) {

        case "hexagon":

    drawHexagonArena();

    break;

        case "rectangle":

            drawRectangleArena();

            break;


        case "circle":

            drawCircleArena();

            break;


        case "oval":

            drawOvalArena();

            break;
    }
}

function drawCircleArena() {

    ctx.fillStyle =
        arena.color;

    ctx.strokeStyle =
        arena.borderColor;

    ctx.lineWidth =
        arena.borderWidth;


    ctx.beginPath();

    ctx.arc(
        arena.x,
        arena.y,
        arena.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.stroke();
}
function drawOvalArena() {

    ctx.fillStyle =
        arena.color;

    ctx.strokeStyle =
        arena.borderColor;

    ctx.lineWidth =
        arena.borderWidth;


    ctx.beginPath();

    ctx.ellipse(
        arena.x,
        arena.y,

        arena.width / 2,
        arena.height / 2,

        0,

        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.stroke();
}

function drawHexagonArena() {

    const vertices =
        getHexagonVertices();


    if (
        vertices.length === 0
    ) {

        return;
    }


    ctx.beginPath();


    // primeiro ponto

    ctx.moveTo(
        vertices[0].x,
        vertices[0].y
    );


    // demais pontos

    for (
        let i = 1;
        i < vertices.length;
        i++
    ) {

        ctx.lineTo(
            vertices[i].x,
            vertices[i].y
        );
    }


    // conecta último
    // com primeiro

    ctx.closePath();


    // ======================
    // FUNDO
    // ======================

    ctx.fillStyle =
        arena.color;

    ctx.fill();


    // ======================
    // BORDA
    // ======================

    ctx.strokeStyle =
        arena.borderColor;

    ctx.lineWidth =
        arena.borderWidth;

    ctx.stroke();
}

function drawRectangleArena() {

    const x =
        arena.x -
        arena.width / 2;

    const y =
        arena.y -
        arena.height / 2;


    ctx.fillStyle =
        arena.color;

    ctx.strokeStyle =
        arena.borderColor;

    ctx.lineWidth =
        arena.borderWidth;


    ctx.fillRect(
        x,
        y,
        arena.width,
        arena.height
    );


    ctx.strokeRect(
        x,
        y,
        arena.width,
        arena.height
    );
}



function drawUi(){
 
         
}



function drawSkillObjects(player){

    // stephany
    drawPoisonOutput(player)
    drawPoisonPool(player)



    // lance



}