import React, { Component } from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { binData } from './services/visualization/index';

const BIN_COUNT = 100

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
    this.createBarChart();
  }

  componentDidUpdate(prevProps: IProps) {
    this.createBarChart();
  }

  createBarChart() {

    if (this.props.data == null) {
      return;
    } 

    const obj = binData(this.props.data, BIN_COUNT);
    const node = this.node;

    const bar_width = this.props.size[0] / BIN_COUNT / 2;

    const yScale = scaleLinear()
      .domain([0, 1])
      .range([0, this.props.size[1]]);

    const xScale = scaleLinear()
      .domain([0, Math.max(...Object.keys(obj).map(d => +d))])
      .range([0, this.props.size[0] - bar_width]);

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
      .data(Object.entries(obj).sort(([a], [c]) => +a - +c))
      .style('fill', ([x]: any) => {
        return +x < this.props.currentPosition! ? 'orange' : 'black'
      })
      .attr('x', ([x], i) => {
        return i % 2 ? xScale(+x) : xScale(+x) + bar_width * 0.25
      })
      .attr('y', ([_, y]: any) => this.props.size[1] - yScale(y))
      .attr('height', ([x, y]: any) => yScale(y))
      .attr('width', (_: any) => bar_width * 0.75)
  }

  render() {
    return <svg ref={node => this.node = node}
      width={this.props.size[0]}
      height={this.props.size[1]}
    >
    </svg>
  }
}
