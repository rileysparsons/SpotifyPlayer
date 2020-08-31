/* global Spotify */
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Player from './Player';
import scriptLoader from 'react-async-script-loader';


import { Route, Redirect, useParams } from "react-router-dom";
import withSpotifyWebPlayer from './withSpotifyWebPlayer';

const clientId = '5b05b04c1f9d432daf65fcccd9d46559'; // Your client id
const clientSecret = '4503af0262b645fdac34eccdff17cdde'; // Your secret
const redirectUri = 'http://localhost:3000/callback'; // Your redirect uri
const scopes = 'user-read-private user-read-email user-read-playback-state streaming user-top-read';
const state = '123';

const PlayerWithSpotifyWebPlayer = withSpotifyWebPlayer(Player);

class App extends Component {

  player;
  stopPolling;

  constructor(props){
    super(props);
    this.state = {
      trackId: undefined,
      isReady: false,
      access_token: localStorage.getItem('access_token') || undefined,
      expires_in: undefined,
      progress: undefined,
      item: undefined,
      isPlaying: false,
      progressMs: 0,
      deviceId: undefined
    }
  }

  componentDidMount () {

    if (this.state.access_token) {
      this.onLogIn(this.state.access_token);
    }
  }

  componentWillUnmount() {
    this.stopPolling();
    if (this.player) {
      this.player.disconnect();
    }
  }

  onLogIn = (token) => {
    if (this.stopPolling) {
      this.stopPolling();
    }
  }

  async getCurrentlyPlaying(token) {
    // Make a call using the token

    if (!this.player) {
      return;
    }

    return this.player.getCurrentState().then(state => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }

      let {
        current_track,
        next_tracks: [next_track]
      } = state.track_window;

      console.log('Currently Playing', current_track);
      console.log('Playing Next', next_track);
    });



    // return fetch(
    //   `https://api.spotify.com/v1/me/player`, {
    //     method: 'GET',
    //     headers: {
    //       'Authorization': `Bearer ${this.state.access_token}`
    //     },
    //   }
    // ).then((res) => {
    //   if (res.ok) {
    //     return res.json();
    //   } else {
    //     throw new Error(res.status);
    //   }
    // }).then(data => {
    //   this.setState(
    //     {
    //       item: data.item,
    //       isPlaying: data.is_playing,
    //       progressMs: data.progress_ms
    //     }
    //   );
    //   return data;
    // }).then((data) => {
    //   return fetch(
    //     `https://api.spotify.com/v1/audio-analysis/${data.item.id}`, {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${this.state.access_token}`
    //       },
    //     }
    //   )
    // }).then((res) => {
    //   if (res.ok) {
    //     return res.json();
    //   } else {
    //     throw new Error(res.status);
    //   }
    // }).then((data) => {
    //   console.log(data);
    // }).catch(e => {
    //   if (e.message === '401') {
    //     localStorage.removeItem('access_token');
    //     this.setState({
    //       access_token: undefined,
    //       item: undefined,
    //       isPlaying: false,
    //       progressMs: 0
    //     });
    //     this.stopPolling();
    //   }
    // });
  }

  handleChange = (event) => {
    this.setState({trackId: event.target.value});
  }

  playTrack = (spotify_uri) => {
    const play = ({
      spotify_uri,
      playerInstance: {
        _options: {
          getOAuthToken,
          id
        }
      }
    }) => {
      getOAuthToken(access_token => {
        this.setState({
          access_token
        });
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
          method: 'PUT',
          body: JSON.stringify({ uris: [spotify_uri] }),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
        });
      });
    };

    play({
      playerInstance: this.player,
      spotify_uri
    });
  }

  buildAuthEndpoint() {
    return `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes)}&response_type=token&state=${state}`;
  }

  handleCallback = ({access_token, expires_in}) => {
    localStorage.setItem('access_token', access_token);
    this.setState({
      access_token,
      expires_in
    });
  }

  onAuthError = () => {
      localStorage.removeItem('access_token');
      this.setState({
        access_token: undefined,
      });
  }

  render() {

    const Callback = (props) => {
      const returnedProps = props.location.hash.substring(1)
        .split("&")
        .reduce(function(initial, item) {
          if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
      this.handleCallback(returnedProps);
      return (
        <Redirect to={'/'}/>
      )
    }

    return (
      <>
        {!this.state.access_token &&
            <a
              className="btn btn--loginApp-link"
              href={`${this.buildAuthEndpoint()}`}>
            Login to Spotify
          </a>
        }
        {this.state.access_token &&
          <PlayerWithSpotifyWebPlayer
            access_token={this.state.access_token}
            onAuthError={this.onAuthError}
          />
        }
        <Route path='/callback' component={Callback}/>
      </>
    );
  }
}
export default App;
