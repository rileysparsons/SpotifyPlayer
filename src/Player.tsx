import React, { Component } from 'react';
import {FullPlaylistObject} from './withSpotifyWebPlayer';
import {Visualizer} from './Visualizer';

import './Player.scss'
import { Marquee } from './Marquee';

interface IPlayerProps {
  item?: any;
  progressMs?: number;
  isPlaying: boolean;
  play: () => any;
  pause: () => any;
  previousTrack: () => any;
  nextTrack: () => any;
  seek: (time: number) => any;
  channels: FullPlaylistObject[];
  onChannelChange: (channel: number) => void;
  analysis: any;
  wave: any;
}

interface IPlayerState {
  progress: number;
}

const PROGRESS_INTERVAL = 300;

class Player extends Component<IPlayerProps, IPlayerState> {

  fakeProgressInterval?: NodeJS.Timeout = undefined;
  titleRef: React.RefObject<unknown>;

  constructor(props: IPlayerProps) {
    super(props);
    this.state = {
      progress: 0
    }
    this.titleRef = React.createRef();
  }

  componentDidMount() {
    this.fakeProgressInterval = setInterval(this.tickProgress, PROGRESS_INTERVAL);
  }

  static getDerivedStateFromProps(props: any, state: any) {
    var item = props.item;
    return item ? {
        progress: Math.min(props.progressMs / item.duration_ms * 100, 100)
    } : null == item && {
        progress: 0
    };
  }

  getTrackProgress(current: number, total: number) {
    return Math.min(current / total * 100, 100);
  }

  tickProgress = () => {
      this.props.isPlaying && this.setState((state) => {
          const t = state.progress;
          if (this.props.item && t < 100 && t != null) {
              return {
                  progress: this.getTrackProgress(
                    t / 100 * this.props.item.duration_ms + PROGRESS_INTERVAL,
                    this.props.item.duration_ms
                  )
              }
          }
      })
  }

  togglePlayback = () => {
    if (this.props.isPlaying) {
      this.props.pause();
    } else {
      this.props.play();
    }
  }

  convertSecondsToMinutes = (seconds: number) => {

    const pad = (n: number, width: number, z = '0') => {
      const _n =  n + '';
      return _n.length >= width ? _n : new Array(width - _n.length + 1).join(z) + n;
    }

    return `${pad(Math.round(seconds / 60), 2)}:${pad(Math.round(seconds) % 60, 2)}`
  }

  render () {
    return (
      <div className='player container'>
        <Visualizer 
          currentPosition={this.props.progressMs && this.props.progressMs / 1000} 
          data={this.props.wave} 
          size={[300,100]}>
        </Visualizer>
        <div className='select-wrapper'>
          <span className='title'>{'Channel:'}</span>
          <select onChange={(e) => this.props.onChannelChange(e.target.selectedIndex)}>
            {
              this.props.channels.map(({name, id}) => {
                return <option key={id} value={id}>{name}</option>
              })
            }
          </select>
        </div>
        <div className='time'>
          {this.props.progressMs && this.props.item ? `${this.convertSecondsToMinutes(this.props.progressMs / 1000)} / ${this.convertSecondsToMinutes(this.props.item.duration_ms / 1000)}` : '.. / ..'}
        </div>
        <Marquee title={this.props.item && this.props.item.name}></Marquee>
        <div className='artist'>
          {this.props.item && this.props.item.artists[0].name}
        </div>
        <div>
          <button className='action' disabled={!this.props.item} onClick={this.props.previousTrack}>
          </button>
          <button className='action' disabled={!this.props.item}  onClick={() => this.props.seek(-5)}>
          </button>
          <button className='action' disabled={!this.props.item} onClick={this.togglePlayback}>
          </button>
          <button className='action' disabled={!this.props.item} onClick={() => this.props.seek(5)}>
          </button>
          <button className='action' disabled={!this.props.item} onClick={this.props.nextTrack}>
          </button>
        </div>
      </div>
    )
  }
}

export default Player;
