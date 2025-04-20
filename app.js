import express from 'express';
import readline from 'readline';
import SpotifyWebApi from 'spotify-web-api-node';
import * as dotenv from 'dotenv';
import chalk from 'chalk';
import open from 'open';
import axios from 'axios'; // ✅ Added

dotenv.config();

const app = express();
const port = 8888;

const spotifyapi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

const Scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-modify-public",
];

app.get("/login", (req, res) => {
  const authorizeURL = spotifyapi.createAuthorizeURL(Scopes);
  res.redirect(authorizeURL);
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const data = await spotifyapi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;
    spotifyapi.setAccessToken(access_token);
    spotifyapi.setRefreshToken(refresh_token);

    const me = await spotifyapi.getMe();
    console.log(`${chalk.green("🎧")} Logged in as: ${me.body.display_name} (${me.body.email})`);

    res.send(`${chalk.blue("🎶")} Authenticated! Return to your terminal to use the player.`);
    startTerminalController();
  } catch (error) {
    console.error(`${chalk.red("❌")} Error during callback`, error);
    res.send(`${chalk.red("❌")} Error during authentication`);
  }
});

app.listen(port, async () => {
  console.log(`${chalk.yellowBright("🔐")} Visit http://127.0.0.1:${port}/login to authenticate`);
  try {
    if (open) await open(`http://127.0.0.1:${port}/login`);
  } catch (err) {
    console.error("Failed to open browser:", err);
  }
});

// -----------------------------
// 🎵 TERMINAL CONTROLS
// -----------------------------
function startTerminalController() {
  console.log(chalk.cyan(`
🎧 Spotify Terminal Controller:
[space]  ${chalk.green("Play/Pause")}
[n]      ${chalk.yellowBright("Next Track")}
[b]      ${chalk.red("Previous Track")}
[i]      ${chalk.magenta("Current Track Info")}
[v]      ${chalk.blue("Set Volume")}
[s]      ${chalk.green("Seek (ms)")}
[q]      ${chalk.bold("Quit")}
[p]      ${chalk.white("Show Playlist Queue")}
[a]      ${chalk.green("Add Track to Playlist")}
[d]      ${chalk.red("Remove Track from Playlist")}
--------------------------------
  `));

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", async (str, key) => {
    if (key.name === "q") {
      console.log(`${chalk.yellowBright("👋")} Closing player...`);
      process.exit();
    }

    try {
      switch (key.name) {
        case "space":
          const playback = await spotifyapi.getMyCurrentPlaybackState();
          if (playback.body.is_playing) {
            await spotifyapi.pause();
            console.log(`${chalk.green("⏸️")} Paused`);
          } else {
            await spotifyapi.play();
            console.log(`${chalk.green("▶️")} Playing`);
          }
          break;
        case "n":
          await spotifyapi.skipToNext();
          console.log(`${chalk.yellowBright("⏭️")} Skipping to next track`);
          break;
        case "b":
          await spotifyapi.skipToPrevious();
          console.log(`${chalk.red("⏮️")} Going back to previous track`);
          break;
        case "i":
          const data = await spotifyapi.getMyCurrentPlaybackState();
          if (data.body && data.body.item) {
            const track = data.body.item;
            console.log(`${chalk.magenta("🎶")} Now Playing: ${track.name} by ${track.artists.map(a => a.name).join(", ")}`);
          } else {
            console.log(`${chalk.red("❌")} Nothing is currently playing.`);
          }
          break;
        case "v":
          ask(`${chalk.blue("🔊")} Set volume (0-100): `, async (input) => {
            const level = parseInt(input);
            if (!isNaN(level) && level >= 0 && level <= 100) {
              await spotifyapi.setVolume(level);
              console.log(`${chalk.blue("🔊")} Volume set to ${level}%`);
            } else {
              console.log(`${chalk.red("⚠️")} Invalid volume.`);
            }
          });
          break;
        case "s":
          ask(`${chalk.green("⏩")} Seek to position (ms): `, async (input) => {
            const position = parseInt(input);
            if (!isNaN(position) && position >= 0) {
              await spotifyapi.seek(position);
              console.log(`${chalk.green("⏩")} Seeking to ${position}ms`);
            } else {
              console.log(`${chalk.red("⚠️")} Invalid seek position.`);
            }
          });
          break;
        case "p":
          showCurrentPlaylist();
          break;
        case "a":
          ask(`${chalk.green("🔎")} Enter Track URI to add to your playlist: `, async (input) => {
            try {
              await spotifyapi.addTracksToPlaylist(process.env.SPOTIFY_PLAYLIST_ID, [input]);
              console.log(`${chalk.green("🎵")} Track added to your playlist.`);
            } catch (error) {
              console.log(`${chalk.red("⚠️")} Error adding track to playlist: ${error.message}`);
            }
          });
          break;
        case "d":
          ask(`${chalk.red("🔎")} Enter Track URI to remove from your playlist: `, async (input) => {
            try {
              await spotifyapi.removeTracksFromPlaylist(process.env.SPOTIFY_PLAYLIST_ID, [input]);
              console.log(`${chalk.red("🎵")} Track removed from your playlist.`);
            } catch (error) {
              console.log(`${chalk.red("⚠️")} Error removing track from playlist: ${error.message}`);
            }
          });
          break;
        default:
          break;
      }
    } catch (err) {
      console.error(`${chalk.red("❌")} Error:`, err.message);
    }
  });
}

async function showCurrentPlaylist() {
  try {
    const token = spotifyapi.getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/me/player/queue', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const upcoming = response.data.queue.slice(0, 10);
    if (upcoming.length === 0) {
      console.log(chalk.red("❌ No upcoming songs in the queue."));
      return;
    }

    console.log(chalk.cyan("\n🎧 Upcoming Tracks (Next 10):"));
    console.log(chalk.gray("──────────────────────────────"));

    upcoming.forEach((track, index) => {
      const name = chalk.white.bold(`${index + 1}. ${track.name}`);
      const artists = chalk.green(track.artists.map(a => a.name).join(", "));
      const album = chalk.yellow(`Album: ${track.album.name}`);
      const duration = chalk.magenta(`Duration: ${msToMinSec(track.duration_ms)}`);
      console.log(`${name}\n   ${artists}\n   ${album}\n   ${duration}\n`);
    });

    console.log(chalk.gray("──────────────────────────────\n"));
  } catch (error) {
    console.log(`${chalk.red("⚠️")} Error fetching queue:`, error.response?.data?.error?.message || error.message);
  }
}

function msToMinSec(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, '0')}`;
}

function ask(question, callback) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(question, (answer) => {
    rl.close();
    callback(answer);
  });
}
