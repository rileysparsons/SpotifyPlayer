import * as React from 'react';
import {Component, ReactType} from 'react';
import makeAsyncScriptLoader from 'react-async-script';

declare global {
    interface Window {
      onSpotifyWebPlaybackSDKReady: () => void;
      Spotify: any;
    }
}

interface WebPlaybackTrack {
  uri: string; // Spotify URI
  id: string | null;               // Spotify ID from URI (can be null)
  type: string;             // Content type: can be "track", "episode" or "ad"
  media_type: string;       // Type of file: can be "audio" or "video"
  name: string;         // Name of content
  is_playable: boolean;         // Flag indicating whether it can be played
  album: {
    uri: string; // Spotify Album URI
    name: string;
    images: [
      { url: string }
    ];
  };
  artists: [
    { uri: string, name: string }
  ];
}

interface WebPlaybackState {
  context: {
    uri: string | null; // The URI of the context (can be null)
    metadata: any | null;             // Additional metadata for the context (can be null)
  };
  disallows: {                // A simplified set of restriction controls for
    pausing?: boolean;           // The current track. By default, these fields
    peeking_next?: boolean;     // will either be set to false or undefined, which
    peeking_prev?: boolean;      // indicates that the particular operation is
    resuming?: boolean;         // allowed. When the field is set to `true`, this
    seeking?: boolean;           // means that the operation is not permitted. For
    skipping_next?: boolean;    // example, `skipping_next`, `skipping_prev` and
    skipping_prev?: boolean;     // `seeking` will be set to `true` when playing an
                              // ad track.
  },
  paused: boolean;  // Whether the current track is paused.
  position: number;    // The position_ms of the current track.
  repeat_mode: number; // The repeat mode. No repeat mode is 0,
                  // once-repeat is 1 and full repeat is 2.
  shuffle: boolean; // True if shuffled, false otherwise.
  track_window: {
    current_track: WebPlaybackTrack;                              // The track currently on local playback
    previous_tracks: WebPlaybackTrack[]; // Previously played tracks. Number can vary.
    next_tracks: WebPlaybackTrack[];    // Tracks queued next. Number can vary.
  };
}

const PROGRESS_INTERVAL = 300;

export default function withSpotifyWebPlayer(WrappedComponent: ReactType) {
  class InnerComponent extends Component<any, any> {

    player?: any;
    stopPolling?: () => void;

    constructor(props: any) {
      super(props);
      this.state = {
        item: null,
        progressMs: null,
        isPlaying: false
      }
    }

    componentDidUpdate({ Spotify, access_token }: { Spotify: any, access_token: string }) {
      if (!Spotify && this.props.Spotify) { // load finished
        if (this.props.access_token) {
          this.initializeSpotify(this.props.access_token);
        }
      } else if (!access_token && this.props.access_token) {
        if (this.props.Spotify) {
          this.initializeSpotify(this.props.access_token);
        }
      }
    }

    componentDidMount () {

      if (this.props.access_token != null && this.props.Spotify) {
        this.initializeSpotify(this.state.access_token);
      }

      const { isScriptLoaded, isScriptLoadSucceed } = this.props
      if (isScriptLoaded && isScriptLoadSucceed) {
        window.onSpotifyWebPlaybackSDKReady = () => {
          if (this.state.access_token != null) {
            this.initializeSpotify(this.state.access_token);
          }
        };
      }
    }

    componentWillUnmount() {
      if (this.player) {
        this.player.disconnect();
      }

      if (this.stopPolling) {
        this.stopPolling();
      }
    }

    initializeSpotify = (token: string) => {
      console.log('INITIALIZE');
      this.player = new this.props.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: (cb: (token: string) => void) => { cb(token); }
      });

      // Error handling
      this.player.addListener('initialization_error', ({ message }: { message: string }) => { console.error(message); });
      this.player.addListener('authentication_error', ({ message }: { message: string }) => {
        this.props.onAuthError(message);
        console.error(message);
      });
      this.player.addListener('account_error', ({ message }: { message: string }) => { console.error(message); });
      this.player.addListener('playback_error', ({ message }: { message: string }) => { console.error(message); });
      // Playback status updates
      this.player.addListener('player_state_changed', (state?: WebPlaybackState) => {
        console.log('STATE', state);
        if (state) {
          this.setState({
            item: state.track_window.current_track,
            isPlaying: state.paused
          });
          if (!state.paused) {
              this.pollForTrack();
          } else {
            if (this.stopPolling) {
              this.stopPolling();
            }
            this.getState();
          }
        } else {
          this.setState({
            item: null,
            isPlaying: false
          });
          if (this.stopPolling) {
            this.stopPolling();
          }
        }
      });

      this.player.setName("Riley's Spotify Project").then(() => {
        console.log('Player name updated!');
      });

      // Ready
      this.player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
        this.setState({
          isReady: true
        });
      });

      // Not Ready
      this.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        this.setState({
          isReady: false
        })
        if (this.stopPolling) {
          this.stopPolling();
        }
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player!
      this.player.connect();
    }

    getState = () => {
      return fetch(
        `https://api.spotify.com/v1/me/player`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.props.access_token}`
          },
        }
      ).then((res: any) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.status);
        }
      }).then(data => {
        this.setState(
          {
            item: data.item,
            isPlaying: data.is_playing,
            progressMs: data.progress_ms
          }
        );
        return data;
      }).catch((code) => {
        if (code === 401) {
          this.props.onAuthError();
        }
      })
    }

    play = () => {
      this.player.resume();
    }

    pause = () => {
      this.player.pause();
    }

    pollForTrack() {
      let timeout: NodeJS.Timeout;
      let shouldContinue = true;

      if (this.stopPolling) {
        this.stopPolling();
      }
      const poll = () => {
        if (shouldContinue) {
          timeout = setTimeout(() => {
            this.getState().then(() => {
              poll();
            });
          }, PROGRESS_INTERVAL);
        }
      }
      poll();

      this.stopPolling = () => {
        clearTimeout(timeout);
        shouldContinue = false;
      };
    }

    render() {
      return <WrappedComponent
        play={this.play}
        pause={this.pause}
        item={this.state.item}
        isPlaying={this.state.isPlaying}
        progressMs={this.state.progressMs}
      />
    }

  }

  return makeAsyncScriptLoader('https://sdk.scdn.co/spotify-player.js', {callbackName: 'onSpotifyWebPlaybackSDKReady', globalName: 'Spotify'})(InnerComponent);
}
