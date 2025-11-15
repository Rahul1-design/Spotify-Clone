console.log("Lets write some java")

//global variable
let currentSong = new Audio();

function SecondsToMinutes(seconds){
    if(isNaN(seconds) || seconds<0){
        return "00:00";
    }
    else{
        let minute = Math.floor(seconds / 60);
        let second = Math.floor(seconds % 60);
        
        let formattedMinute = String(minute).padStart(2,0);
        let formattedSecond = String(second).padStart(2,0);
        return `${formattedMinute}:${formattedSecond}`;
    }
}
async function getSongs(){
    let data = await fetch("http://127.0.0.1:5501/Songs/");
    let response = await data.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let lis =  div.getElementsByTagName("li");
    if(lis.length > 0){
        let songs = Array.from(lis).map(li=>li.textContent.trim())
        .filter(song=> song.includes(".mp3"))
        .map(text=>"Songs/" +  text.split(".mp3")[0] + ".mp3")
        return songs;
        }
    else{
        console.log("No song list found");
    }
}
const playMusic = (song,pause=false)=>{
    // let audio = new Audio("Songs/"+ song);
    currentSong.src = "Songs/" + song;
    if(!pause){
        currentSong.play();
        
    }
    play.src = "Images/Pausebutton.svg";
    let music = song.split(".mp3")[0];
    document.querySelector(".info").innerHTML = music;
    document.querySelector(".songtime").innerHTML = "";

}


async function main(){

    //get the list of the songs 
    let songs = await getSongs();
    console.log(songs);
    


    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for(const song of songs){
        let songName = song.replace("Songs/",""); 
        songUl.innerHTML = songUl.innerHTML + `<li>
                            <img class="invert" src="Images/music.svg" alt="Music">
                            <div class="songinfo">
                                <div>${songName}</div>
                                <div>Rahul Shrestha</div>
                            </div>
                            <div class="playnow">Play now</div>
                            <div class="playmusic">
                                <img src="Images/playbutton.svg" alt="">
                            </div>

                        </li>`;
        console.log(songUl)
    }
    //Attach an eventlistener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".songinfo").firstElementChild.innerHTML);
            playMusic(e.querySelector(".songinfo").firstElementChild.innerHTML);
        })
    })
    //Attach an event listener to play, next and previous song
    let play = document.getElementById("play")
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "Images/Pausebutton.svg";
        }
        else{
            currentSong.pause();
            play.src = "Images/playbutton.svg";
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.duration,currentSong.currentTime);
        document.querySelector(".songtime").innerHTML = `${SecondsToMinutes(currentSong.currentTime)}/${SecondsToMinutes(currentSong.duration)}`;
    })
}   

main();
