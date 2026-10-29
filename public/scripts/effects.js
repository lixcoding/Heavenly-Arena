function updatePoison(player){

    const poison = player.effects.poison;

    if(!poison){
        return;
    }


    poison.tick--;

    if(poison.tick > 0){
        return;
    }

    poison.tick = poison.tickRate;


    let poisonDamage = player.hp * poison.damagePer;

    poisonDamage = Math.max(poisonDamage, poison.minDamagePer);


    // nunca tira mais vida do que o jogador tem
    // (o HP não fica negativo)
    const dealt = Math.min(poisonDamage, player.hp);

    if(dealt <= 0){
        return;
    }

    player.hp = Math.max(0, player.hp - dealt);


    createHitFlash(player, 5, "purple")

    // número de dano flutuante, em roxo
    createDamageText(
        player.x,
        player.y,
        dealt,
        "purple"
    );

    // eventos genéricos de dano (portrait de dor, etc).
    // poison.source é quem aplicou o veneno.
    damageTaken(player, poison.source, dealt);

    if(poison.source){
        damageDealt(poison.source, player, dealt);
    }

    console.log(player.character.name+" POISON DAMAGE:"+ dealt )
}









function updateEffects(player){

    updatePoison(player);


}
