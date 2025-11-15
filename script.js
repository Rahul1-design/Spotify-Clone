console.log("Let's write the Javascript");
let currentSong = new Audio();
let songs;

function SecondsToMinutes(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return `00:00`;
    }
    else {
        let second = Math.floor(seconds % 60);
        let minute = Math.floor(seconds / 60);

        let formatedsecond = String(second).padStart(2, 0);
        let formatedminute = String(minute).padStart(2, 0);

        return `${formatedminute}:${formatedsecond}`;
    }
}

async function getSongs() {
    let data = await fetch("http://127.0.0.1:5501/Songs/");
    let response = await data.text();
    // console.log(response);

    let div = document.createElement("div");
    div.innerHTML = response;

    let lis = div.getElementsByTagName("li");
    // console.log(lis);
    if (lis.length > 0) {
        let songs = Array.from(lis).map(li => li.textContent.trim())
            .filter(song => song.includes(".mp3"))
            .map(text =>  text.split(".mp3")[0] + ".mp3")
        return songs;
    }
    else {
        console.log("Songs not found")
    }
}

const playMusic = (song, pause = false) => {
    // let audio = new Audio("Songs/" + song);
    currentSong.src = ("Songs/" + song);
    currentSong.play();
    play.src = "Images/Pausebutton.svg";
    let music = song.split(".mp3")[0];
    document.querySelector(".songName").innerHTML = music;
    document.querySelector(".songTime").innerHTML = " 00/00 : 00/00";
}

async function main() {

    //Get the list of all songs 
    songs = await getSongs();
    console.log(songs);

    //show all the songs in the playlists
    let music = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        music.innerHTML = music.innerHTML + `<li> 
        <img class="invert" src="Images/music.svg" alt="Music Logo">
                            <div class="songInfo">
                                <div>${song.replace("Songs/", "")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playNow">
                                <span>Play Now</span>
                            </div>
                            <div class="playmusic">
                                <img src="Images/playbutton.svg" alt="Play Image">
                            </div>
                            </li>`;
    }

    //Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".songInfo").firstElementChild.innerHTML)
            playMusic(e.querySelector(".songInfo").firstElementChild.innerHTML)
        })
    })

    //Attach an event listener to play, next and previous 
    play.addEventListener("click", async () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "Images/Pausebutton.svg";
        }
        else {
            currentSong.pause();
            play.src = "Images/Playbutton.svg";
        }
    })


    //Listen for timeupdate function 
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${SecondsToMinutes(currentSong.currentTime)} / ${SecondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add an evenlistener in the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    //Add evenlistener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    //Add evenlistener for close button
    document.querySelector(".cross").addEventListener("click", e => {
        document.querySelector(".left").style.left = "-120%";
    })




     // Add an event listener to previous
    previous.addEventListener("click", () => {
        console.log(currentSong.src);
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })


}
main();

