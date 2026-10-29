const damageText = [];


function createDamageText(
    x,
    y,
    damage,
    color
){

    damageText.push({
        x: x,
        y: y,
        value: damage,
        color: color || "red",
        life: 60
    })
}

function drawDamageText(){
    for(const text of damageText){
ctx.fillStyle = text.color || "red";
ctx.font = "18px Arial";
ctx.textAlign = "center"


ctx.fillText(

    // dano abaixo de 1 (ex: veneno) aparece com uma casa decimal
    text.value >= 1 ? Math.floor(text.value) : text.value.toFixed(1),
    text.x,
    text.y
)
    }

    ctx.textAlign = "start"
}

function updateDamageText(){

    for(

        let i = damageText.length -1;

        i >= 0;

        i--
    ){

        const text = damageText[i];

        // sobe o texto
        text.y -= 1;

        // diminui vida
        text.life--;

        // remove quando acabar
        if(text.life <= 0){

            damageText.splice(i, 1);
        }
    }
}



function drawHpBar(player,
    x,
    y){
    
    const width = 250;
    const height = 25;
    
    
    ctx.fillStyle = "black";
        
        ctx.fillRect(
            x,
            y,
            width,
            height
            );
            
            
            const hpPercent = player.hp / player.maxHp
            
            ctx.fillStyle = "green";
            
            ctx.fillRect(
                x,
                y,
                width* hpPercent, height);
                
                ctx.fillStyle = "white";
                ctx.font = "18px Arial";
                ctx.fillText(
                    Math.floor(player.hp)+ " HP",
    x + 10,                     
    y + 18
                    
                    );
    }
    
    function drawPlayerHp(player){


    ctx.font = "18px Arial";

    ctx.textAlign = "center";

const text = Math.floor(player.hp);

const x = Math.round(player.x)

const y = Math.round(player.y + player.radius + 20);

ctx.strokeStyle = "black";

ctx.lineWidth = 4;

ctx.strokeText(
    text, 
    x,
    y);



    ctx.fillStyle = "white";


    ctx.fillText(

        Math.floor(player.hp),

        player.x,

        player.y +
        player.radius +
        20
    );


    ctx.textAlign = "start";
}

function drawActiveBar(player, x, y){

    const width = 250;
    const height = 12;

    // fundo
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, width, height);

    // preenchimento
    const percent = player.activeBar / player.activeBarMax;

    ctx.fillStyle = "cyan";
    ctx.fillRect(x, y, width * percent, height);

    // texto
//    ctx.fillStyle = "white";
//     ctx.font = "12px Arial";
//     ctx.textAlign = "center";

//     ctx.fillText(
//         Math.floor(player.activeBar) + " / " + player.activeBarMax,
//         x + width / 2,
//      y + 10
//     );

    ctx.textAlign = "start";
}



const hpP1 =
    document.getElementById("hp-fill-p1");

const hpP2 =
    document.getElementById("hp-fill-p2");


    function updateHpBar(
    player,
    hpElement
) {

    let percentage =
        player.hp /
        player.maxHp *
        100;


    percentage =
        Math.max(
            0,
            Math.min(
                percentage,
                100
            )
        );


    hpElement.style.width =
        percentage + "%";
}




activeP1 = document.getElementById("skill-fill-p1");


activeP2 = document.getElementById("skill-fill-p2"); 
function updateActiveBar(player,  skillElement){
    let percentage = player.activeBar / player.activeBarMax *100


    percentage = Math.max( 0, Math.min(percentage, 100));

     skillElement.style.width =
        percentage + "%";
}
