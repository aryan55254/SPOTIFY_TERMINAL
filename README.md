# Spotify Terminal Controller

## Overview

The **Spotify Terminal Controller** is a Node.js-based application that allows you to control your Spotify playback directly from the terminal. It provides an interactive interface to play, pause, skip tracks, adjust volume, and manage playlists—all without leaving your terminal.

This project uses the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) to interact with Spotify's services. It leverages the `spotify-web-api-node` library for API communication and provides a simple, user-friendly terminal interface using `readline`.

---

## Features

- **Playback Controls**:
  - Play/Pause
  - Skip to next track
  - Go back to the previous track
- **Volume Management**:
  - Set volume level (0-100%)
- **Track Information**:
  - View currently playing track details
- **Playlist Management**:
  - Add tracks to a playlist
  - Remove tracks from a playlist
- **Queue Management**:
  - View the upcoming tracks in the queue
- **Seek Position**:
  - Jump to a specific position in the current track

---

## Prerequisites

Before running the application, ensure you have the following installed:

1. **Node.js**: Download and install Node.js from [here](https://nodejs.org/).
2. **Spotify Developer Account**:
   - Create a Spotify Developer account at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/).
   - Register a new app to obtain your `Client ID`, `Client Secret`, and set up a valid `Redirect URI`.
3. **Environment Variables**:
   - Create a `.env` file in the root directory of the project and add your credentials as shown below:
     ```env
     SPOTIFY_CLIENT_ID=your_client_id_here
     SPOTIFY_CLIENT_SECRET=your_client_secret_here
     SPOTIFY_REDIRECT_URI=http://127.0.0.1:8888/callback
     SPOTIFY_PLAYLIST_ID=your_playlist_id_here
     ```
   - Replace `your_client_id_here`, `your_client_secret_here`, and `your_playlist_id_here` with your actual Spotify app credentials and playlist ID.

---

## Installation

### Step 1: Clone the Repository
Clone the repository to your local machine:
```bash
git clone https://github.com/your-repo/spotify-terminal-controller.git
cd spotify-terminal-controller
```

### Step 2: Install Dependencies
The `node_modules` folder is not included in the repository to keep it lightweight. To install all the required dependencies, run:
```bash
npm install
```
This command reads the `package.json` file and installs all the necessary packages.

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory and populate it with your Spotify credentials (see "Prerequisites" above).

### Step 4: Run the Application
Start the application by running:
```bash
node index.js
```

### Step 5: Authenticate
- Open your browser and navigate to `http://127.0.0.1:8888/login` to authenticate with Spotify.
- Follow the prompts to grant permissions to the app.

### Step 6: Start Controlling Spotify
Once authenticated, return to the terminal to use the interactive controls.

---

## Commands

Here are the commands available in the terminal interface:

| Key | Command                              | Description                                   |
|-----|--------------------------------------|-----------------------------------------------|
| `space` | Play/Pause                          | Toggle between playing and pausing the track. |
| `n`      | Next Track                          | Skip to the next track in the queue.          |
| `b`      | Previous Track                      | Go back to the previous track.                |
| `i`      | Current Track Info                  | Display details of the currently playing track. |
| `v`      | Set Volume                          | Adjust the playback volume (0-100%).          |
| `s`      | Seek (ms)                           | Jump to a specific position in the track.     |
| `p`      | Show Playlist Queue                 | View the next 10 tracks in the queue.         |
| `a`      | Add Track to Playlist               | Add a track (by URI) to your playlist.        |
| `d`      | Remove Track from Playlist          | Remove a track (by URI) from your playlist.   |
| `q`      | Quit                                | Exit the application.                         |

---

## Example Usage

1. **Play/Pause**:
   - Press `space` to toggle between playing and pausing the current track.

2. **Adjust Volume**:
   - Press `v`, then enter a value between `0` and `100` when prompted:
     ```
     🔊 Set volume (0-100): 50
     ```

3. **Add a Track to Playlist**:
   - Press `a`, then provide the track URI when prompted:
     ```
     🔎 Enter Track URI to add to your playlist: spotify:track:4cOdK2wGLETKBW3PvgPWqT
     ```

4. **View Queue**:
   - Press `p` to see the next 10 tracks in the queue:
     ```
     🎧 Upcoming Tracks (Next 10):
     ──────────────────────────────
     1. Song Name
        Artists: Artist Name
        Album: Album Name
        Duration: 3:45

     ──────────────────────────────
     ```

---

## Troubleshooting

1. **Authentication Issues**:
   - Ensure your `.env` file contains the correct credentials.
   - Verify that the `Redirect URI` in your Spotify Developer Dashboard matches `http://127.0.0.1:8888/callback`.

2. **API Errors**:
   - If you encounter API errors, check your internet connection and ensure your access token is valid.

3. **Missing Dependencies**:
   - Run `npm install` to ensure all required dependencies are installed.

---

## Contributing

Contributions are welcome! If you'd like to improve this project, feel free to fork the repository and submit a pull request. Please ensure your changes are well-documented and tested.

---

## License

This project is licensed under the MIT License.

---

Enjoy controlling Spotify from your terminal! 🎶

---
