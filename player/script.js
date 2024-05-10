const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');

let hymns = [];
let playlist = [];
let savedHymns = [];

const hymnNumber = getQueryParam('number');


let songIndex = 0;
async function loadJSONFile(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`JSON loading error! Status: ${response.status}`);
        }
        hymns = await response.json();
    } catch (error) {
        console.error('Error loading JSON file:', error);
    }

}

// Load hymn data from JSON file on page load
loadJSONFile('./../hymnsTitle.json').then(()=> {
    const selectedSong = getHymnByNumber(hymnNumber);
    if (selectedSong) {
        playlist.push(selectedSong);
    }
    const savedHymnsJSON = localStorage.getItem('HBCPlaylist');
    if(savedHymnsJSON) {
        savedHymns = JSON.parse(savedHymnsJSON);
    }
    savedHymns.forEach((hymn) => {
        playlist.push(hymn);
    });
    loadSong();
});

// Function to get query parameter from URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function getHymnByNumber(hymnNumber) {
   return hymns.find(s => s.number === hymnNumber);
}


function horizontalDynamicScrolling() {
    const hasStyles = title.classList.contains('dynamic-styles');

    if (hasStyles) {
        title.classList.remove('dynamic-styles');
    } else {
        title.classList.add('dynamic-styles');
    }
}

// Check if Playing
let isPlaying = false;

// Play
function playSong() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
    title.style.animationPlayState = "running";
    //horizontalDynamicScrolling();
}

// Pause
function pauseSong() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
    title.style.animationPlayState = 'paused';
    //horizontalDynamicScrolling();
}

// Play or Pause Event Listener
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));
let urlSong = true;
// Update DOM
function loadSong() {
    if(playlist){
        const currentSong = playlist[songIndex]
        console.log(currentSong)
        title.textContent = currentSong.title;
        artist.textContent = currentSong.from;
        music.src = `./../music/${currentSong.number}.mp3`;
    }
}

// Previous Song
function prevSong() {
    songIndex--;
    console.log(songIndex);
    if (songIndex < 0) {
        songIndex = playlist.length - 1;
    }
    loadSong(playlist[songIndex]);
    if(isPlaying) playSong();
}

// Next Song
function nextSong() {
    songIndex++;
    console.log(songIndex);
    if (songIndex > playlist.length - 1) {
        songIndex = 0;
    }
    loadSong(playlist[songIndex]);
    if(isPlaying) playSong();
}

// On Load - Select First Song
//loadSong(songs[songIndex]);
//loadAndPlaySong(hymnNumber)

// Update Progress Bar & Time
function updateProgressBar(e) {
    if (isPlaying) {
        const { duration, currentTime } = e.srcElement;
        // Update progress bar width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        // Calculate display for duration
        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) {
            durationSeconds = `0${durationSeconds}`;
        }
        // Delay switching duration Element to avoid NaN
        if (durationSeconds) {
            durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
        }
        // Calculate display for currentTime
        const currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) {
            currentSeconds = `0${currentSeconds}`;
        }
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
    }
}

// Set Progress Bar
function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const { duration } = music;
    music.currentTime = (clickX / width) * duration;
}

// Event Listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
progressContainer.addEventListener('click', setProgressBar);


