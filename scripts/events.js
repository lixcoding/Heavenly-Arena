function damageTaken(player, attacker, damage) {

player.events.push({
        type: "damageTaken",
        attacker: attacker,
        damage: damage
    })

}


function damageDealt(player, target, damage) {

    player.events.push({
        type: "damageDealt",
        target: target,
        damage: damage
    })

}


function weaponHit(player, target, damage) {

    player.events.push({
        type: "weaponHit",
        target: target,
        damage: damage
    })


}


function playerCollision(player, other) {

   player.events.push({
        type: "Collision",
      other: other
    })

}


function criticalHit(player, target, damage) {

    player.events.push({
        type: "criticalHit",
        target: target,
        damage: damage
    })

}

function clearEvents(player){
    
    player.events = []

    
}



function updateEvents(player) {

    updateSkills(player);

    updatePortrait(player)
    // futuramente:
    // updateEffects(player);
    // updateStates(player);

    clearEvents(player);
}
