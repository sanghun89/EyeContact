import React from 'react';
import Video from './Video';
import Toolset from './Toolset';

import Rx from 'rx';
import VideoModel from '../models/video-model';

let observable = Rx.Observable.combineLatest(
    VideoModel.subject,
    (VideoState) => {
        return {
            VideoState
        };
    }
);

class ToolContainer extends React.Component {
    constructor(props) {
        super(props);
        observable.subscribe((appState) => {
            this.state = appState;
            if (this.state.VideoState.observable) {
                this.state.VideoState.observable.subscribe();
            }
        });
    }
    render() {
        var containerStyles = {
            paddingTop: 71
        };

        return (
            <div className="row" style={containerStyles}>
                <div className="col-lg-8">
                    <Video />
                </div>
                <div className="col-lg-4">
                    <Toolset />
                </div>
            </div>
        );
    }
}

export default ToolContainer;
