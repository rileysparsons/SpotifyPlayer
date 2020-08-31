import React, { Component } from 'react';

interface IPlayerProps {
  item?: any;
  progressMs?: number;
  isPlaying: boolean;
  play: () => any;
  pause: () => any;
}

interface IPlayerState {
  progress: number;
}

const PROGRESS_INTERVAL = 300;

class Player extends Component<IPlayerProps, IPlayerState> {

  fakeProgressInterval?: NodeJS.Timeout = undefined;

  constructor(props: IPlayerProps) {
    super(props);
    this.state = {
      progress: 0
    }
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

  render () {
    return (
      <>
        <div>
          {this.props.item && this.props.item.name}
        </div>
        <div>
          {this.props.item && this.props.item.artists[0].name}
        </div>
        <div>
          {this.props.progressMs && this.props.progressMs / 1000}
        </div>
        <div>
          {this.state.progress}
        </div>
        <button onClick={this.togglePlayback}>
          {this.props.isPlaying ? 'Pause' : 'Play'}
        </button>
      </>
    )
  }
}

export default Player;
