var canvas;
var context;
var keysPressed = [];
var matrizCampos = [];
var tamanho = 32;
var estado_jogo = 0;
var num_linhas = 10;
var num_colunas = 10;
var num_bombas = 10;
var num_numeros = num_linhas * num_colunas - num_bombas

window.onload = function(){
    startUp();
}

$(document).keydown(function(e){
    var haskey = keysPressed[e.keyCode];
    if(!haskey){
        keysPressed[e.keyCode] = true;
    }
});

$(document).keyup(function(e){
    keysPressed[e.keyCode] = false;
});

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}


function startUp(){
    canvas = document.getElementById('game_canvas');
    context = canvas.getContext('2d');
    criarCampos(num_linhas, num_colunas, num_bombas);
    canvas.setAttribute('height', num_linhas * tamanho);
    canvas.setAttribute('width', num_colunas * tamanho);
    drawMatriz();
    var num_abertos = 0;

    canvas.addEventListener('mousedown', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        linha = Math.floor(mousePos.y/tamanho)
        coluna = Math.floor(mousePos.x/tamanho)
        matrizCampos[linha][coluna].mostrar = true;
        if (estado_jogo){
            reiniciar();
        }
        if (matrizCampos[linha][coluna] instanceof Bomba){
            gameOver();
        }
        else{
            num_abertos++;
            if (num_abertos >= num_numeros){
                estado_jogo = 1;
            }
        }
        drawMatriz();
    }, false);
}

function gameLoop(){
    drawMatriz();
//    clearCanvas();
}

function reiniciar(){
    estado_jogo = 0;
    criarCampos(num_linhas, num_colunas, num_bombas);
    clearCanvas();

}

function gameOver(){
    estado_jogo = -1;
    for(i=0; i<matrizCampos.length; i++){
        for(j=0; j<matrizCampos[i].length; j++){
            matrizCampos[i][j].mostrar = true;
        }
    }
}

function drawMatriz(){
    for(i=0; i<matrizCampos.length; i++){
        for(j=0; j<matrizCampos[i].length; j++){
            context.strokeStyle = "blue";
            context.strokeRect(j*tamanho, i*tamanho, tamanho, tamanho);
            if (matrizCampos[i][j].mostrar){
                if (matrizCampos[i][j] instanceof Bomba){
                    drawBomba(matrizCampos[i][j]);
                }
                else{
                    drawNumero(matrizCampos[i][j]);
                }
            }
        }
    }
    if(estado_jogo == -1){
        context.fillStyle = "red";
        context.font = "bold 12pt sans-serif";
        context.textAlign="center";
        context.fillText("Game Over", context.canvas.clientWidth / 2,
                                      context.canvas.clientHeight / 2);
    }
    if(estado_jogo == 1){
        context.fillStyle = "red";
        context.font = "bold 12pt sans-serif";
        context.textAlign="center";
        context.fillText("You Win!", context.canvas.clientWidth / 2,
                                      context.canvas.clientHeight / 2);
    }
}

function drawBomba(obj){
    context.drawImage(obj.sprite, obj.x, obj.y, 32, 32);
}

function drawNumero(obj){
    context.fillStyle = "rgb(255,255,255)";
    context.fillText(obj.num_bombas, obj.x, obj.y);
}

function clearCanvas(){
    canvas.width = canvas.width;
}

function Bomba(linha, coluna){
    var sprite = new Image();
    sprite.src = "static/images/bomba.png";
    this.sprite = sprite;
    this.x = linha * tamanho;
    this.y = coluna * tamanho;
    this.mostrar = false;
}

function Numero(linha, coluna, num_bombas){
    this.x = linha * tamanho + tamanho/2;
    this.y = coluna * tamanho + tamanho/2;
    this.num_bombas = num_bombas;
    this.mostrar = false;
}

function criarCampos(num_linhas, num_colunas, num_bombas){
    matrizCampos = [];
    for(var i=0; i<num_linhas; i++) {
        matrizCampos[i] = new Array(num_colunas);
    }
    
    bombas_criadas = 0;
    while(bombas_criadas < num_bombas) {
        indice_linha = Math.floor(Math.random() * (num_linhas));
        indice_coluna = Math.floor(Math.random() * (num_colunas));
        if(!matrizCampos[indice_linha][indice_coluna]){
            matrizCampos[indice_linha][indice_coluna] = new Bomba(indice_coluna,
                                                                  indice_linha);
            bombas_criadas ++;
        }
    }

    for(var i=0; i<num_linhas; i++) {
        for(var j=0; j<num_colunas; j++){
            if(!matrizCampos[i][j]){
                bombas = contarBombas(i,j);
                matrizCampos[i][j] = new Numero(j, i, bombas);
            }
        }
    }

}


function contarBombas(linha, coluna){
    bomba = 0;

    if (matrizCampos[linha][coluna -1] instanceof Bomba)
        bomba ++;
    if (matrizCampos[linha][coluna +1] instanceof Bomba)
        bomba ++;

    if ( matrizCampos[linha -1]){
        if (matrizCampos[linha -1][coluna -1] instanceof Bomba)
            bomba ++;
        if (matrizCampos[linha -1][coluna] instanceof Bomba)
            bomba ++;
        if (matrizCampos[linha -1][coluna +1] instanceof Bomba)
            bomba ++;
    }

    if (matrizCampos[linha +1]){
        if (matrizCampos[linha +1][coluna -1] instanceof Bomba)
            bomba ++;
        if (matrizCampos[linha +1][coluna] instanceof Bomba)
            bomba ++;
        if (matrizCampos[linha +1][coluna +1] instanceof Bomba)
            bomba ++;
    }
    return bomba;
}
