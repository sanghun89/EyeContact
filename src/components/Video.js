import React from 'react';
import config from './video.config';
import VideoIntent from '../intents/video-intent';

class Video extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let canvas = this.refs.videoCanvas.getDOMNode();
        canvas.width = config.width;
        canvas.height = config.height;

        let context = canvas.getContext('2d');

        VideoIntent.moveVideoToCanvas(context);
    }
    render() {
        return (
            <div className="container-fluid">
                <canvas className="container-fluid" ref="videoCanvas"></canvas>
            </div>
        );
    }
}

export default Video;
