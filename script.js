// Ensure the DOM content is loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
   let hymns = [];
   let audio;
   let playlist = [];

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
    loadJSONFile('hymnsTitle.json');

    function searchHymn() {
      const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
      const searchResults = document.getElementById('searchResults');
      searchResults.innerHTML = '';
      
      if (searchTerm === '') {
         searchResults.innerHTML = 'Please enter a search term.';
         return;
      }
      
      const filteredHymns = hymns.filter(hymn =>
         hymn.title.toLowerCase().includes(searchTerm) || hymn.number.toLowerCase().includes(searchTerm)
      );
      
      if (filteredHymns.length === 0) {
         searchResults.innerHTML = 'No hymns found.';
      } else {
         filteredHymns.forEach(hymn => {
            const hymnElement = document.createElement('div');
            hymnElement.className = 'hymnTitle';

            const number = hymn.number;
            const title = hymn.title;

            // Create play/pause button
            const playButton = document.createElement('div');
            playButton.classList.add("hymnControl");
            const playButtonIcon = document.createElement('i');
            playButtonIcon.id = `play-${hymn.number}`
            playButtonIcon.classList.add("fas", "fa-play", "main-button");
            playButtonIcon.title = "Play"
            playButtonIcon.onclick = () => {
               togglePlay(hymn);
            };
            playButton.appendChild(playButtonIcon);

            // Create link to music player page
            const titleContainer = document.createElement('div');
            titleContainer.className = 'hTitle'
            const titleLink = document.createElement('a');
            titleLink.innerHTML = `<strong>#${number}</strong> - ${hymn.title}<br>`;
            titleLink.href = `./music-player/index.html?title=${encodeURIComponent(title)}&number=${encodeURIComponent(number)}`;
            titleLink.target = '_blank'; // Open in new tab
            titleContainer.appendChild(titleLink)

            //Create an add to playlist button
            const addToPlaylistButton = document.createElement('div');
            addToPlaylistButton.classList.add("add", 'hymnControl');
            const addToPlaylistButtonIcon = document.createElement('i');
            addToPlaylistButtonIcon.className = `$add-${hymn.number}`
            addToPlaylistButtonIcon.classList.add("fa", "fa-plus");
            addToPlaylistButtonIcon.title = "Add To Playlist"
            addToPlaylistButtonIcon.onclick = () => {
               addToPlaylist(hymn);
            };
            addToPlaylistButton.appendChild(addToPlaylistButtonIcon);

            // Append elements to hymnElement
            hymnElement.appendChild(playButton);
            hymnElement.appendChild(titleContainer);
            hymnElement.appendChild(addToPlaylistButton);

            searchResults.appendChild(hymnElement);
         });
      }
   }

   function togglePlay(hymn) {
    const playBtn = document.getElementById(`play-${hymn.number}`);
    const audioSrc = `music/${hymn.number}.mp3`;

    // Check if there's an existing audio element or if it's playing a different source
    if (!audio || !(audio.src).includes(`${audioSrc}`)) {
        // Pause any currently playing audio and update the play button
        if (audio && !audio.paused) {
            audio.pause();
            const currentPlayBtn = document.querySelector('.fa-pause');
            if (currentPlayBtn) {
                currentPlayBtn.classList.replace('fa-pause', 'fa-play');
                currentPlayBtn.title = 'Play';
            }
        }

        // Create a new audio element
        audio = new Audio(audioSrc);
        audio.addEventListener('ended', () => {
            playBtn.classList.replace('fa-pause', 'fa-play');
            playBtn.title = 'Play';
        });
    }

    // Toggle play/pause based on the current audio state
    if (audio.paused) {
        audio.play();
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.title = 'Pause';
    } else {
        audio.pause();
        playBtn.classList.replace('fa-pause', 'fa-play');
        playBtn.title = 'Play';
    }
}

   function addToPlaylist(hymn) {
        if (!playlist.some(item => item.number === hymn.number)) {
            playlist.push(hymn);
           console.log(`Added "${hymn.title}" to playlist.`);
           localStorage.setItem('HBCPlaylist', JSON.stringify(playlist))
        } else {
            console.log(`"${hymn.title}" is already in the playlist.`);
        }
    }


    // Attach searchHymn function to input field change event and search button click event
    document.getElementById('searchInput').addEventListener('input', searchHymn);
    document.querySelector('button').addEventListener('click', searchHymn);
    
});
