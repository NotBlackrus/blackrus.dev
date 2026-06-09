var discordAttempt = 0
const activityContainer = document.getElementById('discord-activity')
const activityImage = document.getElementById('discord-device')
const roblox = document.getElementById('roblox')

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
  });
});

const projectModal = document.getElementById('project-modal');
const projectModalTitle = document.querySelector('.project-modal-title');
const projectModalDescription = document.querySelector('.project-modal-description');
const projectModalLink = document.querySelector('.project-modal-link');
const projectModalDiscord = document.querySelector('.modal-discord-link')
const projectModalClose = document.querySelector('.project-modal-close');

function closeProjectModal() {
  projectModal.classList.remove('active');
  projectModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('no-scroll');
}

function openProjectModal(card) {
  const title = card.dataset.projectTitle || '';
  const description = (card.dataset.projectDescription || '');
  const url = card.dataset.projectUrl || '#';
  const urlText = card.dataset.projectUrlText || '&ltOpen project&gt';

  projectModalTitle.textContent = title;
  projectModalDescription.innerHTML = description;
  projectModalLink.textContent = urlText;
  projectModalLink.href = url;

  if (card.dataset.projectDiscord) {
    projectModalDiscord.style.display = 'inline-flex'
    projectModalDiscord.href = card.dataset.projectDiscord
  } else {
    projectModalDiscord.style.display = 'none'
  }

  if (!url || url === '#') {
    projectModalLink.style.display = 'none';
  } else {
    projectModalLink.style.display = 'inline-flex';
  }

  projectModal.classList.add('active');
  projectModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('no-scroll');
}

document.querySelectorAll('.project-details-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.project-card');
    if (!card) return;
    openProjectModal(card);
  });
});

projectModalClose.addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', (event) => {
  if (event.target === projectModal) {
    closeProjectModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && projectModal.classList.contains('active')) {
    closeProjectModal();
  }
});

roblox.addEventListener("click", (event) => {
    var audio = new Audio('/assets/fart.mp3');
    audio.play();
})

const ActivityContainerColors = {
    "online": "#009b00",
    "idle": "#d49c00",
    "dnd": "#c90000",
    "offline": "#393B3D"
}
const ActivityDeviceColors = {
    "online": "grayscale(100%) sepia(100%) hue-rotate(200deg) saturate(300%)",
    "idle": "grayscale(100%) sepia(100%) hue-rotate(200deg) saturate(300%)",
    "dnd": "grayscale(100%) sepia(100%) hue-rotate(200deg) saturate(300%)",
    "offline": ""
}


function DiscordPresence(request) {
    if (request.success) {
        const data = request.data
        const ONLINE = data.active_on_discord_desktop || data.active_on_discord_web || data.active_on_discord_embedded || data.active_on_discord_vr || data.active_on_discord_mobile
        if (data.active_on_discord_mobile) {
            activityImage.src = "/assets/Discord/Mobile.svg"
        }
        activityImage.style.filter = ActivityDeviceColors[data.discord_status]
        activityContainer.style.background = ActivityContainerColors[data.discord_status]

        if (data.activities && data.activities[0] && data.activities[0].id == "custom") {
            const statusContainer = document.getElementById('discord-status-container')
            const discordStatus = document.getElementById('discord-status')
            statusContainer.style.display = 'flex'
            discordStatus.textContent = data.activities[0].state
        }

        if (data.listening_to_spotify) {
            const spotifyContainer = document.getElementById('spotify-container')
            const albumart = document.getElementById('spotify-album-art')
            const songName = document.getElementById('spotify-track-name')
            const artist = document.getElementById('spotify-artist-name')
            const album = document.getElementById('spotify-album-name')
            spotifyContainer.style.display = 'block'
            albumart.src = data.spotify.album_art_url
            songName.textContent = data.spotify.song
            artist.textContent = "By " + data.spotify.artist
            album.textContent = data.spotify.album
        } else {
            const spotifyContainer = document.getElementById('spotify-container')
            spotifyContainer.style.display = 'none'
        }
    } else {
        if (discordAttempt >= 3) {
            console.error("Failed to fetch Blackrus' Discord presence. Is he doing okay? Contact him!!!")
        } else {
            FetchDiscord()
        }
    }
}

function FetchDiscord() {
    discordAttempt = discordAttempt + 1
    fetch("https://api.lanyard.rest/v1/users/875424571157790720")
        .then((res) => res.json())
        .then(DiscordPresence);
}

FetchDiscord()