// ======================
// LOOP PRINCIPAL
// ======================
let game = true;

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d")



initializeArena()

function loop() {
  if(loadedAssets < totalAssets){
        requestAnimationFrame(loop);
        return;
  }

    // encerra jogo
    if (!game) {
        return;
    }
    


    // limpa tela
    clearScreen();


    // atualizar
    update();
   // desenha jogo
    
    
    
    render();

    // próximo frame
    requestAnimationFrame(loop);
}

// ======================
// UPDATE
// ======================

function update() {
    


    // movimento

    updateSubArchetype(player1);
    updateSubArchetype(player2);


    updateMove(player1);
    updateMove(player2);

    updateWeapon(player1);
    updateWeapon(player2);

    
    // colisão
    
        weaponCollision(player1, player2);
    
    weaponCollision(player2, player1);
     collision(player1, player2);
     
     updateActiveMeter(player1)
     updateActiveMeter(player2)

     updateSkillObjects(player1)
     updateSkillObjects(player2)

     updateEffects(player1);
     updateEffects(player2);
     
     updateEvents(player1)
     updateEvents(player2)

     updateStates(player1);
     updateStates(player2)
     

     updateDamageText();
 
    // cooldowns
    updateCooldown(player1);
    updateCooldown(player2);

    // verifica fim do jogo
    GameOver();
}

// ======================
// RENDER
// ======================

function render() {

    drawArena()

    drawSkillObjects(player1);
    drawSkillObjects(player2);

    drawPlayer(player1);
    drawPlayerHp(player1);
updateHpBar(player1, hpP1)
updateActiveBar(player1, activeP1)

     
    drawPlayer(player2);
    drawPlayerHp(player2);
updateHpBar(player2, hpP2)
updateActiveBar(player2, activeP2)
    drawWeapon(player1);
    drawWeapon(player2);

    drawWeaponHitbox(player1);
    drawWeaponHitbox(player2);
    
    drawDamageText();

    
    drawUi();
    
    
    
}

// ======================
// LIMPA TELA
// ======================

function clearScreen() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

// ======================
// COOLDOWNS
// ======================

function updateCooldown(player) {

    if (player.hitCooldown > 0) {

        player.hitCooldown--;
    }
}

// ======================
// GAME OVER
// ======================

function GameOver() {

    if (

        player1.hp <= 0 ||

        player2.hp <= 0
    ) {

        game = false;


        // empate
        if (

            player1.hp <= 0 &&

            player2.hp <= 0
        ) {

            console.log("EMPATE");
        }


        // player1 venceu
        else if (

            player1.hp > 0
        ) {

            console.log(player1.character.name, "Win - 'Tragam um desafio de verdade!'");
        }


        // player2 venceu
        else {

            console.log(player2.character.name, "Win - 'Haha!'");
        }
    }
}


loop();