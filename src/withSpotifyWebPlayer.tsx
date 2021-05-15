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

export interface FullPlaylistObject {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null | string;
    total: number;
  };
  href: null | string;
  id: string;
  images: {
    url: string;
  }[];
  name: string;
  owner: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  public: null;
  snapshot_id: string;
  tracks: {
    href: string;
    items: {
      added_at: string;
      added_by: {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        type: string;
        uri: string;
      };
      is_local: boolean;
      track: {
        album: {
          album_type: string;
          available_markets: string;
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          images: {
            height: number;
            url: string;
            width: number;
          }[];
          name: string;
          type: string;
          uri: string;
        };
        artists: {
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          name: string;
          type: string;
          uri: string;
        }[];
        available_markets: string[];
        disc_number: number;
        duration_ms: number;
        explicit: boolean;
        external_ids: {
          isrc: string;
        };
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        popularity: number;
        preview_url: string;
        track_number: number;
        type: string;
        uri: string;
      };
    }[];
    limit: number;
    next: string;
    offset: number;
    previous: null;
    total: number;
  };
  type: string;
  url: string;
}

export interface SegmentObject {
  start: number;
  duration: number;
  confidence: number;
  loudness_start: number;
  loudness_max_time: number;
  loudness_max: number;
  loudness_end: number;
  pitches: number[];
  timbre: number[];
}


const PROGRESS_INTERVAL = 300;

export default function withSpotifyWebPlayer(WrappedComponent: ReactType, playlists: string[] = []) {
  class InnerComponent extends Component<any, any> {

    player?: any;
    stopPolling?: () => void;

    constructor(props: any) {
      super(props);
      this.state = {
        item: null,
        progressMs: null,
        isPlaying: false,
        playlists: [],
        currentPlaylist: 0,
        loudnessWave: null
      };

      this.fetchPlaylistsMetadata(playlists).then((metadatas: any[]) => {
          this.setState({
            playlists: metadatas
          });
      });
    }

    componentDidUpdate({ Spotify, access_token }: { Spotify: any, access_token: string }, { currentPlaylist, item }: { currentPlaylist: number, item: FullPlaylistObject }) {
      if (!Spotify && this.props.Spotify) { // load finished
        if (this.props.access_token) {
          this.initializeSpotify(this.props.access_token);
        }
      } else if (!access_token && this.props.access_token) {
        if (this.props.Spotify) {
          this.initializeSpotify(this.props.access_token);
        }
      }

      if (currentPlaylist !== this.state.currentPlaylist) {
        this.playContext(this.state.playlists[this.state.currentPlaylist].id);
      }

      if (item == null && this.state.item || (item && item.id != this.state.item.id)) {
        this.fetchTrackAnalysis(this.state.item.id).then(({segments}: {segments: SegmentObject[]}) => {
          this.setState({
            loudnessWave: this.getPitchesOverTime(segments)
          })
        });
      }
    }

    getPitchesOverTime(segments: SegmentObject[]) {

      const resampled: {[key: number]: number} = {};

      segments.forEach(({start, duration, loudness_max}) => {
        const roundedStart = Math.round(start);
        const roundedEnd = Math.round(start + duration);
        
        for (let i = roundedStart; i < roundedEnd; i++) {
          resampled[i] = loudness_max;
        }
      });

      return resampled;
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

        if (state) {
          console.log('changed', !state.paused);
          this.setState({
            item: state.track_window.current_track,
            isPlaying: !state.paused
          });
          if (!state.paused) {
              this.pollForTrack();
          } else {
            if (this.stopPolling) {
              this.stopPolling();
            }
            setTimeout(() => this.getState);
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
        // This used to be done for free, but something changed
        this.player._options = {
          ...this.player._options,
          id: device_id
        }
        this.setState({
          isReady: true
        });
        this.playContext(playlists[this.state.currentPlaylist]);
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


    fetchPlaylistsMetadata = async (ids: string[]) => {
      const metadatas: any[] = [];
      for (let id of ids) {
        await fetch(
          `https://api.spotify.com/v1/playlists/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.props.access_token}`
            },
          }
        )
        .then((res) => {
          return res.json();
        })
        .then((metadata: FullPlaylistObject) => {
          metadatas.push(metadata)
        });
      }
      return metadatas;
    }

    fetchTrackAnalysis = (id: string) => {
        return fetch(
          `https://api.spotify.com/v1/audio-analysis/${id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${this.state.access_token}`
            },
          }
        ).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.status as any);
        }
      }).then((data) => {
        return data;
      }).catch(e => {
        if (e.message === 401) {
          this.props.onAuthError();
        }
      });
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
        console.log('data', data.is_playing);
        this.setState(
          {
            item: data.item,
            isPlaying: data.is_playing,
            progressMs: data.progress_ms
          }
        );
        return data;
      }).catch((error) => {
        if (error.message === 401) {
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

    previousTrack = () => {
      return this.player.previousTrack();
    }

    nextTrack = () => {
      return this.player.nextTrack();
    }

    seek = (time: number) => {
      const seekTime = Math.min(Math.max(0, this.state.progressMs + (time * 1000)), this.state.item.duration_ms);
      console.log('seek', seekTime);
      return this.player.seek(seekTime)
        .then(() => {
            this.setState({
              progressMs: seekTime
            });
        });
    }

    playContext = (spotify_uri: string) => {
        const play = ({
          spotify_uri,
          playerInstance: {
            _options: {
              getOAuthToken,
              id
            }
          }
        }: {
          spotify_uri: string,
          playerInstance: {
            _options: {
              getOAuthToken: any,
              id: string
            }
          }
        }) => {
          getOAuthToken((access_token: string) => {
            this.setState({
              access_token
            });
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
              method: 'PUT',
              body: JSON.stringify({ context_uri: `spotify:playlist:${spotify_uri}` }),
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
              },
            });
          });
        };
        console.log(this.player);
        play({
          playerInstance: this.player,
          spotify_uri
        });
    }

    onPlaylistChange = (currentPlaylist: number) => {
      this.setState({
        currentPlaylist
      });
    }

    render() {
      return <WrappedComponent
        play={this.play}
        pause={this.pause}
        previousTrack={this.previousTrack}
        nextTrack={this.nextTrack}
        seek={this.seek}
        item={this.state.item}
        isPlaying={this.state.isPlaying}
        progressMs={this.state.progressMs}
        channels={this.state.playlists}
        currentChannel={this.state.currentPlaylist}
        onChannelChange={this.onPlaylistChange}
        wave={this.state.loudnessWave}
      />
    }

  }

  return makeAsyncScriptLoader('https://sdk.scdn.co/spotify-player.js', {callbackName: 'onSpotifyWebPlaybackSDKReady', globalName: 'Spotify'})(InnerComponent);
}
