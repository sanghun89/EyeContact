import React from 'react';
import RecordIntent from '../../intents/record-intent';
import RecordModel from '../../models/record-model';
import _ from 'lodash';

class Toolset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        RecordModel.subject.subscribe((RecordState) => {
            this.setState(_.extend({}, RecordState));
        });

        let startRecord = this.refs.startRecord.getDOMNode();
        let stopRecord = this.refs.stopRecord.getDOMNode();

        RecordIntent.initRecord({
            startRecord,
            stopRecord
        });
    }
    render() {
        //let recordButton
        return (
            <div className={this.state.recordStatus}>
                <div className="input-group col-sm-12">
                    <input type="text" className="form-control" placeholder="Name The Sample" />
                </div>
                <br />
                <div className="input-group col-sm-12">
                    <input type="text" className="form-control" placeholder="Classification (separated by commas)" />
                </div>
                <br />
                <button className="btn btn-primary col-sm-12 start-record" ref="startRecord">Record Sample</button>
                <button className="btn btn-danger col-sm-12 stop-record" ref="stopRecord">Stop &amp; Save</button>
            </div>
        );
    }
}

Toolset.propTypes = {
    SampleState: React.PropTypes.object,
    VideoState: React.PropTypes.object
};

export default Toolset;
