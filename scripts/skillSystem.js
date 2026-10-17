



///funcao para verificar se a passiva pode ser stivada
function Passive(player) {

    const characterName = player.character.name;
    const passive = skill[characterName].passive;

    for (const event of player.events) {

        if (passive.trigger !== event.type) {
            continue;
        }

        console.log(event.type);

        skillFunction[characterName].passive(
            player,
            event
        );
    }
}





//funcao para ativar a skill active

function Active(player){

     if(IsStunned(player)){
    return;
}


    console.log("active", player.character.name)
const characterName = player.character.name;

skillFunction[characterName].active(player);


}






function ultimate(){

}


function updateSkills(player) {

   

        Passive(player);

    

    }



