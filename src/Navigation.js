import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HotKeys } from 'react-hotkeys';
import { connect } from 'react-redux';
import store from './store';

class Navigation extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            activeItem: 0,
            isStageActive: false
        }
    }

    selectItem = (index) => {
        if (this.refs[index]) {
            this.refs[index].focus();
            this.saveActiveItem(index);
        }
        console.log('selectItem: ', index);
    }

    saveActiveItem = (index) => {
        if (this.state.activeItem !== index) {
            this.setState({
                activeItem: index
            });
        }
    }

    activeStage = () => {
        this.setState({
            ...this.state,
            isStageActive: true
        });

        this.selectItem(this.state.activeItem);
        console.log('this Stage is active');
    }

    selectActiveItem = () => {
        let index = this.state.activeItem;
        if (this.refs[index]) {
            this.refs[index].focus();
        }
    }

    deactiveStage = () => {
        this.setState({
            ...this.state,
            isStageActive: false
        })
        console.log('this Stage is deactive');
    }

    selectPreviousItem = () => {
        let refs = this.objectToArray(this.refs),
            previous = refs.indexOf(refs[this.state.activeItem].previousSibling)
        ;
    
        this.selectItem(previous);
    }

    objectToArray (object) {
        return Object.keys(object).map((key) => {
            return object[key];
        })
    }

    selectNextItem = () => {
        let refs = this.objectToArray(this.refs),
            next = refs.indexOf(refs[this.state.activeItem].nextSibling)
        ;
    
        this.selectItem(next);
    }

    selectPreviousStage = () => {
        this.deactiveStage();

        ReactDOM.findDOMNode(this.props.stages[0].reference).focus();

        console.log('selectPreviousStage was called.', this.stage === this.props.stages[0].reference);
    }

    selectNextStage = () => {
        this.deactiveStage();

        ReactDOM.findDOMNode(this.props.stages[1].reference).focus();

        console.log('selectNextStage was called.', this.stage === this.props.stages[1].reference);
    }

    onStageFocus = (e) => {
        if (e.target.tagName !== 'A') {
            this.activeStage();
            console.log('onStageFocus was called.');
        }
    }

    onItemFocus = (e) => {
        let
            parent = e.target.parentNode,
            itemIndex = this.objectToArray(parent.childNodes).indexOf(e.target)
        ;
        
        this.saveActiveItem(itemIndex);
    }

    componentDidMount = () => {
        this.registerStage();
    }

    registerStage = () => {
        store.dispatch({
            type: 'REGISTER_STAGE',
            reference: this.stage
        });
    }

    render () {
        const map = {
            'selectPreviousItem': 'left',
            'selectNextItem': 'right',
            'selectPreviousStage': 'up',
            'selectNextStage': 'down'
        }

        const handlers = {
            'selectPreviousItem': this.selectPreviousItem,
            'selectNextItem': this.selectNextItem,
            'selectPreviousStage': this.selectPreviousStage,
            'selectNextStage': this.selectNextStage
        }

        return (
            <HotKeys keyMap={map} handlers={handlers} className="Navigation" onFocus={this.onStageFocus} ref={(stage) => { this.stage = stage; }}>
                {
                    React.Children.map(this.props.children, (element, index) => {
                        return React.cloneElement(element, { ref: index, onMouseOver: this.onItemFocus, onFocus: this.onItemFocus });
                    })
                }
            </HotKeys>
        );
    }
}

function mapStateToProps (state) {
    return {
        stages: state.stages
    }
}

export default connect(mapStateToProps)(Navigation);
