import React from 'react';

class Trainset extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="form-container train">
                <h1>Train</h1>
                <div className="input-group col-sm-12">
                    <select multiple className="form-control">
                        <option>Set 1</option>
                    </select>
                </div>
                <br />
                <button className="btn btn-primary col-sm-12" ref="startRecord">Train Samples</button>
            </div>
        );
    }
}

export default Trainset;
