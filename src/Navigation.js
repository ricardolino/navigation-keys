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
            isStageActive: false,
            stageIndex: 0
        }
    }

    selectItem (index) {
        if (this.refs[index]) {
            this.refs[index].focus();
            this.saveActiveItem(index);
        }
    }

    saveActiveItem (index) {
        if (this.state.activeItem !== index) {
            this.setState({
                activeItem: index
            });
        }
    }

    selectPreviousItem (e, count = 0) {
        let refs = this.objectToArray(this.refs),
            jumpTo = this.state.activeItem - count,
            activeItem = (jumpTo > count) ? jumpTo : this.state.activeItem,
            previous = refs.indexOf(refs[activeItem].previousSibling)
        ;

        if (previous < 0) {
            previous = 0;
        }

        this.selectItem(previous);

        e.preventDefault();
    }

    selectNextItem (e, count = 0) {
        let refs = this.objectToArray(this.refs),
            jumpTo = this.state.activeItem + count,
            activeItem = (jumpTo < (refs.length - 1)) ? jumpTo : this.state.activeItem,
            next = refs.indexOf(refs[activeItem].nextSibling)
        ;

        if (next < 0) {
            next = refs.length - 1;
        }


        this.selectItem(next);
        e.preventDefault();
    }

    objectToArray (object) {
        return Object.keys(object).map((key) => {
            return object[key];
        })
    }

    activeStage () {
        this.setState({
            isStageActive: true
        });

        this.selectItem(this.state.activeItem);
    }

    deactiveStage () {
        this.setState({
            isStageActive: false
        })
    }

    registerStage () {
        store.dispatch({
            type: 'REGISTER_STAGE',
            reference: this.stage
        });
    }

    updateStageIndex (stages) {
        this.setState({
            stageIndex: stages.findIndex(item => {
                return item === this.stage;
            })
        });
    }

    filterStagesWithChildren (stages) {
        return stages.filter((object) => {
            return object.props.children && object.props.children.length > 0;
        });
    }

    selectStage (stages, index) {
        if (stages[index]) {
            this.deactiveStage();

            setTimeout(() => {
                ReactDOM.findDOMNode(stages[index]).focus();
            }, 300);
        }
    }

    selectPreviousStage (e) {
        let
            previousIndex = parseInt(this.state.stageIndex - 1, 10),
            stages = this.filterStagesWithChildren(this.props.stages)
        ;

        if (this.props.beforeSelectPreviousStage) {
            this.props.beforeSelectPreviousStage();
        }

        this.selectStage(stages, previousIndex);
        e.preventDefault();
    }

    selectNextStage (e) {
        let
            nextIndex = parseInt(this.state.stageIndex + 1, 10),
            stages = this.filterStagesWithChildren(this.props.stages)
        ;

        if (this.props.beforeSelectNextStage) {
            this.props.beforeSelectNextStage();
        }

        this.selectStage(stages, nextIndex);
        e.preventDefault();
    }

    onItemFocus (e) {
        let
            parent = e.target.parentNode,
            itemIndex = this.objectToArray(parent.childNodes).indexOf(e.target)
        ;

        this.saveActiveItem(itemIndex);


        console.log('itemFocus');
        e.preventDefault();
    }

    onStageFocus (e) {
        if (e.target.tagName !== 'A') {
            this.activeStage();
        }
    }

    componentDidMount () {
        this.registerStage();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this.updateStageIndex(this.props.stages.filter((object) => {
                return object.props.children;
            }));
        }
    }

    render () {
        const map = {
            'selectPreviousItem': 'left',
            'selectNextItem': 'right',
            'selectPreviousStage': 'up',
            'selectNextStage': 'down'
        }

        const handlers = {
            'selectPreviousItem': this.selectPreviousItem.bind(this),
            'selectNextItem': this.selectNextItem.bind(this),
            'selectPreviousStage': this.selectPreviousStage.bind(this),
            'selectNextStage': this.selectNextStage.bind(this)
        }

        const buttons = (
            <div className="buttons">
                <button className={"button l" + (this.props.noButtonLeft ? " hidden" : "") } onClick={(e) => this.selectPreviousItem(e, 7)}>&larr;</button>
                <button className={"button r" + (this.props.noButtonRight ? " hidden" : "") } onClick={(e) => this.selectNextItem(e, 7)}>&rarr;</button>
                <button className={"button u" + (this.props.noButtonUp ? " hidden" : "") } onClick={this.selectPreviousStage.bind(this)}>&uarr;</button>
                <button className={"button d" + (this.props.noButtonDown ? " hidden" : "") } onClick={this.selectNextStage.bind(this)}>&darr;</button>
            </div>
        );

        return (
            <div className={"navigation-stage " + (this.state.isStageActive ? 'active' : '')} ref={(stage) => { this.navigationStage = stage; }}>
                <HotKeys ref={(stage) => { this.stage = stage; }} keyMap={map} handlers={handlers} className="navigation" onFocus={this.onStageFocus.bind(this)}>
                    {
                        React.Children.map(this.props.children, (element, index) => {
                            return React.cloneElement(element, { ref: index, onMouseOver: this.onItemFocus.bind(this), onFocus: this.onItemFocus.bind(this) });
                        })
                    }
                </HotKeys>

                { this.state.isStageActive ? buttons : null }
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        stages: state.stages
    }
}

export default connect(mapStateToProps)(Navigation);
