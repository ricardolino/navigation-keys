import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
import Navigation from './Navigation';
import { fetchData } from './actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class App extends Component {
    static CARDLIST_HEIGHT = 265;
    static CARDLIST_WIDTH = 205;
    static CARDLIST_MAX_VISIBLE = 10;

    constructor (props) {
        super(props);

        this.state = {
            top: 0,
            left: 0
        }
    }

    beforeSelectPreviousStage () {
        if (this.state.top < 0) {
            this.setState({
                top: this.state.top + App.CARDLIST_HEIGHT
            });
        }
    }

    beforeSelectNextStage () {
        if (((this.state.top * -1) / App.CARDLIST_HEIGHT) !== (this.stage.children.length - 1)) {
            this.setState({
                top: this.state.top - App.CARDLIST_HEIGHT
            });
        }
    }

    _moveStageVertically (top) {
        return {
            transform: `translate3d(0px, ${top}px, 0)`,
            WebkitTransform: `translate3d(0px, ${top}px, 0)`,
            MozTransform: `translate3d(0px, ${top}px, 0)`
        }
    }

    onScroll (e) {
        e.target.scrollLeft = 0;
        e.target.scrollTop = 0;
    }
    
    componentDidMount () {
        this.props.fetchData();
    }
    
    render () {

        let style = {
            ...this._moveStageVertically(this.state.top)
        };

        let navigationProps = {
            beforeSelectPreviousStage: this.beforeSelectPreviousStage.bind(this),
            beforeSelectNextStage: this.beforeSelectNextStage.bind(this),
            itemWidth: App.CARDLIST_WIDTH,
            maxVisible: App.CARDLIST_MAX_VISIBLE
        }

        return (
            <div className="App" onScroll={this.onScroll.bind(this)}>
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
                            this.props.data.length > 0 ? (
                                this.props.data.map((element, index) => {
                                    return <a href={"#" + index} key={index}>{ index }</a>
                                })
                            ) : null
                        }
                    </Navigation>
                    <Navigation {...navigationProps}>
                        <a href="#">0</a>
                    </Navigation>
                    <Navigation {...navigationProps} noButtonDown={true}>
                        {
                            this.props.data.length > 0 ? (
                                this.props.data.map((element, index) => {
                                    return <a href={"#" + index} key={index}>{ index }</a>
                                })
                            ) : null
                        }
                    </Navigation>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({ fetchData }, dispatch);
}

function mapStateToProps (state) {
    return {
        data: state.data
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
