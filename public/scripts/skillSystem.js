


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
//
// Devolve true se a skill foi ativada e false se não pôde ser usada.
// Quem chama (addActiveMeter) só zera a barra quando devolve true.
//
// Cada skillFunction[nome].active devolve false quando não consegue
// ativar; qualquer outro retorno (inclusive undefined) conta como sucesso.

function Active(player){

    if(IsStunned(player)){
        return false;
    }

    const characterName = player.character.name;

    const result = skillFunction[characterName].active(player);

    if(result === false){
        return false;
    }

    console.log("active", characterName);

    return true;
}






function ultimate(){

}


function updateSkills(player) {



        Passive(player);



    }



