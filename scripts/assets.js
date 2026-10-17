let totalAssets = 0;
let loadedAssets = 0;

function createAssetImage(src) {

    totalAssets++;

    const img = new Image();

    img.onload = function() {
        loadedAssets++;
        console.log("CARREGOU:", src);
    };

    img.onerror = function() {
        console.error("ERRO AO CARREGAR:", src);
    };

    img.src = src;

    return img;
}

 const assets = {
    weapons: {
        sword: createAssetImage("../assets/weapons/lance/sword.png"),
        stephannyTail: createAssetImage("../assets/weapons/stephanny/stephannyTail.png")
    }, 
    portraits: { 
        van: {
               defaultPortrait: null, //createAssetImage("../assets/portrait/stephannyDefaultPortrait.jpg"),
            angryPortrait:  null, //createAssetImage("../assets/portrait/vanAngry.jpg"),
            painPortrait: null,
            victoryPortrait: null
        },
        lance: {
         defaultPortrait: createAssetImage("../assets/portrait/lance/lanceDefaultPortrait.png"),
            angryPortrait: null,// createAssetImage("./assets/portraits/lanceAngry.jpg"),
            painPortrait: null,
            victoryPortrait: null
        },
        stephanny: {
            defaultPortrait: createAssetImage("../assets/portrait/stephanny/stephannyDefaultPortrait.jpg"),
            painPortrait: createAssetImage("../assets/portrait/stephanny/stephannyDamagedPortrait.png"),
            victoryPortrait: null
        }
    }
};

// Exemplo de como checar se tudo carregou antes de iniciar o loop do jogo
function checkAssetsLoaded() {
    if (loadedAssets === totalAssets) {
        console.log("Todos os assets carregados com sucesso!");
        // startGame(); // Chame sua função de iniciar o jogo aqui
    } else {
        console.log(`Carregando... (${loadedAssets}/${totalAssets})`);
        requestAnimationFrame(checkAssetsLoaded);
    }
}

// Inicia a checagem
checkAssetsLoaded();
