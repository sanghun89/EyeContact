import React from 'react';

class Testset extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="form-container">
                <h1>Test</h1>
                <button className="btn btn-primary col-sm-12" ref="startRecord">Test Algorithm</button>
            </div>
        );
    }
}

export default Testset;
