import React from 'react';
import Navbar from './Navbar';
import ToolContainer from './ToolContainer';

class Main extends React.Component {
    render() {
        return (
            <div className="main-container">
                <Navbar />
                <ToolContainer/>
            </div>
        );
    }
}

export default Main;