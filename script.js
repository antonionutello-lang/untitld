const songs = [
    { name: 'Bizarre - Lancey Foux', src: 'Bizarre-Lancey Foux.mp3' },
    { name: 'IDH8ME2 - Southsidesilouette', src: 'IDH8ME2-Southsidesilouette.mp3' },
    { name: 'Out My Way - Lucki', src: 'Out My Way-Lucki.mp3' },
    { name: 'Show Off - SahBabii', src: 'Show Off-SahBabii.mp3' },
    { name: 'Standard - Venna ft. Knucks', src: 'Standard-Venna ft. Knucks.mp3' },
    { name: 'TOURMALINE - Earl Sweatshirt', src: 'TOURMALINE-Earl Sweatshirt.mp3' },
    { name: 'Where Are You - Lexa Gates', src: 'Where Are You-Lexa Gates.mp3' },
    { name: 'eighteen - dexter in the newsagent', src: 'eighteen-dexter in the newsagent.mp3' },
    { name: 'new david bowie - Jim Legxacy', src: 'new david bowie-Jim Legxacy.mp3' },
    { name: 'princess - Skaiwater', src: 'princess-Skaiwater.mp3' }
];

let selectedSongs = [];
let currentIndex = 0;
let playedCount = 0;
let playedSongs = [];
const audioPlayer = document.getElementById('audioPlayer');
const currentSongDisplay = document.getElementById('currentSong');
const playerDiv = document.getElementById('player');
const questionnaireDiv = document.getElementById('questionnaire');
const favoriteSelect = document.getElementById('favorite');
const quizForm = document.getElementById('quizForm');
const playButton = document.getElementById('playButton');
const skipBtn = document.getElementById('skipBtn');
const moreBtn = document.getElementById('moreBtn');
const moreDiv = document.getElementById('more');

// Shuffle array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

selectedSongs = shuffle([...songs]);

function populateFavoriteWithPlayedSongs() {
    favoriteSelect.innerHTML = '<option value="">Select</option>';
    playedSongs.forEach(song => {
        const option = document.createElement('option');
        option.value = song.name;
        option.textContent = song.name;
        favoriteSelect.appendChild(option);
    });
}

// Play next song
function playNext() {
    if (playedCount < 5 && currentIndex < selectedSongs.length) {
        const song = selectedSongs[currentIndex];
        const alreadyAdded = playedSongs.some((playedSong) => playedSong.src === song.src);
        if (!alreadyAdded) {
            playedSongs.push(song);
        }
        audioPlayer.src = song.src;
        currentSongDisplay.textContent = `Now playing: ${song.name}`;
        audioPlayer.play();
        skipBtn.style.display = 'inline';
        currentIndex++;
    } else if (playedCount >= 5) {
        populateFavoriteWithPlayedSongs();
        playerDiv.style.display = 'none';
        questionnaireDiv.style.display = 'block';
    } else {
        // No more songs, but not 5 played
        populateFavoriteWithPlayedSongs();
        playerDiv.style.display = 'none';
        questionnaireDiv.style.display = 'block';
    }
}

// Event listeners
audioPlayer.addEventListener('ended', () => {
    playedCount++;
    playNext();
});
audioPlayer.addEventListener('error', () => {
    console.log('Error loading song: ' + selectedSongs[currentIndex - 1].name);
    playNext();
});
playButton.addEventListener('click', () => {
    playButton.style.display = 'none';
    playNext();
});
skipBtn.addEventListener('click', () => {
    currentIndex++;
    playNext();
});
moreBtn.addEventListener('click', () => {
    moreDiv.style.display = moreDiv.style.display === 'none' ? 'block' : 'none';
});

// Show fallback title if image fails
const titleImg = document.getElementById('titleImg');
const titleFallback = document.getElementById('titleFallback');
titleImg.addEventListener('error', () => {
    titleImg.style.display = 'none';
    titleFallback.style.display = 'block';
});

// Handle location "Other" field
const locationSelect = document.getElementById('location');
const locationOther = document.getElementById('locationOther');
locationSelect.addEventListener('change', function() {
    if (this.value === 'Other') {
        locationOther.style.display = 'block';
    } else {
        locationOther.style.display = 'none';
        locationOther.value = '';
    }
});

// Form submit
quizForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = document.getElementById('location').value;
    const locationOtherValue = document.getElementById('locationOther').value;
    const locationValue = location === 'Other' ? locationOtherValue : location;
    const statusEl = document.getElementById('formStatus');

    const formData = new FormData(quizForm);
    formData.set('location', locationValue);

    fetch('https://formspree.io/f/xpqyojby', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then((response) => {
            if (response.ok) {
                statusEl.style.display = 'block';
                statusEl.style.color = '#1f7a1f';
                statusEl.textContent = 'Thanks, your response was sent.';
                quizForm.reset();
                locationOther.style.display = 'none';
                favoriteSelect.innerHTML = '<option value="">Select</option>';
                playedSongs.forEach((song) => {
                    const option = document.createElement('option');
                    option.value = song.name;
                    option.textContent = song.name;
                    favoriteSelect.appendChild(option);
                });
            } else {
                statusEl.style.display = 'block';
                statusEl.style.color = '#b00020';
                statusEl.textContent = 'Error sending form. Please try again.';
            }
        })
        .catch(() => {
            statusEl.style.display = 'block';
            statusEl.style.color = '#b00020';
            statusEl.textContent = 'Error sending form. Please try again.';
        });
});