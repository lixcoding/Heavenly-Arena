const skill = {

    Van: {
   
        passive: {
            name: "Rainbolt",
            trigger: "Collision"
        },
        active: {
            name: "Shockwave",
            chargeTime: 0.1637,
            chargeHit: 1

    }
},

    Lance: {
   
        passive: {
            name: "BloodThirsty",
            trigger: "weaponHit"
        },
        active: {
            name: "Sword Dance",
        chargeTime: 100 / (10*60),
            chargeHit: 1,
            speedBonus: 20,
            duration: 180,
            rotationBonus: 0.6,
            evadeBonus: 1


    }
},
     Stephany: {
   
         passive: {
            name: "Toxic",
            trigger: "weaponHit",
            hitReq: 5,
               damagePer: 0.01,
               maxDamagePer: 0.075,
               minDamagePer: 0.5,
                    tick: 60,
                    tickRate: 40
           
        },
        active: {
            name: "SludgeBomb",
        chargeTime:  100 / (15*60),
            chargeHit: 0.5,
            poisonLimit: 0.075,

            // explosao

                radius: 0,
                maxRadius: 200,
                growth: 6,
                knockback: 30,




    }
}
}


