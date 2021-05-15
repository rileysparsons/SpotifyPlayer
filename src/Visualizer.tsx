import React, { Component } from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

const BIN_COUNT = 50

interface IProps {
  data: {
    [key: number]: number
  };
  currentPosition?: number;
  size: number[];
}

export class Visualizer extends Component<IProps, any> {

  node?: any;

  constructor(props: IProps) {
    super(props)
    this.createBarChart = this.createBarChart.bind(this)
  }

  componentDidMount() {
    this.createBarChart()
  }

  componentDidUpdate() {
    this.createBarChart()
  }

  roundToNearest(value: number, interval: number) {
    return Math.floor(value/interval) * interval;
  }

  binData = (data: {[key: number]: number}, binCount: number, split = 2) => {
    console.log(data);
    const [minVolume, maxVolume] = Object.values(data).reduce(([min, max], volume) => {
      let _max = max, _min = min;
      if (volume > max) {
        _max = volume;
      }

      if (volume < min) {
        _min = volume;
      }

      return [_min, _max];
    }, [Number.MAX_VALUE, Number.MIN_VALUE]);

    const obj: {[key: number]: number} = {};
    const sampleIntervals = Object.keys(data).map((n) => +n);

    const sampleInterval = Math.max(...sampleIntervals) / (sampleIntervals.length - 1);

    const binSize = (Math.max(...sampleIntervals) + sampleInterval) / binCount;

    for (let i = Math.min(...sampleIntervals); i < Math.max(...sampleIntervals) + sampleInterval - binSize; i += binSize) {
      const volumeSamples = [];
      const s = Math.floor(binSize / sampleInterval);
      let value;
      if (s === 0) {
        value = (data[this.roundToNearest(i, sampleInterval)] - minVolume) / (maxVolume - minVolume);
      } else {
        for (let j = i * sampleInterval; j <= i + s * sampleInterval; j += sampleInterval) {

          volumeSamples.push((data[this.roundToNearest(j, sampleInterval)] - minVolume) / (maxVolume - minVolume));
        }
        value = Math.max(...volumeSamples);
      }

      for (let k = i; k < i + binSize; k += binSize / split) {
        obj[k] = value;
      }

    }
    console.log('BINNED:', obj);
    return obj;
  }


  createBarChart() {

    if (this.props.data == null) {
      return;
    }

    const obj = this.binData(this.props.data, BIN_COUNT);

    const node = this.node;

    const yScale = scaleLinear()
      .domain([0, 1])
      .range([0, this.props.size[1]]);

    const xScale = scaleLinear()
      .domain([0, Math.max(...Object.keys(obj).map(d => +d))])
      .range([0, this.props.size[0]]);

    select(node)
      .selectAll('rect.wave')
      .data(Object.entries(obj))
      .enter()
      .append('rect')
      .attr('class', 'wave');

    select(node)
      .selectAll('rect.wave')
      .data(Object.entries(obj))
      .exit()
      .remove();

    select(node)
      .selectAll('rect.wave')
      .data(Object.entries(obj))
      .style('fill', 'black')
      .attr('x', ([x, y], i) => {
        console.log('X', x, xScale(+x), yScale(y));
        return i % 2 ? xScale(+x): xScale(+x) - (this.props.size[0] / BIN_COUNT / 2) / 2
      })
      .attr('y', ([_, y]: any) => this.props.size[1] - yScale(y))
      .attr('height', ([x, y]: any) => yScale(y))
      .attr('width', (_: any) => (this.props.size[0] / BIN_COUNT / 2) - (this.props.size[0] / BIN_COUNT / 2) / 2);
  }

  render() {
    return <svg ref={node => this.node = node}
      width={this.props.size[0]}
      height={this.props.size[1]}
    >
    </svg>
  }
}
