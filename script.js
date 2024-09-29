const clientId = 'YOUR_CLIENT_ID'; // Replace with your Client ID
const redirectUri = 'http://localhost:3000/spotify_random_play.html';
const scopes = 'playlist-read-private user-modify-playback-state user-read-playback-state';
let accessToken = '';
let deviceId = '';

// Function to log in to Spotify
document.getElementById('login').addEventListener('click', () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}&response_type=token`;
    window.location.href = authUrl;
});

// Get access token from URL
if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    accessToken = hashParams.get('access_token');
    console.log('accessToken', accessToken);
    getActiveDevices(accessToken);
    populatePlaylists();
}

// Function to get user playlists
async function getUserPlaylists() {
    if (!accessToken) return;
    console.log('getUserPlaylists')
    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data.items;
}

// Populate playlist dropdown
async function populatePlaylists() {
    const playlists = await getUserPlaylists();
    const playlistSelect = document.getElementById('playlistSelect');
    (playlists || []).forEach(playlist => {
        const option = document.createElement('option');
        option.value = playlist.id;
        option.textContent = playlist.name;
        playlistSelect.appendChild(option);
    });
}

document.getElementById('playRandomSong').addEventListener('click', async () => {
    const playlistId = document.getElementById('playlistSelect').value;
    const songs = await getPlaylistTracks(playlistId);
    playRandomSong(songs);
});

async function getPlaylistTracks(playlistId) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data.items.map(item => item.track);
}

async function playRandomSong(songs) {
    const randomIndex = Math.floor(Math.random() * songs.length);
    const selectedSong = songs[randomIndex];

    if (selectedSong) {
        const positionInSong = Math.floor(Math.random() * selectedSong.duration_ms); // Random position in milliseconds
        const songUri = selectedSong.uri;

        // Play the song
        await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                uris: [songUri],
                device_id: deviceId,
                position_ms: positionInSong
             })
        });
    }
}

async function getActiveDevices(accessToken) {
    console.log(accessToken)
    const response = await fetch('https://api.spotify.com/v1/me/player/devices', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    
    if (data.devices?.length === 0) {
        console.log('No active devices found. Please start playback in the Spotify app.');
    } else {
        console.log('Active Devices:', data.devices);
    }
    deviceId = data.devices[0].id;
    await setActiveDevice(accessToken, data.devices[0].id);

    return data.devices;
}

async function setActiveDevice(accessToken, deviceId) {
    const response = await fetch(`https://api.spotify.com/v1/me/player`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            device_ids: [deviceId]
        })
    });

    if (!response.ok) {
        console.error('Error setting active device:', response.status, response.statusText);
    } else {
        console.log('Active device set successfully.');
    }
}
