// ======================
// STEPHANNY
// ======================



function drawPoisonOutput(player){

    const output =
    player.skillObjects.poisonOutput;

    if(!output){
        return;
    }

    const alpha =
    1 - (
        output.radius /
        output.maxRadius
    );

    const pulse =

    Math.sin(
        performance.now() * 0.02
    ) * 4;

    const ringWidth =
    18 + pulse;

    // ======================
    // ANEL EXTERNO
    // ======================

    ctx.beginPath();

    ctx.arc(

        player.x,

        player.y,

        output.radius,

        0,

        Math.PI * 2

    );

    ctx.strokeStyle =
    `rgba(180,0,255,${alpha})`;

    ctx.lineWidth =
    ringWidth;

    ctx.stroke();

    // ======================
    // BRILHO INTERNO
    // ======================

    ctx.beginPath();

    ctx.arc(

        player.x,

        player.y,

        output.radius,

        0,

        Math.PI * 2

    );

    ctx.strokeStyle =
    `rgba(255,255,255,${alpha * 0.5})`;

    ctx.lineWidth =
    4;

    ctx.stroke();

    // ======================
    // NÚCLEO TÓXICO
    // ======================

    ctx.beginPath();

    ctx.arc(

        player.x,

        player.y,

        output.radius,

        0,

        Math.PI * 2

    );

    ctx.strokeStyle =
    `rgba(120,0,200,${alpha})`;

    ctx.lineWidth =
    10;

    ctx.stroke();

    for(let i = 0; i < 15; i++){

    const angle =
    Math.random() * Math.PI * 2;

    const distance =
    output.radius +
    (Math.random() * 10 - 5);

    const x =
    player.x +
    Math.cos(angle) *
    distance;

    const y =
    player.y +
    Math.sin(angle) *
    distance;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        3,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
    `rgba(180,0,255,${
        alpha * 0.8
    })`;

    ctx.fill();
}
}
function drawPoisonPool(player){

    const pools =
    player.arenaObjects.poisonPool;

    for(const pool of pools){

        // =====================
        // POÇA PRINCIPAL
        // =====================

        ctx.beginPath();

        ctx.arc(

            pool.x,
            pool.y,

            pool.radius,

            0,
            Math.PI * 2

        );

        ctx.fillStyle =
        "rgba(128,0,128,0.35)";

        ctx.fill();


        // =====================
        // BOLHAS DA BORDA
        // =====================

        const bubbleCount = 12;

        for(let i = 0; i < bubbleCount; i++){

            const angle =
            (i / bubbleCount) * Math.PI * 2;


            // Offset para ficar irregular
            const randomOffset =
            Math.sin(i * 7) * 6;


            const distance =
            pool.radius + randomOffset;


            const bubbleX =
            pool.x +
            Math.cos(angle) * distance;


            const bubbleY =
            pool.y +
            Math.sin(angle) * distance;


            // Tamanhos variados
            const bubbleRadius =
            4 + (i % 3) * 3;


            ctx.beginPath();

            ctx.arc(

                bubbleX,
                bubbleY,

                bubbleRadius,

                0,
                Math.PI * 2

            );

            ctx.fillStyle =
           "rgb(211, 91, 211)";

            ctx.fill();
        }
    }
}