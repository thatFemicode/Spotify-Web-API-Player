import React from "react";
import useAuth from "./useAuth";
import { Container, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import axios from "axios";

// Use Effect will be used for the searching
// In order to use the spotify api WE WILL USE THE SAME
// lIBRARY USED ON THE SERVER SPOTIFY-WEB-API-NODE
const spotifyApi = new SpotifyWebApi({
  clientId: "87f8d53e86b940c0b7bbe3e5263b6401",
});
const Dashboard = ({ code }) => {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  // to save our search
  const [searchResults, setSearchResults] = useState([]);
  // console.log(searchResults);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }
  // A way to get the lyrics
  useEffect(() => {
    if (!playingTrack) return;
    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
      });
  }, [playingTrack]);
  // The first useEffect will be used for when accestoken changes
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);
  // Use Effect for searching everytime our search changes or access token changes
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    // Dealing with requests that may take longer to query
    // So what we will do is everytime we make change our searching or accesstoken  we cancel the request
    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      // Map on all the things gotten from track items
      const results = res.body.tracks.items.map((track) => {
        // Getting the smallest ablum image with the reduce array method
        const smallestAlbumImage = track.album.images.reduce(
          (smallest, image) => {
            if (image.height < smallest.height) return image;
            return smallest;
          },
          track.album.images[0]
        );
        return {
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: smallestAlbumImage.url,
        };
      });
      setSearchResults(results);
    });
    return () => (cancel = true);
  }, [search, accessToken]);
  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh" }}>
      <Form.Control
        type="search"
        placeholder="Search Songs/ Artists"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {/* {searchResults.map((track) => {
          <TrackSearchResult track={track} key={track.uri} />;
        })} */}
        {searchResults.map((track) => {
          return (
            <TrackSearchResult
              track={track}
              key={track.uri}
              chooseTrack={chooseTrack}
            />
            // <div>
            //   <img src={track.albumUrl} alt="" />
            // </div>
          );
        })}
        {searchResults === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
};

export default Dashboard;
