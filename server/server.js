require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "87f8d53e86b940c0b7bbe3e5263b6401",
    clientSecret: "b1583b5958e64faa9d250268bdaa94a9",
    refreshToken,
  });
  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      // console.log(data.body);
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });

      // Save the access token so that it's used in future calls
      //   spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(400);
    });
});
app.post("/login", (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "87f8d53e86b940c0b7bbe3e5263b6401",
    clientSecret: "b1583b5958e64faa9d250268bdaa94a9",
  });
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});
app.get("/lyrics", async (req, res) => {
  const lyrics = await lyricsFinder(
    req.query.artist,
    req.query.track || "No Lyrics Found"
  );
  res.json({ lyrics });
});

app.listen(3001, () => {
  console.log("listening on port 3001");
});
