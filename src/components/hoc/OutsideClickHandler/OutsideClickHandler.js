import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class OutsideClickHandler extends Component {
    constructor(props) {
        super(props);

        this.wrapperRef = React.createRef();
        this.handlerIsActive = true;
        // this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    componentWillUpdate() {
        console.log(this.props.showPenMenu);
        if (this.props.showPenMenu) {
            document.removeEventListener('mousedown', this.handleClickOutside);
            this.handlerIsActive = false;
        } else if (!this.handlerIsActive) {
            document.addEventListener('mousedown', this.handleClickOutside);
        }
    }
    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            console.log("close modal")
            this.props.handler();
        }
    }

    render() {
        return <div ref={this.wrapperRef}>{this.props.children}</div>;
    }
}

OutsideClickHandler.propTypes = {
    children: PropTypes.element.isRequired,
    handler: PropTypes.func.isRequired,
};