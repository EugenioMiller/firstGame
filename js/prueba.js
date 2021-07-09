let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d'); 
let fps= 50;

let anchoF = 50;
let altoF = 50;

let tileMap;
let enemigo = []; 

let pasto = '#02660c'; //0
let tierra = '#400f06'; //2
let agua = '#007994'; //1
let llave = '#f7f014' //3
let puerta = '#453c38' //4

let escenario = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,2,1,0],
    [0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,2,0,0],
    [0,0,0,2,2,0,2,0,0,0,0,0,0,0,0,2,2,2,0,0],
    [0,0,2,2,0,0,2,2,0,0,0,0,0,2,2,2,2,0,0,0],
    [0,0,2,0,0,0,0,2,0,0,0,2,2,2,2,0,0,0,0,0],
    [0,0,2,0,0,0,0,2,2,0,0,2,0,0,0,0,0,0,0,0],
    [0,2,2,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
    [0,2,2,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

function dibujaEscenario() {

    for (let y=0; y < 10; y++){
        for (let x=0; x < 20; x++){
            let tile = escenario[y][x];
            ctx.drawImage(tileMap, tile*32, 0, 32, 32, anchoF*x, altoF*y, anchoF, altoF); //-> recorte del tile y dimensiones del mismo
        }
    }
}


//Creo funcionalidad para los botones del teclado
document.addEventListener('keydown', function(tecla){
    //ARRIBA
    if(tecla.keyCode == 38){
        prota.arriba();
    }

    //ABAJO
    if(tecla.keyCode == 40){
        prota.abajo();
    }

    //IZQUIERDA
    if(tecla.keyCode == 37){
        prota.izquierda();
    }

    //DERECHA
    if(tecla.keyCode == 39){
        prota.derecha();
    }
})

//Creo la clase antorcha
let antorcha = function(x, y) {
    this.x = x;
    this.y = y;

    this.retraso = 10;
    this.contador= 0;
    this.fotograma = 0; //Va a ir de 0 a 3

    this.cambiaFotograma = function() {
        if (this.fotograma < 3){
            this.fotograma++;
        }
        else {
            this.fotograma = 0;
        }
    }

    this.dibuja = function() {
        if (this.contador < this.retraso){
            this.contador++;
        }
        else {
            this.contador = 0;
            this.cambiaFotograma();
        }

        ctx.drawImage(tileMap, this.fotograma*32, 64, 32, 32, this.x*anchoF, this.y*altoF, anchoF, altoF); 
    }
}

//Creo la clase enemigo
let malo = function(x, y) {
    this.x = x;
    this.y = y;

    this.direccion = Math.floor(Math.random()*4);

    this.contador = 0;
    this.retraso = 30;

    this.dibujar = function(){
        ctx.drawImage(tileMap, 0, 32, 32, 32, this.x*anchoF, this.y*altoF, anchoF, altoF); 
    }

    this.compruebaColision= function(x, y){
        let colision = false;

        if(escenario[y][x] == 0){
            colision = true;
        }

        return colision;
    }

    this.mueve = function(){

        prota.colisionEnemigo(this.x, this.y);

        if (this.contador < this.retraso){
            this.contador++;
        }
        else {
            this.contador = 0;
            //ARRIBA
            if(this.direccion == 0){
                if(this.compruebaColision(this.x, this.y -1) == false){
                    this.y--;
                }
                else {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }

            //ABAJO
            if(this.direccion == 1){
                if(this.compruebaColision(this.x, this.y + 1) == false){
                    this.y++;
                }
                else {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }

            //IZQUIERDA
            if(this.direccion == 2){
                if(this.compruebaColision(this.x - 1, this.y) == false){
                    this.x--;
                }
                else {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }

            //DERECHA
            if(this.direccion == 3){
                if(this.compruebaColision(this.x + 1, this.y) == false){
                    this.x++;
                }
                else {
                    this.direccion = Math.floor(Math.random()*4);
                }
            }
        }
        
    }

}

//Creo el objeto jugador
let jugador = function(){
    this.x = 1;
    this.y = 8;
    this.llave = false;

    this.dibujar = function(){
        ctx.drawImage(tileMap, 32, 32, 32, 32, this.x*anchoF, this.y*altoF, anchoF, altoF); 
    }

    //Creo los márgenes, para que no se salga del laberinto
    this.margenes = function(x, y){
        let colision = false;

        if (escenario[y][x] == 0){
            colision = true;
        }

        return (colision);
    }

    this.colisionEnemigo = function(x, y){
        if (this.x == x && this.y == y){
            let titulo = document.getElementById('titulo');
            titulo.innerHTML= 'You dead!!';
            this.muerte();
        }
    }

    this.muerte = function(){
        this.x = 1;
        this.y = 8;
        this.llave = false;

        escenario[1][4] = 3; 
    }

    //Creo movimiento del personaje
    this.arriba = function(){
        if (this.margenes(this.x, this.y-1) == false){
            this.y--;
            this.tieneLlave();
        }
    }

    this.abajo = function(){
        if (this.margenes(this.x, this.y+1) == false){
            this.y++;
            this.tieneLlave();
        }
    }

    this.izquierda = function(){
        if (this.margenes(this.x-1, this.y) == false){
            this.x--;
            this.tieneLlave();
        }
    }

    this.derecha = function(){
        if (this.margenes(this.x+1, this.y) == false){
            this.x++;
            this.tieneLlave();
        }
    }

    this.tieneLlave = function(){
        if (escenario[this.y][this.x] == 3){
            this.llave = true;
            escenario[this.y][this.x] = 2;

            let titulo = document.getElementById('titulo');
            titulo.innerHTML= 'You find the key!';     
        }
        if (escenario[this.y][this.x] == 1){

            if (this.llave == true){
                let titulo = document.getElementById('titulo');
                titulo.innerHTML= 'You win!!!';
                setInterval(() => {
                    location.reload();
                }, 2000);
            }
            else {
                let titulo = document.getElementById('titulo');
                titulo.innerHTML= 'You need the key to win';
            }

            
        }
    }
}

//Instancio el objeto
let prota = new jugador();

//Instancio una antorcha
let imagenAntorcha = new antorcha (9, 6);

//Instancio el arreglo enemigos con objetos dentro
enemigo.push(new malo(5, 1));
enemigo.push(new malo(9, 8));
enemigo.push(new malo(15, 3));

tileMap = new Image();
tileMap.src = 'img/tilemap.png';

//--------------------------BUCLE PRINCIPAL DEL JUEGO
setInterval(() => {
    principal();
}, 1000/fps);

function borrarCanvas(){  //Borrar el canvas, para que el objeto aparente movimiento (regresando los valores del canvas a la normalidad)
    canvas.width = 1000;
    canvas.height = 500;
}


function principal(){
    borrarCanvas();
    dibujaEscenario()
    imagenAntorcha.dibuja();

    prota.dibujar();
    
    
    for (let i=0; i< enemigo.length; i++){
        enemigo[i].mueve();
        enemigo[i].dibujar();
    }

}