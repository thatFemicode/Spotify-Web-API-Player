import React from "react";
import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";
const Player = ({ accessToken, trackUri }) => {
  const [play, setPlay] = useState(false);

  useEffect(() => {
    setPlay(true);
  }, [trackUri]);
  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      play={play}
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
      }}
      // If we have a song to play pass it into an array uri other wise send an empty array
      uris={trackUri ? [trackUri] : []}
    />
  );
};

export default Player;
// ShowSaveIcon to allow us to save songs to spotify library
// Track Uri is for the track we want to play
