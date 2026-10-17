const arenaMaps = {

  map1:  {
    name: "slaoq", 
    type: "rectangle",

    x: 0,
    y: 0,

    radius: 580,

    width: 1000,
    height: 550,

    color: "#181818",

    borderColor: "white",

    borderWidth: 4
},


  map2:  {
    name: "slaoqlei", 
    type: "oval",

    x: 0,
    y: 0,

    radius: 580,

    width: 1000,
    height: 600,

    color: "#181818",

    borderColor: "white",

    borderWidth: 4
},

  map3:  {
    name: "slaoqla", 
    type: "circle",

    x: 0,
    y: 0,

    radius: 200,

    width: 1000,
    height: 550,

    color: "#181818",

    borderColor: "white",

    borderWidth: 4
},
   map4: {

    name: "Hexagon",

    type: "hexagon",

    x: 0,
    y: 0,

  radius: 300,

width: 1000,
height: 700,

    color: "#181818",

    borderColor: "white",

    borderWidth: 4
}
}


function initializeArena() {

    arena.x =
        canvas.width / 2;

    arena.y =
        canvas.height / 2;
}



const arena = arenaMaps.map2
