import React, { Component } from 'react';
import './App.css';
import Navigation from './Navigation';
import axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data1: [],
            data2: []
        }
    }
    componentDidMount () {
        axios.get('https://jsonplaceholder.typicode.com/posts/').then((data) => {
            this.setState({ data1: data.data });
        })

        axios.get('https://jsonplaceholder.typicode.com/posts/').then((data) => {
            this.setState({ data2: data.data });
        })
    }
    render () {
        return (
            <div className="App">
                <Navigation>
                    <a href="#1">0</a>
                    <a href="#2">1</a>
                    <a href="#3">2</a>
                </Navigation>
                <Navigation>
                    {
                        this.state.data1.map((element, index) => {
                            return <a href={"#" + index} key={index}>{ index }</a>
                        })
                    }
                </Navigation>
                <Navigation>
                    <a href="#">0</a>
                </Navigation>
                <Navigation>
                    {
                        this.state.data2.map((element, index) => {
                            return <a href={"#" + index} key={index}>{ index }</a>
                        })
                    }
                </Navigation>
            </div>
        );
    }
}

export default App;
