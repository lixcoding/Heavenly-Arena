function updateCasting(player){


    const casting = player.state.casting

    if(!casting){return;}



    casting.duration--;

 if(casting.duration <= 0){

        casting.duration = 0


  
         player.state.casting = null

    }


} 

function IsCasting(player){

    if(player.state.casting){
        return true
    }
    return false
}





  


function updateStun(player){



    const stunned = player.state.stunned

    
     if(!stunned){return;}



     if(stunned.duration % 8 === 0){
        createHitFlash(player, 30, "yellow");
    }

    stunned.duration--;

    
 if(stunned.duration <= 0){

        stunned.duration = 0

  
         delete player.state.stunned

    }
}

function IsStunned(player){

    if(player.state.stunned){
        return true;
    }

    return false;
}


function updatePortrait(player) {

    for (const event of player.events) {

        if (event.type !== "damageTaken") {
            continue;
        }

        player.state.portrait = {
            type: "pain",
            duration: 40
        };

    }
}
function updatePortraitState(player) {

    const portrait = player.state.portrait;

    if (!portrait) {
        return;
    }

    portrait.duration--;

    if (portrait.duration <= 0) {
        player.state.portrait = null;
    }
}

function updateStates(player){


    updatePortraitState(player)
    updateCasting(player)
    updateStun(player);
}