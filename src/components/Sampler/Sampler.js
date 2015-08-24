import React from 'react';
import SamplerNode from './SamplerNode';
import SamplerIntent from '../../intents/sampler-intent';

const direction = {
    0 : 'nw',
    1 : 'n',
    2 : 'ne',
    3 : 'e',
    4 : 'w',
    5 : 'se',
    6 : 's',
    7 : 'sw'
};

class Sampler extends React.Component {
    constructor(props) {
        super(props);
        this.nodes = Array.apply(null, new Array(8)).map((_, i)=> (
            <SamplerNode key={i} direction={direction[i]}/>
        ));
    }
    componentDidMount() {
        let sampleContainer = React.findDOMNode(this.refs.parentNode);
        let sampleNodes = Array.prototype.slice.call(sampleContainer.childNodes);
        SamplerIntent.resizeSample(sampleNodes);
    }
    render() {
        return (
            <div className="sampler-container" style={this.props.SampleState} ref="parentNode">
                {this.nodes}
            </div>
        );
    }
}

Sampler.propTypes = {
    SampleState: React.PropTypes.object
};

export default Sampler;
