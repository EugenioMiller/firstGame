let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d'); 
let fps= 50;

let anchoF = 50;
let altoF = 50;

let pasto = '#02660c'; //0
let tierra = '#400f06'; //2
let agua = '#007994'; //1
let llave = '#f7f014' //3
let puerta = '#453c38' //4

let escenario = [
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,0,0,0,3,2,0,0,0,0,0,0,0,0,0,0,0,2,4,0],
    [0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,2,0,0],
    [0,0,0,2,2,0,2,0,0,0,0,0,0,0,0,2,2,2,0,0],
    [0,0,2,2,0,0,2,2,0,0,0,0,0,2,2,2,0,0,0,0],
    [0,0,2,0,0,0,0,2,0,0,0,2,2,2,2,0,0,0,0,0],
    [0,0,2,0,0,0,0,2,2,0,0,2,0,0,0,0,0,0,0,0],
    [0,2,2,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
    [0,2,2,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1]
];

function dibujaEscenario() {
    let color;

    for (let y=0; y < 10; y++){
        for (let x=0; x < 20; x++){
            if (escenario[y][x] == 0){
                color = pasto; 
            }
            if (escenario[y][x] == 1){
                color = agua;
            }
            if (escenario[y][x] == 2){
                color = tierra;
            }
            if (escenario[y][x] == 3){
                color = llave;
            }
            if (escenario[y][x] == 4){
                color = puerta;
            }


            ctx.fillStyle = color;
            ctx.fillRect(x*anchoF, y*altoF, anchoF, altoF); 
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

//Creo el objeto jugador
let jugador = function(){
    this.x = 1;
    this.y = 8;
    this.color = '#f71000';
    this.llave = false;

    this.dibujar = function(){
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x*anchoF, this.y*altoF, anchoF, altoF); 
    }

    //Creo los márgenes, para que no se salga del laberinto
    this.margenes = function(x, y){
        let colision = false;

        if (escenario[y][x] == 0){
            colision = true;
        }

        return (colision);
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
        if (escenario[this.y][this.x] == 4){

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

    prota.dibujar();
}