import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
import Navigation from './Navigation';
import axios from 'axios';


class App extends Component {
    static CARDLIST_SIZE = 265;

    constructor (props) {
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

    beforeSelectPreviousItem () {
        console.log('parent beforeSelectPreviousItem');
    }

    beforeSelectNextItem () {
        console.log('parent beforeSelectNextItem');
    }

    beforeSelectPreviousStage () {
        if (this.state.top < 0) {
            this.setState({
                top: this.state.top + App.CARDLIST_SIZE
            });
        }
    }

    beforeSelectNextStage () {
        if (((this.state.top * -1) / App.CARDLIST_SIZE) !== (this.stage.children.length - 1)) {
            this.setState({
                top: this.state.top - App.CARDLIST_SIZE
            });
        }
    }

    _moveStageVertically (position) {
        return {
            transform: `translate3d(0, ${position}px, 0)`,
            WebkitTransform: `translate3d(0, ${position}px, 0)`,
            MozTransform: `translate3d(0, ${position}px, 0)`
        }
    }

    render () {

        let style = {
            ...this._moveStageVertically(this.state.top)
        };

        let navigationProps = {
            beforeSelectPreviousItem: this.beforeSelectPreviousItem.bind(this),
            beforeSelectNextItem: this.beforeSelectNextItem.bind(this),
            beforeSelectPreviousStage: this.beforeSelectPreviousStage.bind(this),
            beforeSelectNextStage: this.beforeSelectNextStage.bind(this)
        }

        return (
            <div className="App">
                <div className="stage"
                    style={style}
                    ref={(stage) => { this.stage = stage; }}>
                    <Navigation {...navigationProps} noButtonUp={true}>
                            <a href="#1">0</a>
                            <a href="#2">1</a>
                            <a href="#3">2</a>
                    </Navigation>
                    <Navigation {...navigationProps}>
                        {
                            this.state.data1.map((element, index) => {
                                return <a href={"#" + index} key={index}>{ index }</a>
                            })
                        }
                    </Navigation>
                    <Navigation {...navigationProps}>
                        <a href="#">0</a>
                    </Navigation>
                    <Navigation {...navigationProps} noButtonDown={true}>
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
