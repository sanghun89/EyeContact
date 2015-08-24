import React from 'react';
import Navbar from './Navbar/Navbar';
import ToolContainer from './ToolContainer/ToolContainer';

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
