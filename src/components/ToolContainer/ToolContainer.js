import React from 'react';
import _ from 'lodash';
import Video from '../Video/Video';
import Toolset from '../Toolset/Toolset';
import Trainset from '../Trainset/Trainset';
import Testset from '../Testset/Testset';

import VideoModel from '../../models/video-model';
import SamplerModel from '../../models/sampler-model';

class ToolContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            VideoState : null,
            SampleState : null
        };
    }
    componentDidMount() {
        VideoModel.subject.subscribe((VideoState) => {
            let newState = _.extend({}, this.state, {
                VideoState
            });

            this.setState(newState);
        });

        SamplerModel.subject.subscribe((SampleState) => {
            let newState = _.extend({}, this.state, {
                SampleState
            });

            this.setState(newState);
        });
    }
    render() {
        let containerStyles = {
            paddingTop: 71
        };

        return (
            <div className="row" style={containerStyles}>
                <div className="col-lg-6 video">
                    <Video SampleState={this.state.SampleState}/>
                </div>
                <div className="col-lg-6">
                    <Toolset />
                    <hr />
                    <Trainset />
                    <hr />
                    <Testset />
                </div>
            </div>
        );
    }
}

export default ToolContainer;
