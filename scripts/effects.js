function updatePoison(player){

     const poison = player.effects.poison;

    if(!poison){
        return;
}




poison.tick--;

if(poison.tick <= 0 ){


    let poisonDamage = player.hp * poison.damagePer;

poisonDamage = Math.max(poisonDamage, poison.minDamagePer);

    player.hp -=  poisonDamage;      

    createHitFlash(player, 5, "purple")
    
    console.log(player.character.name+" POISON DAMAGE:"+ poisonDamage )

    poison.tick = poison.tickRate
}
  

}

















function updateEffects(player){

    updatePoison(player);

   
}
