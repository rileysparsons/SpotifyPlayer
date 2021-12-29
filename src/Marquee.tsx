import React, { Component } from 'react';
import { isElementOverflowing } from './utils';

import './Marquee.scss';

interface IMarqueeProps {
    title: string;
}

export class Marquee extends Component<IMarqueeProps> {

    divRef: React.RefObject<any>;
    pRef: React.RefObject<any>;

    constructor(props: IMarqueeProps) {
        super(props);
        this.divRef = React.createRef();
        this.pRef = React.createRef();
    }

    componentDidMount() {
        this.maybeApplyMarquee();
    }

    componentDidUpdate() {
        this.maybeApplyMarquee();
    }

    private maybeApplyMarquee() {
        if (isElementOverflowing(this.divRef.current)) {
            this.pRef.current.className = 'marquee';
        } else {
            this.pRef.current.className = '';
        }
    }

    render() {
        return (
            <div id='title' ref={this.divRef}>
                <p ref={this.pRef}>
                    {this.props.title}
                </p>
            </div>

        );
    }
}