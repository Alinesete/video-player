var playerVideo, view, timer, videoPreloader;
var btnPlay, full;
var intervalTimer;
var hr, min, sec, currentHr, currentMin, currentSec;
var barProgress, videoLoader, progress;
var pctSeek, pctBar;
var slider, sliderVol, drag;
var pctVol, btnVol;

function prepare(elem){
    if(playerVideo != elem){
        playerVideo=elem;
        
        view = playerVideo.querySelector(".video-view")
        timer = playerVideo.querySelector('.video-time');

        barProgress = playerVideo.querySelector('.video-progress-bar');
        videoLoader = playerVideo.querySelector('.video-loader');
        progress = playerVideo.querySelector('.video-progress');

        btnVol = playerVideo.querySelector('.video-volume');
        btnVol.addEventListener('click', mute)

        barProgress.addEventListener('click', seeker);

        btnPlay = playerVideo.querySelector(".video-play")
        btnPlay.addEventListener('click', play)

        slider = playerVideo.querySelector('.slider');
        sliderVol = playerVideo.querySelector('.slider-vol');

        slider.addEventListener('mousemove', showVolume);
        slider.addEventListener('mousedown', startDrag);
        slider.addEventListener('mouseup', startDrag);
        
        drag=false;

        intervalTimer = setInterval(updateTimer, 100);

        videoPreloader = playerVideo.querySelector('.video-preloader');
        view.addEventListener('waiting', loader);
        view.addEventListener('playing', loader);

        full = playerVideo.querySelector('.video-screen');
        full.addEventListener('click', fullscreen);
        view.addEventListener('click', play);
        view.addEventListener('dblclick', fullscreen);
    }

}

function fullscreen(){
    if(!document.webkitFullscreenElement){
        playerVideo.webkitRequestFullscreen();
    }else{
        document.webkitExitFullscreen();
    }
}

//Loader
function loader(){
    switch(event.type){

        case 'waiting':
            videoPreloader.style.display = "block";
        break;

        case 'playing':
            videoPreloader.style.display = "none";
        break;

    }
}

//Funções de Volume
function startDrag(event){
    
    if(event.type == "mousedown"){
        drag = true;
    }else{
        drag = false;
    }
}

function showVolume(event){
    if(drag){
        var w = slider.clientWidth - 2;
        var x = event.clientX - slider.offsetLeft;
        pctVol = x/w;
        sliderVol.style.width = x+"px";
        view.volume = pctVol;

        if(pctVol <= 0){
            btnVol.style.backgroundImage = "url(skinPlayer/volume-mute.png)";
        }else if(pctVol > 0 && pctVol <= 0.5){
            btnVol.style.backgroundImage = "url(skinPlayer/volume-low.png)";
        }else{
            btnVol.style.backgroundImage = "url(skinPlayer/volume-medium.png)";
        }

    }
}

function mute(){
    if(!view.muted){
        view.muted = true;
        btnVol.style.backgroundImage = "url(skinPlayer/volume-mute.png)";
    }else{
        view.muted = false;
        if(pctVol <= 0.5){
            btnVol.style.backgroundImage = "url(skinPlayer/volume-low.png)";
        }else{
            btnVol.style.backgroundImage = "url(skinPlayer/volume-medium.png)";
        }
    }
}

//Funções Barra de Progresso
function seeker(){
    pctBar = (event.clientX / barProgress.clientWidth) * 100;
    view.currentTime = (view.duration * pctBar) / 100;
}

function updateTimer(){

    //Desenho da barra de progresso
    bufferedEnd = view.buffered.end(view.buffered.length - 1);
    videoLoader.style.width = String((bufferedEnd / view.duration) * 100)+'%';
    pctSeek = (view.currentTime / view.duration) * 100;
    progress.style.width = String(pctSeek)+'%';

    //Duração total do video
    hr = Math.floor(view.duration/3600);
    min = Math.floor(view.duration/60);
    sec = Math.floor(((view.duration/60) % 1) * 60);

    //Tempo atual
    currentHr = Math.floor(view.currentTime/3600);
    currentMin = Math.floor(view.currentTime/60);
    currentSec = Math.floor(((view.currentTime/60) % 1) * 60);

    timer.innerHTML = convertTimer(currentHr, currentMin, currentSec) + ' | ' + convertTimer(hr,min,sec);
}

//Iniciar Video
function play(){
    if(view.played.length != 0){
        if(view.played.start(0)==0 && !view.paused){
            view.pause();
            btnPlay.style.backgroundImage = "url(skinPlayer/play.png)";
        }else{
            view.play();
            btnPlay.style.backgroundImage = "url(skinPlayer/pause.png)";
        }
    }else{
        btnPlay.style.backgroundImage = "url(skinPlayer/pause.png)";
        view.play();
    }
}

//Converte em HH:MM:SS
function convertTimer(hours,minutes,seconds){
    if(hours<10 && hours>0){
        hours = '0' + String(hours) + ':';
    }else{
        hours='';
    }

    if(minutes<10 && minutes>0){
        minutes = '0' + String(minutes);
    }else if(minutes>59){
        minutes = minutes - (Math.floor(minutes/60) * 60)
    }
    else if(minutes == 0){
        minutes = '00';
    }

    if(seconds<10 && seconds>0){
        seconds = '0' + String(seconds);
    }
    else if(seconds == 0){
        seconds = '00';
    }
    return String(hours) + String(minutes) + ':' + String(seconds);
}