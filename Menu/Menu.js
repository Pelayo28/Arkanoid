window.onload=function(){
    let jugar = document.getElementById("jugar");
    jugar.onclick=cargarJuego;
    let pantallaCompleta = document.getElementById("pantallaCompleta");
    pantallaCompleta.onclick=activarPantallaCompleta;
    let musica = document.getElementById("musica");
    musica.onclick=audioPlay;

    let audio=document.getElementById('audio');

    function cargarJuego() {
        let delay = 250;
        setTimeout(function () {
            window.location="Arkanoid.html";
        },delay);
    }

    function activarPantallaCompleta() {
        let body = document.getElementById("cuerpo");
        body.requestFullscreen();
    }

    function audioPlay() {
        if (audio.paused) {
            audio.play();
        }else{
            audio.pause();
        }
    }
}