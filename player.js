// Get DOM elements
const currentTimeDisplay = document.getElementById("current-time");
const totalTimeDisplay = document.getElementById("total-duration");
const timeSlider = document.querySelector(".timeSlider");
const trackSong = document.querySelector(".track-song");
const playBtn = document.querySelector(".play");
const volumeSlider = document.querySelector(".volumeSlider");
const volumeOutput = document.getElementById("volume-output");
const trackNum = document.querySelector('.track-num');
const trackNameDisplay = document.querySelector(".track-name");
const artistNameDisplay = document.querySelector(".track-artist");
const trackImage = document.querySelector(".track-image");
const shuffleBtn = document.querySelector(".shuffle");
const repeatBtn = document.querySelector(".repeat");
const volumeIcon = document.querySelector('.volume-icon');

// Initialize variables
let count = 0;
let currentTrackIndex = 0;
let isSongPlaying = false;
let isRepeatEnabled = false;
let isMuted = false;

// Define tracks
const tracks = [
  {
    bgColor: ["#4F4F4F", "#222222"],
    accentColor: '#d3c8c8',
    name: "8 Cylinder",
    artist: "Sidhu Moose Wala",
    image: "/songs/artworks-FaSAtFr8Bi6ReK0J-Aeai1g-t500x500 (Custom).jpg",
    path: "/songs/8 Cylinder - Sidhu Moose Wala.mp3",
  },
  {
    bgColor: ["#5D1184", "#2E0A36"],
    accentColor: '#b35ede',
    name: "Thabba ku Zulfan",
    artist: "Arjan Dhillon",
    image: "https://cover.djpunjab.is/51902/300x700/thabba-ku-zulfan-arjan-dhillon.webp",
    path: "/songs/Thabba Ku Zulfan - Arjan Dhillon.mp3",
  },
  {
    bgColor: ["#35b2b0", "#1b403f"],
    accentColor: '#63efed',
    name: "Salute",
    artist: "Arjan Dhillon",
    image: "https://cover.djpunjab.is/53392/300x700/salute-arjan-dhillon.webp",
    path: "/songs/Salute - Arjan Dhillon.mp3",
  }
];

// Load track details
const loadTrackDetails = () => {
  const currentTrack = tracks[currentTrackIndex];
  trackNameDisplay.textContent = currentTrack.name;
  artistNameDisplay.textContent = currentTrack.artist;
  trackImage.src = currentTrack.image;
  trackSong.src = currentTrack.path;
  trackSong.load();
  backwardBtn.classList.remove("key-press-hover-left");
  forwardBtn.classList.remove("key-press-hover-right");
  const number = currentTrackIndex + 1;
  trackNum.innerText = number >= 10 ? number + "." : `0${number}.`;
  trackNum.style.color = currentTrack.accentColor;
  document.body.style.background = `linear-gradient(to bottom, ${currentTrack.bgColor[0]}, ${currentTrack.bgColor[1]})`;
};

// Update current time display
const updateCurrentTime = () => {
  const currentTime = trackSong.currentTime;
  const minutes = Math.floor(currentTime / 60);
  const seconds = Math.floor(currentTime % 60);
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  currentTimeDisplay.textContent = formattedTime;
  timeSlider.value = currentTime;
};

// Update current time and track progress
trackSong.addEventListener('timeupdate', () => {
  updateCurrentTime();
  if (isSongPlaying) {
    updateTrackProgress();
  }
});

// Update total duration and track progress
trackSong.addEventListener("loadedmetadata", () => {
  const totalDuration = trackSong.duration;
  const minutes = Math.floor(totalDuration / 60);
  const seconds = Math.floor(totalDuration % 60);
  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  totalTimeDisplay.textContent = formattedDuration;
  timeSlider.max = totalDuration;
  updateTrackProgress();
});

// Shuffle tracks
const shuffleTracks = () => {
  const randomIndex = Math.floor(Math.random() * tracks.length);
  if (randomIndex !== currentTrackIndex) {
    currentTrackIndex = randomIndex;
    loadTrackDetails();
    playBtn;
  }
};

shuffleBtn.addEventListener("click", shuffleTracks);

// Play or pause song
playBtn.addEventListener("click", () => {
  if (count === 0) {
    count = 1;
    trackSong.play();
    playBtn.innerHTML = '<ion-icon name="pause-circle-outline"></ion-icon>';
    isSongPlaying = true;
  } else {
    count = 0;
    trackSong.pause();
    playBtn.innerHTML = '<ion-icon name="play-circle-outline"></ion-icon>';
    isSongPlaying = false;
  }
});

// Event listener for the Repeat button
repeatBtn.addEventListener("click", () => {
  isRepeatEnabled = !isRepeatEnabled;
  repeatBtn.classList.toggle("active", isRepeatEnabled);
});

// Reset track when it ends
trackSong.addEventListener("ended", () => {
  if (isRepeatEnabled) {
    trackSong.currentTime = 0;
    trackSong.play();
    playBtn.innerHTML = '<ion-icon name="pause-circle-outline"></ion-icon>';
    isSongPlaying = true;
  } else {
    count = 0;
    playBtn.innerHTML = '<ion-icon name="play-circle-outline"></ion-icon>';
    trackSong.currentTime = 0;
    updateCurrentTime();
  }
});

// Update volume
volumeSlider.addEventListener("input", (e) => {
  const volumeValue = parseFloat(e.target.value) / 100;
  trackSong.volume = volumeValue;
  volumeOutput.textContent = Math.round(volumeValue * 100);
  updateVolumeProgress();
  updateVolumeSlider(e.target.value);
});

volumeSlider.style.setProperty('--volume-progress', parseFloat(volumeSlider.value) + '%');

// Seek track
timeSlider.addEventListener("input", (e) => {
  const seekTime = parseFloat(e.target.value);
  trackSong.currentTime = seekTime;
  updateCurrentTime();
  updateTrackProgress();
});

function updateVolumeSlider(value) {
  const volumeValue = parseFloat(value);
  trackSong.volume = volumeValue / 100;
  volumeOutput.textContent = Math.round(volumeValue);
  volumeSlider.value = volumeValue;
  volumeSlider.style.setProperty('--volume-progress', volumeValue + '%');
}

// Update track progress
function updateTrackProgress() {
  const trackProgress = (trackSong.currentTime / trackSong.duration) * 100;
  timeSlider.style.setProperty('--track-progress', trackProgress + '%');
}

// Toggle volume mute/unmute when clicking the volume icon
volumeIcon.addEventListener('click', () => {
  isMuted = !isMuted;

  if (isMuted) {
    trackSong.volume = 0; // Mute the volume
    updateVolumeSlider(0);
    updateVolumeProgress(); // Update the volume progress immediately
    volumeSlider.value = 0;
    volumeSlider.style.setProperty('--volume-progress', 0 + '%');
    volumeIcon.innerHTML = '<ion-icon class="ion-icon" name="volume-mute-outline"></ion-icon>';
  } else {
    // Unmute the volume and set it to 100%
    trackSong.volume = 1;
    updateVolumeSlider(100);
    updateVolumeProgress(); // Update the volume progress immediately
    volumeSlider.value = 100;
    volumeSlider.style.setProperty('--volume-progress', 100 + '%');
    volumeIcon.innerHTML = '<ion-icon class="ion-icon" name="volume-high-outline"></ion-icon>';
  }
});

// Update volume progress
function updateVolumeProgress() {
  const volumeProgress = parseFloat(volumeSlider.value);
  volumeSlider.style.setProperty('--volume-progress', volumeProgress + '%');

  // Update volume progress icon based on the flag and volume level
  if (isMuted) {
    volumeIcon.innerHTML = '<ion-icon class="ion-icon" name="volume-mute-outline"></ion-icon>';
  } else if (volumeProgress <= 0) {
    volumeIcon.innerHTML = '<ion-icon class="ion-icon" name="volume-mute-outline"></ion-icon>';
  } else if (volumeProgress <= 40) {
    volumeIcon.innerHTML = '<ion-icon class="ion-icon" name="volume-low-outline"></ion-icon>';
  } else if (volumeProgress <= 70) {
    volumeIcon.innerHTML = '<ion-icon class="ion-icon" name="volume-medium-outline"></ion-icon>';
  } else {
    volumeIcon.innerHTML = '<ion-icon class="ion-icon" name="volume-high-outline"></ion-icon>';
  }
}

// Go to next track
const forwardBtn = document.querySelector(".forward");
forwardBtn.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrackDetails();
  playBtn.innerHTML = '<ion-icon name="play-circle-outline"></ion-icon>';
  count = 0;
});

// Go to previous track
const backwardBtn = document.querySelector(".backward");
backwardBtn.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrackDetails();
  playBtn.innerHTML = '<ion-icon name="play-circle-outline"></ion-icon>';
  count = 0;
});

// Reset track when it ends
trackSong.addEventListener("ended", () => {
  count = 0;
  trackSong.currentTime = 0;
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrackDetails();
  trackSong.play();
  playBtn.innerHTML = '<ion-icon name="pause-circle-outline"></ion-icon>';
  isSongPlaying = true;
  updateCurrentTime();
});

// Load initial track details
loadTrackDetails();