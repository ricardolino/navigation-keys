import React, { Component } from 'react';
import './App.css';
import Navigation from './Navigation';
import axios from 'axios';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data1: [],
            data2: [],
            top: 0,
            left: 0
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

    beforeSelectPreviousItem (e) {
        console.log('parent beforeSelectPreviousItem');
    }

    beforeSelectNextItem (e) {
        console.log('parent beforeSelectNextItem');
    }

    beforeSelectPreviousStage (e) {
        console.log('parent beforeSelectPreviousStage');

        if (this.state.top < 0) {
            this.setState({
                top: this.state.top + 265
            });
        }
    }

    beforeSelectNextStage (e) {
        console.log('parent beforeSelectNextStage');
        this.setState({
            top: this.state.top - 265
        });
    }

    animateToLeft () {
        ;
    }

    _transformCss (position) {
        return {
            transform: `translateY(${position}px)`,
            WebkitTransform: `translateY(${position}px)`,
            MozTransform: `translateY(${position}px)`
        }
    }

    render () {

        let style = {
            ...this._transformCss(this.state.top)
        };

        return (
            <div className="App">
                <div className="zone">
                    <Navigation
                        beforeSelectPreviousItem={this.beforeSelectPreviousItem.bind(this)}
                        beforeSelectNextItem={this.beforeSelectNextItem.bind(this)}
                        beforeSelectPreviousStage={this.beforeSelectPreviousStage.bind(this)}
                        beforeSelectNextStage={this.beforeSelectNextStage.bind(this)}>
                            <a href="#1">0</a>
                            <a href="#2">1</a>
                            <a href="#3">2</a>
                    </Navigation>
                    <Navigation
                        beforeSelectPreviousItem={this.beforeSelectPreviousItem.bind(this)}
                        beforeSelectNextItem={this.beforeSelectNextItem.bind(this)}
                        beforeSelectPreviousStage={this.beforeSelectPreviousStage.bind(this)}
                        beforeSelectNextStage={this.beforeSelectNextStage.bind(this)}>
                        {
                            this.state.data1.map((element, index) => {
                                return <a href={"#" + index} key={index}>{ index }</a>
                            })
                        }
                    </Navigation>
                    <Navigation
                        beforeSelectPreviousItem={this.beforeSelectPreviousItem.bind(this)}
                        beforeSelectNextItem={this.beforeSelectNextItem.bind(this)}
                        beforeSelectPreviousStage={this.beforeSelectPreviousStage.bind(this)}
                        beforeSelectNextStage={this.beforeSelectNextStage.bind(this)}>
                        <a href="#">0</a>
                    </Navigation>
                    <Navigation
                        beforeSelectPreviousItem={this.beforeSelectPreviousItem.bind(this)}
                        beforeSelectNextItem={this.beforeSelectNextItem.bind(this)}
                        beforeSelectPreviousStage={this.beforeSelectPreviousStage.bind(this)}
                        beforeSelectNextStage={this.beforeSelectNextStage.bind(this)}>
                        {
                            this.state.data2.map((element, index) => {
                                return <a href={"#" + index} key={index}>{ index }</a>
                            })
                        }
                    </Navigation>
                </div>
            </div>
        );
    }
}

export default App;
