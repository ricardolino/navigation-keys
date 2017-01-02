import React, { Component } from 'react';
import './App.css';
import Navigation from './Navigation';
import axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            data: []
        }
    }
    componentDidMount () {
        axios.get('https://jsonplaceholder.typicode.com/posts/').then((data) => {
            this.setState({ data: data.data });
        })
    }
    render () {
        return (
            <div className="App">
                <Navigation>
                    {
                        this.state.data.map((element, index) => {
                            return <a href="#" key={index}>{ index }</a>
                        })
                    }
                </Navigation>
                <Navigation>
                    <a href="#">1</a>
                    <a href="#">2</a>
                    <a href="#">3</a>
                    <a href="#">4</a>
                </Navigation>
            </div>
        );
    }
}

export default App;
