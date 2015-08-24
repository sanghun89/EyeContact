import React from 'react';

class SamplerNode extends React.Component {
    render() {
        return (
            <span className="sampler-node" data-direction={this.props.direction}></span>
        );
    }
}

SamplerNode.propTypes = {
    direction: React.PropTypes.string
};

export default SamplerNode;
