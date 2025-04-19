const express = require("express");
let open;
(async () => {
  open = (await import("open")).default;
})();

const SpotifyWebApi = require("spotify-web-api-node");
require("dotenv").config();
const app = express();
const port = 8888;
//credentials
const spotifyapi = new SpotifyWebApi({
    clientId : process.env.SPOTIFY_CLIENT_ID,
    clientSecret : process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri : process.env.SPOTIFY_REDIRECT_URI,
});

const Scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
];

app.get("/login",(req,res) => {
    const authorizeURL = spotifyapi.createAuthorizeURL(Scopes);
    res.redirect(authorizeURL);
});
app.get("/callback" , async (req , res) => {
    const {code} = req.query;
    try {
const data = await spotifyapi.authorizationCodeGrant(code);
const {access_token , refresh_token} = data.body;
spotifyapi.setAccessToken(access_token);
spotifyapi.setRefreshToken(refresh_token);

res.send("🎶 Successfully authenticated! You can now use the terminal player.");
console.log("Access Token:", access_token);
console.log("Refresh Token:", refresh_token);
    }
    catch(error) {
        console.error("Error during callback", error);
        res.send("❌ Error during authentication");
    }
});
app.listen(port, async () => {
    console.log(`🔐 Visit http://127.0.0.1:${port}/login to authenticate`);

    // Dynamically import and open the browser
    const open = (await import("open")).default;
    await open(`http://127.0.0.1:${port}/login`);
});

  