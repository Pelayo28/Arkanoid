window.onload = function () {
//MENÚ
    let menu = document.getElementById("menu");
    menu.onclick=cargarMenu;

    function cargarMenu() {
        let delay = 100;
        setTimeout(function () {
            window.location="Menu.html";
        },delay);
    }
//Juego
    const DESPLAZAMIENTO_X = 1;
    const DESPLAZAMIENTO_Y = 1;
    let vidas=3;
    let puntos = 0;
    let tiempo = 120;


    let pelota = document.getElementById("pelota");
    pelota.style.display="none";
    let raqueta = document.getElementById("raqueta");
    let escenario = document.getElementById("escenario");
    raqueta.style.left = (escenario.offsetWidth/2 - raqueta.offsetWidth/2) +'px';
    let ladrilloObj = document.getElementById("ladrillos");
    let ladrillos = ladrilloObj.getElementsByTagName('img');

    let vidasDiv = document.getElementById("vidas");
    let vidastxt = vidasDiv.getElementsByTagName('p');
    let corazones = vidasDiv.getElementsByTagName('img');
    vidastxt.textContent = "Vidas = " + vidas;
    let puntostxt = document.getElementById("puntos");
    puntostxt.textContent= "Puntos: " + puntos;
    let tiempotxt = document.getElementById("tiempo");
    tiempotxt.textContent = "Tiempo: " + tiempo;

    let comienzo = document.getElementById("comienzo");
    let reinicio = document.getElementById("reinicio");

    let intervalo1;
    let intervalo2;
    let intervaloTiempo;
    let sobrePasaRaqueta = false;
    let va_Hacia_Arriba = true;
    let va_Hacia_Derecha = false;

    crearVidas(vidas);
    let vw = corazones[0].offsetWidth/2;
    let vh = corazones[0].offsetHeight/4;

    document.onkeypress = mover_Raqueta_Tecla;
    escenario.onclick = start;
    document.onmousemove = mover_Raqueta_Mouse;
    reinicio.onclick = reiniciar;
    let pausado = false;
    escenario.ondblclick = pausa_Play;

//Funciones de control del juego
    function start() {
        vw = corazones[0].offsetWidth/2;
        vh = corazones[0].offsetHeight/4;
        crearLadrillos()
        pelota.style.top= (raqueta.offsetTop - raqueta.offsetHeight - pelota.offsetHeight) + "px";
        pelota.style.left= (raqueta.offsetLeft + raqueta.offsetWidth/2) + "px";
        pelota.style.display="block";

        comienzo.style.display="none";
        escenario.onclick = ""; //Para desactivar y que no se ejecute más de una vez
        intervalo1 = setInterval(mover_Pelota, 5);
        intervalo2 = setInterval(mover_Pelota, 5);
        intervaloTiempo = setInterval(function () {
            tiempo--;
            tiempotxt.textContent="Tiempo: " + tiempo;
            if (tiempo==0) {
                game_over();
                clearInterval(intervaloTiempo);
            }else if(puntos!=0){
                puntos-=5;
                puntostxt.textContent="Puntos: " + puntos;
            }
        }, 1000);

        //Para que salga a la derecha o para la izquierda de forma aleatoria
        let random = Math.floor(Math.random() * 2);
        if (random==0) {
            va_Hacia_Derecha=false;
        }else{
            va_Hacia_Derecha=true;
        }
    }

    function pausa_Play() {
        if (intervalo1!=null) {
            if (pausado) {
                pausado=false;
                intervalo1 = setInterval(mover_Pelota, 5);
                intervalo2 = setInterval(mover_Pelota, 5);
                intervaloTiempo = setInterval(function () {
                    tiempo--;
                    tiempotxt.textContent="Tiempo: " + tiempo;
                    if (tiempo==0) {
                        game_over();
                        clearInterval(intervaloTiempo);
                    }else if(puntos!=0){
                        puntos-=5;
                        puntostxt.textContent="Puntos: " + puntos;
                    }
                }, 1000);
            } else {
                pausado=true;
                clearInterval(intervalo1);
                clearInterval(intervalo2);
                clearInterval(intervaloTiempo);
            }
        }
    }

    function game_over() {
        comienzo.style.display="block";
        comienzo.textContent="GAME OVER";
        comienzo.style.color="red";

        //alert('GAME OVER: Te has quedado sin vidas.');
        clearInterval(intervalo1);
        clearInterval(intervalo2);
        clearInterval(intervaloTiempo);
        //PELOTA_MOVIENDO = false;
    }

    function ganar_Juego(){
        for (let i = 0; i < vidas; i++) {
            puntos+=200;
            puntostxt.textContent="Puntos: " + puntos;
        }

        comienzo.style.display="block";
        comienzo.textContent="¡HAS GANADO!";
        comienzo.style.color="green";

        clearInterval(intervalo1);
        clearInterval(intervalo2);
        clearInterval(intervaloTiempo);
    }

    function reiniciar() {
        clearInterval(intervalo1);
        clearInterval(intervalo2);
        clearInterval(intervaloTiempo);
        borrarLadrillos();

        for (const corazon of corazones) {
            corazon.setAttribute("src", "Imagenes/vida_1.png");
            corazon.style.visibility="visible"
        }

        vidas=3;
        puntos=0;
        tiempo=120;
        puntostxt.textContent= "Puntos: " + puntos;
        vidastxt.textContent = "Vidas = " +vidas;
        tiempotxt.textContent = "Tiempo: " + tiempo;

        va_Hacia_Derecha = false;

        sobrePasaRaqueta = false;
        va_Hacia_Arriba = true;
        va_Hacia_Derecha = false;
        escenario.onclick=start;
        pelota.style.display="none";
        comienzo.textContent="Haz click para empezar"
        comienzo.style.color="black";
        comienzo.style.display="block";
        //raqueta.style.left = (escenario.offsetWidth/2 - raqueta.offsetWidth/2) +'px';
    }
//VIDAS
    function crearVidas(vidasNum) {
        vidasDiv = document.getElementById("vidas");

        for (let i = 0; i < vidasNum; i++) {
            //Crear nodo tipo Element
            let img = document.createElement("img");
            //Crear nodo tipo Text
            let contenido = document.createTextNode("");
            img.src="Imagenes/vida_1.png";
            //Añadir el nodo text como hijo del nodo Element
            img.appendChild(contenido);

            vidasDiv.appendChild(img);
        }
    }

    function perderVida(){
        vidas--;
        animar_Perder_Vida();

        if(vidas == 0){
            clearInterval(intervalo1);
            clearInterval(intervalo2);
            game_over();
        }else{
            raquetaLeft = document.getElementById('raqueta').style.left;
            raquetaLeft = parseInt(raquetaLeft);
            pelota.style.top= (raqueta.offsetTop - raqueta.offsetHeight - pelota.offsetHeight) + "px";
            pelota.style.left= (raquetaLeft + raqueta.offsetWidth/2) + "px";
            va_Hacia_Arriba=true;
            sobrePasaRaqueta=false;

            //Para que salga a la derecha o para la izquierda de forma aleatoria
            let random = Math.floor(Math.random() * 2);
            if (random==0) {
                va_Hacia_Derecha=false;
            }else{
                va_Hacia_Derecha=true;
            }
        }
    }

    function animar_Perder_Vida() {
        corazones[vidas].setAttribute("src", "Imagenes/vida_2.png");
        setTimeout(function() {
            corazones[vidas].setAttribute("src", "Imagenes/vida_3.png");
            setTimeout(function() {
                corazones[vidas].setAttribute("src", "Imagenes/vida_4.png");
                setTimeout(function() {
                    corazones[vidas].setAttribute("src", "Imagenes/vida_5.png");
                    //corazones[vidas].setAttribute("visibility", "hidden");
                    corazones[vidas].style.visibility="hidden";
                },120);
            },120);
        },120);
    }
//Ladrillo
    function crearLadrillos() {
        let alto = 0;
        let ancho = vw*9.25;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 8; j++) {
                //Crear nodo tipo Element
                let ladrillo = document.createElement("img");
                //Crear nodo tipo Text
                let contenido = document.createTextNode("");
                ladrillo.src="Imagenes/ladrillo_1.png";
                ladrillo.style.position="absolute";
                ladrillo.style.left = ancho+"px";
                ladrillo.style.top= alto+"px";

                //Añadir el nodo text como hijo del nodo Element
                ladrillo.appendChild(contenido);

                ladrilloObj.appendChild(ladrillo);

                ancho+=vw*8.25;
            }
            alto+=vh*6.5;
            ancho=vw*9.25;
        }
    }

    function borrarLadrillos() {
        for (const ladrillo of ladrillos) {
            ladrillo.style.display="none";
        }
    }

    function elimina_Ladrillo(ladrillo) {
        puntos+=100;
        puntostxt.textContent = "Puntos: " + puntos;
        ladrillo.style.display = "none";
    }
//Movimiento
    function mover_Raqueta_Tecla(evento) {
        let tecla = String.fromCharCode(evento.charCode);
        let raquetaX = raqueta.offsetLeft;
        let anchoRaqueta = raqueta.offsetWidth;

        if((tecla=='z' || tecla=='Z') && !(raquetaX<=0)){
            raqueta.style.left = (raquetaX - 15) + 'px';
        }else if ((tecla=='x' || tecla=='X') && !(raquetaX>=escenario.offsetWidth-anchoRaqueta)){
            raqueta.style.left = (raquetaX + 15) + 'px';
        }else if (raquetaX<=0) {
            raqueta.style.left = 0 + 'px';
        }else if (raquetaX>escenario.offsetWidth-anchoRaqueta) {
            raqueta.style.left = (escenario.offsetWidth-anchoRaqueta) + 'px';
        }
    }

    function mover_Raqueta_Mouse(evento) {
        let posRatonX = evento.clientX;
        let raquetaX = raqueta.offsetLeft;
        let anchoRaqueta = raqueta.offsetWidth;
        let mitad = escenario.offsetLeft + raquetaX+(anchoRaqueta/2);

        if (posRatonX>=escenario.offsetLeft) {//Si la posición del artón está dentro de la pantalla de juego
            if(!((posRatonX-escenario.offsetLeft>escenario.offsetWidth-anchoRaqueta/2))){
                raqueta.style.left = (posRatonX - escenario.offsetLeft -anchoRaqueta/2) + 'px';
                if (posRatonX<mitad && raquetaX<=0) {
                    raqueta.style.left = 0 + 'px';
                }
            }else{
                raqueta.style.left = (escenario.offsetWidth-anchoRaqueta-0.1*vw) + 'px';
            }
        }else{//Si la posición del artón está dentro de la pantalla de menú
            raqueta.style.left = 0 + 'px';
        }
    }

    function mover_Pelota(evento) {
        let rebota = false;
    //Raqueta
        if ((pelota.offsetHeight + pelota.offsetTop == raqueta.offsetTop) && (pelota.offsetLeft+pelota.offsetWidth>=raqueta.offsetLeft && pelota.offsetLeft+pelota.offsetWidth<=raqueta.offsetLeft+raqueta.offsetWidth)) {
            va_Hacia_Arriba = true;
        }else if (pelota.offsetTop == 0) {
            va_Hacia_Arriba = false;
            rebota = true;
        }
    //Ladrillos
        let hay_Ladrillos= false;
        for (const ladrillo of ladrillos) {//Recorre los ladrillos creados
            if (ladrillo.style.display!="none"){
                hay_Ladrillos= true;
                if (((pelota.offsetLeft + pelota.offsetWidth>=ladrillo.offsetLeft) && (pelota.offsetLeft<=ladrillo.offsetLeft+ladrillo.offsetWidth)) && ((pelota.offsetTop + pelota.offsetHeight>=ladrillo.offsetTop) && (pelota.offsetTop <= ladrillo.offsetTop + ladrillo.offsetHeight))){ //Que este entre el ancho del ladrillo
                    if(pelota.offsetTop == ladrillo.offsetTop + ladrillo.offsetHeight){//Si golpea la parte de abajo del ladrillo
                        va_Hacia_Arriba = false;
                        elimina_Ladrillo(ladrillo);
                    }else if (pelota.offsetTop + pelota.offsetHeight == ladrillo.offsetTop) {//Si golpea la parte de arriba del ladrillo
                        va_Hacia_Arriba = true;
                        elimina_Ladrillo(ladrillo);
                    }

                    if (pelota.offsetLeft == ladrillo.offsetLeft + ladrillo.offsetWidth) {//Si golpea el lateral derecho del ladrillo
                        va_Hacia_Derecha = true;
                        elimina_Ladrillo(ladrillo);
                    } else if (pelota.offsetLeft + pelota.offsetWidth == ladrillo.offsetLeft) {//Si golpea el lateral izquierdo del ladrillo
                        va_Hacia_Derecha = false;
                        elimina_Ladrillo(ladrillo);
                    }
                }
            }
        }

        if (!hay_Ladrillos) { //Si no hay ladrillos
            ganar_Juego();
        }

    //Abajo
        if ((pelota.offsetHeight + pelota.offsetTop) > (raqueta.offsetTop + raqueta.offsetHeight + vh*3)) {
            sobrePasaRaqueta = true;
        }else {
            sobrePasaRaqueta = false;
        }

        if (sobrePasaRaqueta) {
            perderVida();
        }

        if (va_Hacia_Arriba) { //Si la pelota debe ir hacía arriba o no
            pelota.style.top = (pelota.offsetTop - DESPLAZAMIENTO_Y) + 'px';
        } else {
            pelota.style.top = (pelota.offsetTop + DESPLAZAMIENTO_Y) + 'px';
        }

    //Derecha
        if (escenario.offsetWidth - pelota.offsetLeft == pelota.offsetWidth+5) {
            va_Hacia_Derecha = false;
            rebota = true;
        }else if (pelota.offsetLeft == 0) {
            va_Hacia_Derecha = true;
            rebota = true;
        }

        if (va_Hacia_Derecha) {
            pelota.style.left = (pelota.offsetLeft + DESPLAZAMIENTO_X) + 'px';
        }else{
            pelota.style.left = (pelota.offsetLeft - DESPLAZAMIENTO_X) + 'px';
        }


    //Si sobrepasa la pelota a la raqueta
        if (rebota) {
            puntos+=10;
            puntostxt.textContent= "Puntos: " + puntos;
        }
    }
}