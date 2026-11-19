


///funcao para verificar se a passiva pode ser stivada
function Passive(player) {

    const characterName = player.character.name;
    const passive = skill[characterName].passive;

    for (const event of player.events) {

        if (passive.trigger !== event.type) {
            continue;
        }

        console.log(event.type);


        const result = skillFunction[characterName].passive(
            player,
            event
        );

        // false = a passiva não fez efeito (ex.: ainda não chegou em 5/5)
        if (result === false) {
            continue;
        }

        player.skillObjects.passive.activations++;
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


function getPassiveView(player) {

    const passive = skill[player.character.name]?.passive;

    if (!passive) {
        return null;
    }

    const state = player.skillObjects.passive;

    return {
        name: passive.name,
        description: passive.description || "",
        icon: passive.icon || null,

        progress: passive.req
            ? { current: state?.progress ?? 0, required: passive.req }
            : null,

        activations: state?.activations ?? 0
    };
}