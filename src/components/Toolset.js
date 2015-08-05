import React from 'react';

class Toolset extends React.Component {
    constructor(props) {
        super(props);
    }
    //playHandler() {
    //    this.props.rxsrc.source.subscribe((context) => {
    //        console.log('here');
    //        console.log(context);
    //    });
    //}
    render() {
        return (
            <div className="container-fluid row">
                <div className="input-group col-sm-12">
                    <input type="text" className="form-control" placeholder="Name The Sample" />
                </div>
                <br />
                <button className="btn btn-primary col-sm-12">Record Sample</button>
                <br /><br />
                <button className="btn btn-danger col-sm-12">Stop</button>
            </div>
        );
    }
}

export default Toolset;
