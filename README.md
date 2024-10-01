# Spotify Random Play

Play a random song (and a random part) in your playlist. I use it to test how well I remember song titles

Available on https://spotify-random-play-bfc61.web.app

Generated with ChatGPT. And I didn't really care for its quality.

# How to run

1. Go to `https://developer.spotify.com/dashboard` and create an app
  1. Enable `Web API`
  1. Add `http://localhost:3000/index.html` as redirect uri
  1. Once created, go to Settings and copy the Client ID
1. Replace the `clientId` in `script.js` to the copied Client ID
1. Run `npm install -g http-server`
1. Run `http-server -p 3000`
1. Go to `http://localhost:3000/index.html`
1. Go to `https://open.spotify.com` and play music
  1. Make sure the music plays on the browser - Spotify player control won't work if you play on its App
1. Log in to Spotify
1. Pick your playlist
1. Click Play Random Song

# Firebase deploy

1. Move `index.html` and `script.js` to `public` folder
1. Change `redirectUri` variable to the Firebase URL
1. Fill up `firebaseConfig` in `index.html`
1. Run `firebase deploy`