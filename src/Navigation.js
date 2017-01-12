import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { HotKeys } from 'react-hotkeys';
import { connect } from 'react-redux';
import { registerStage, removeStage } from './actions';

class Navigation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeItem: 0,
            isStageActive: false,
            stageIndex: 0,
            positionLeft: 0
        }

        this.selectPreviousStage = _.debounce(this.selectPreviousStage, 300);
        this.selectNextStage = _.debounce(this.selectNextStage, 300);
        this.selectPreviousItem = _.throttle(this.selectPreviousItem, 200);
        this.selectNextItem = _.throttle(this.selectNextItem, 200);
        this._selectStage = _.debounce(this._selectStage, 300);
    }

    __objectToArray (object) {
        return Object.keys(object).map((key) => {
            return object[key];
        })
    }

    __filterStagesWithChildren (stages) {
        return stages.filter((object) => {
            return object.props.children && object.props.children.length > 0;
        });
    }

    _moveStageHorizontally (left) {
        return {
            transform: `translate3d(${left}px, 0, 0)`,
            WebkitTransform: `translate3d(${left}px, 0, 0)`,
            MozTransform: `translate3d(${left}px, 0, 0)`
        }
    }

    _focusOn (element) {
        setTimeout(element.focus(), 100);
    }

    _selectItem (index) {
        if (this.refs[index]) {
            this._focusOn(this.refs[index]);
            this._saveActiveItem(index);
        }
    }

    _saveActiveItem (index) {
        if (this.state.activeItem !== index) {
            this.setState({
                activeItem: index
            });
        }
    }

    _updateStageIndex (stages) {
        this.setState({
            stageIndex: stages.findIndex(item => {
                return item === this.stage;
            })
        });
    }

    _registerStage () {
        this.props.registerStage(this.stage);
    }

    _removeStage () {
        this.props.removeStage(this.stage);
    }

    _activeStage () {
        this.setState({
            isStageActive: true
        });

        this._selectItem(this.state.activeItem);
    }

    _deactiveStage () {
        this.setState({
            isStageActive: false
        })
    }

    _selectStage (stages, index) {
        if (stages[index]) {
            this._deactiveStage();
            this._focusOn(ReactDOM.findDOMNode(stages[index]));
        }
    }

    selectPreviousItem (count = 0) {
        let refs = this.__objectToArray(this.refs),
            jumpTo = this.state.activeItem - count,
            activeItem = (jumpTo > count) ? jumpTo : this.state.activeItem,
            previous = refs.indexOf(refs[activeItem].previousSibling)
        ;

        if (previous < 0) {
            previous = 0;
        }

        if (this.state.positionLeft < 0) {
            this.setState({
                positionLeft: this.state.positionLeft + this.props.itemWidth
            });
        }

        this._selectItem(previous);
    }

    selectNextItem (count = 0) {
        let refs = this.__objectToArray(this.refs),
            jumpTo = this.state.activeItem + count,
            activeItem = (jumpTo < (refs.length - 1)) ? jumpTo : this.state.activeItem,
            next = refs.indexOf(refs[activeItem].nextSibling)
        ;

        if (next < 0) {
            next = refs.length - 1;
        }

        if (((this.state.positionLeft * -1) / this.props.itemWidth) <= (refs.length - this.props.maxVisible)) {
            this.setState({
                positionLeft: this.state.positionLeft - this.props.itemWidth
            });
        }

        this._selectItem(next);
    }

    selectPreviousStage () {
        let
            previousIndex = parseInt(this.state.stageIndex - 1, 10),
            stages = this.__filterStagesWithChildren(this.props.stages)
        ;

        if (this.props.beforeSelectPreviousStage) {
            this.props.beforeSelectPreviousStage();
        }

        this._selectStage(stages, previousIndex);
    }

    selectNextStage () {
        let
            nextIndex = parseInt(this.state.stageIndex + 1, 10),
            stages = this.__filterStagesWithChildren(this.props.stages)
        ;

        if (this.props.beforeSelectNextStage) {
            this.props.beforeSelectNextStage();
        }

        this._selectStage(stages, nextIndex);
    }

    onItemFocus (e) {
        let
            parent = e.target.parentNode,
            itemIndex = this.__objectToArray(parent.childNodes).indexOf(e.target)
        ;

        this._saveActiveItem(itemIndex);
    }

    onStageFocus (e) {
        if (e.target.tagName !== 'A') {
            this._activeStage();
        }
    }

    componentDidMount () {
        this._registerStage();
    }

    componentWillUnmount () {
        this._removeStage();
    }

    componentWillReceiveProps (nextProps) {
        if (this.props !== nextProps) {
            this._updateStageIndex(this.props.stages.filter((object) => {
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

        let style = {
            ...this._moveStageHorizontally(this.state.positionLeft)
        };

        return (
            <div
                className={"navigation" + (this.state.isStageActive ? ' active' : '')}
                onFocus={this.onStageFocus.bind(this)}>
                <HotKeys
                    ref={(stage) => { this.stage = stage; }}
                    keyMap={map}
                    handlers={handlers}
                    className="navigation-stage"
                    style={style}>
                    {
                        React.Children.map(this.props.children, (element, index) => {
                            return React.cloneElement(element, {
                                ref: index,
                                onMouseOver: this.onItemFocus.bind(this),
                                onFocus: this.onItemFocus.bind(this)
                            });
                        })
                    }
                </HotKeys>
                { this.state.isStageActive && !this.props.noButtonLeft ? (
                    <button
                        className="button l"
                        onClick={() => this.selectPreviousItem(7)}>
                        &larr;
                    </button>
                ) : null }
                { this.state.isStageActive && !this.props.noButtonRight ? (
                    <button
                        className="button r"
                        onClick={() => this.selectNextItem(7)}>
                        &rarr;
                    </button>
                ) : null }
                { this.state.isStageActive && !this.props.noButtonUp ? (
                    <button
                        className="button u"
                        onClick={this.selectPreviousStage.bind(this)}>
                        &uarr;
                    </button>
                ) : null }
                { this.state.isStageActive && !this.props.noButtonDown ? (
                    <button
                        className="button d"
                        onClick={this.selectNextStage.bind(this)}>
                        &darr;
                    </button>
                ) : null }
            </div>
        );
    }
}

function mapStateToProps (state) {
    return {
        stages: state.payload
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({ registerStage, removeStage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
