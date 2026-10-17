function addActiveMeter(player, value){

player.activeBar +=  value


if(player.activeBar >= player.activeBarMax){
player.activeBar = 0;

Active(player)
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