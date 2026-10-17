function updateSubArchetype(player) {
  const sub_archetype = player.sub_archetype;
  const sub_archetypeObject = player.sub_archetypeObject;

  sub_archetypeObject.timer--;

  if (sub_archetypeObject.timer > 0) {
    return;
  }




  sub_archetypeObject.timer = sub_archetype.cooldown;

  triggerSubArchetype(player);
}



function triggerSubArchetype(player) {
  player.sub_archetype.behavior(player);
}

function StephannyBehavior(player) {
  const target = player === player1 ? player2 : player1;


if(!target.effects.poison){
    
    AttackTarget(player, target);
}else {
    RetreatTarget(player, target)
}

}


function LanceBehavior(player) {
  const target = player === player1 ? player2 : player1;

 
    AttackTarget(player, target);

}



function AggressiveBehavior(player){
const target = player === player1 ? player2 : player1;

AttackTarget(player, target)

}

function DefensiveBehavior(player) {
  const target = player === player1 ? player2 : player1;

  RetreatTarget(player, target);
}





function AttackTarget(player, target) {
  const dx = target.x - player.x;

  const dy = target.y - player.y;

  const length = Math.hypot(dx, dy);

  if (length === 0) {
    return;
  }

  player.moveVx = dx / length;

  player.moveVy = dy / length;
}



function RetreatTarget(player, target) {
  const dx = player.x - target.x;

  const dy = player.y - target.y;

  const length = Math.hypot(dx, dy);

  if (length === 0) {
    return;
  }

  player.moveVx = dx / length;

  player.moveVy = dy / length;
}
