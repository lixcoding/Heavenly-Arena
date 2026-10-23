function addActiveMeter(player, value){

    player.activeBar += value

    if(player.activeBar < player.activeBarMax){
        return;
    }

    // só gasta a barra se a skill realmente foi ativada.
    // Se não pôde ser usada (stun, sem alvo envenenado, skill
    // já ativa...), a barra fica cheia e tenta de novo depois.
    if(Active(player)){
        player.activeBar = 0;
    } else {
        player.activeBar = player.activeBarMax;
    }
}

function addUltimateMeter(player, value){

player.ultimateBar +=  value

if(player.ultimateBar >= player.ultimateBarMax){
player.ultimateBar = 0;

ultimate(player);
}
}



function updateActiveMeter(player){

    const characterName = player.character.name;

    const active = skill[characterName].active

    addActiveMeter(player, active.chargeTime)
}
