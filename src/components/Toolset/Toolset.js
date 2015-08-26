import React from 'react';
import RecordIntent from '../../intents/record-intent';
import RecordModel from '../../models/record-model';
import SampleModel from '../../models/sampler-model';
import SampleIntent from '../../intents/sampler-intent';
import _ from 'lodash';

class Toolset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            recordStatus: 'stopped',
            classification: [],
            data: [],
            dimensions: {
                width: 0,
                height: 0
            },
            dataLength : 0
        };
    }
    componentDidMount() {
        RecordModel.subject.subscribe((RecordState) => {
            this.setState({
                data : RecordState.img,
                recordStatus: RecordState.recordStatus
            });
        });

        RecordModel.staticSubject.subscribe((staticVar) => {
            this.setState({
                dataLength : staticVar.dataLen
            });
        });

        let startRecord = this.refs.startRecord.getDOMNode();
        let stopRecord = this.refs.stopRecord.getDOMNode();

        RecordIntent.initRecord({
            startRecord,
            stopRecord
        });

        SampleModel.subject.subscribe((SampleState) => {
            this.setState({
                dimensions: {
                    width: SampleState.width,
                    height: SampleState.height
                }
            });
        });
    }
    handleName(event) {
        this.setState({
            name : event.target.value
        });
    }
    handleClassification(event) {
        let classification = _.map(event.target.value.split(','), (item) =>{
            item = parseInt(item.trim());
            item = isNaN(item) ? 0 : item;
            return item;
        });

        this.setState({
            classification
        });
    }
    handleSize(edge, event) {
        let val = parseInt(event.target.value);
        let dimensions = _.extend({}, this.state.dimensions, {
            [edge] : isNaN(val) ? 0 : val
        });

        SampleIntent.changeSize(dimensions);

        this.setState({
            dimensions
        });
    }
    render() {
        return (
            <div className={this.state.recordStatus + " form-container"}>
                <h1>Record</h1>
                <div className="input-group col-sm-12">
                    <input type="text" className="form-control" placeholder="Name The Sample" value={this.state.name} onChange={this.handleName.bind(this)}/>
                </div>
                <br />
                <div className="input-group col-sm-12">
                    <input type="text" className="form-control" placeholder="Classification (separated by commas)" onChange={this.handleClassification.bind(this)} value={this.state.classification} />
                </div>
                <br />
                <div className="input-group row">
                    <div className="col-sm-6">
                        <label>Sample Width</label>
                        <input type="text" className="form-control" value={this.state.dimensions.width} onChange={this.handleSize.bind(this, 'width')}/>
                    </div>
                    <div className="col-sm-6">
                        <label>Sample Height</label>
                        <input type="text" className="form-control" value={this.state.dimensions.height} onChange={this.handleSize.bind(this, 'height')}/>
                    </div>
                </div>
                <div className="col-sm-12 text-center loader">
                    <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Recording...
                </div>
                <br />
                <p>Sample Size: {this.state.dataLength}</p>
                <button className="btn btn-primary col-sm-12 start-record" ref="startRecord">Record Sample</button>
                <button className="btn btn-danger col-sm-12 stop-record" ref="stopRecord">Stop &amp; Save</button>
            </div>
        );
    }
}

export default Toolset;
