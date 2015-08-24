import React from 'react';
import VideoIntent from '../../intents/video-intent';
import config from '../../config/video.config';
import Sampler from '../Sampler/Sampler';

class Video extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let canvas = this.refs.videoCanvas.getDOMNode();
        canvas.width = config.width;
        canvas.height = config.height;

        let context = canvas.getContext('2d');
        context.translate(config.width, 0);
        context.scale(-1, 1);

        VideoIntent.moveVideoToCanvas(context);
    }
    render() {
        return (
            <div style={{
                position: 'relative',
                width: config.width,
                height: config.height,
                margin: '0 auto'
            }}>
                <canvas ref="videoCanvas"></canvas>
                <Sampler SampleState={this.props.SampleState}/>
            </div>
        );
    }
}

Video.propTypes = {
    SampleState: React.PropTypes.object
};

export default Video;
