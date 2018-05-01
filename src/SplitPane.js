import React, { Component, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import glamorous from 'glamorous';
import Resizer from './Resizer';
import Pane from './Pane';

const DEFAULT_PANE_SIZE = "1";
const DEFAULT_PANE_MIN_SIZE = "0";
const DEFAULT_PANE_MAX_SIZE = "100%";

const ColumnStyle = glamorous.div({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  flex: 1,
  outline: 'none',
  overflow: 'hidden',
  userSelect: 'text',

  minHeight: '100%',
  width: '100%',
});

const RowStyle = glamorous.div({
  display: 'flex',
  height: '100%',
  flexDirection: 'row',
  flex: 1,
  outline: 'none',
  overflow: 'hidden',
  userSelect: 'text',

});

function convert(str, size) {
  const tokens = str.match(/([0-9]+)([px|%]*)/);
  const value = tokens[1];
  const unit = tokens[2];
  return toPx(value, unit, size);
}

function toPx(value, unit = 'px', size) {
  switch (unit) {
    case '%': {
      return (size * value / 100).toFixed(2);
    }
    default: {
      return +value;
    }
  }
}

export function getUnit(size) {
  if (typeof size === "number") {
    return "ratio";
  }

  if(size.endsWith("px")) {
    return "px";
  }

  if(size.endsWith("%")) {
    return "%";
  }

  return "ratio";
}

function convertUnits(size, unit, containerSize) {
  switch(unit) {
    case "%":
      return `${(size / containerSize * 100).toFixed(2)}%`;
    case "px":
      return `${size.toFixed(2)}px`;
    case "ratio":
      return (size * 100).toFixed(0);
  }
}

class SplitPane extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sizes: this.getPanePropSize(props)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({sizes: this.getPanePropSize(nextProps)});
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);

    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onMouseUp);
  }

  onMouseDown = (event, resizerIndex) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    this.onDown(resizerIndex);
  }

  onTouchStart = (event, resizerIndex) => {
    event.preventDefault();

    this.onDown(resizerIndex);
  }

  onDown = (resizerIndex) => {
    const {allowResize, onResizeStart} = this.props;

    if (!allowResize) {
      return;
    }

    this.dimensions = this.getPaneDimensions();
    this.container = findDOMNode(this.splitPane).getBoundingClientRect();
    this.resizerIndex = resizerIndex;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    document.addEventListener('touchmove', this.onTouchMove);
    document.addEventListener('touchend', this.onMouseUp);
    // document.addEventListener('touchcancel', this.onMouseUp);

    if (onResizeStart) {
      onResizeStart(resizerIndex);
    }
  }

  onMouseMove = (event) => {
    event.preventDefault();

    this.onMove(event.clientX, event.clientY);
  }

  onTouchMove = (event) => {
    event.preventDefault();

    const {clientX, clientY} = event.touches[0];

    this.onMove(clientX, clientY);
  }

  onMouseUp = (event) => {
    event.preventDefault();

    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);

    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onMouseUp);

    if (this.props.onResizeEnd) {
      this.props.onResizeEnd();
    }
  }

  getPanePropSize(props) {
    return React.Children.map(props.children, child => {
      const value = child.props["size"] || child.props["initialSize"];
      if (value === undefined) {
        return DEFAULT_PANE_SIZE;
      }
      
      return String(value);
    });
  }

  getPanePropMinMaxSize(props, key) {
    return React.Children.map(props.children, child => {
      const value = child.props[key];
      if (value === undefined) {
        return key === "maxSize" ? DEFAULT_PANE_MAX_SIZE : DEFAULT_PANE_MIN_SIZE;
      }
      
      return value;
    });
  }

  getPaneDimensions() {
    return this.paneElements.map(el => findDOMNode(el).getBoundingClientRect());
  }

  getResizerDimensions() {
    return this.resizerElements.map(el => findDOMNode(el).getBoundingClientRect())
  }

  getSizes() {
      return this.state.sizes;
  }

  onMove(clientX, clientY) {
    const { split, resizerSize, onChange } = this.props;
    const minSizes = this.getPanePropMinMaxSize(this.props, 'minSize');
    const maxSizes = this.getPanePropMinMaxSize(this.props, 'maxSize');
    const resizerIndex = this.resizerIndex;
    const dimensions = this.dimensions;
    const splitPaneDimensions = this.container;
    const sizesPx = dimensions.map(d => split === "vertical" ? d.width : d.height);

    const primary = dimensions[resizerIndex];
    const secondary = dimensions[resizerIndex + 1];

    if (
      (split === 'vertical' && (clientX < primary.left || clientX > secondary.right)) ||
      (split !== 'vertical' && (clientY < primary.top || clientY > secondary.bottom))
    ) {
      return;
    }

    let primarySizePx;
    let secondarySizePx;
    let splitPaneSizePx;

    if (split === 'vertical') {
      const resizerLeft = clientX - (resizerSize / 2);
      const resizerRight = clientX + (resizerSize / 2);

      primarySizePx = resizerLeft - primary.left;
      secondarySizePx = secondary.right - resizerRight;
      splitPaneSizePx = splitPaneDimensions.width;
    } else {
      const resizerTop = clientY - (resizerSize / 2);
      const resizerBottom = clientY + (resizerSize / 2);

      primarySizePx = resizerTop - primary.top;
      secondarySizePx = secondary.bottom - resizerBottom;
      splitPaneSizePx = splitPaneDimensions.height;
    }

    sizesPx[resizerIndex] = primarySizePx;
    sizesPx[resizerIndex + 1] = secondarySizePx;

    const primaryMinSizePx = convert(minSizes[resizerIndex], splitPaneSizePx);
    const secondaryMinSizePx = convert(minSizes[resizerIndex + 1], splitPaneSizePx);

    const primaryMaxSizePx = convert(maxSizes[resizerIndex], splitPaneSizePx);
    const secondaryMaxSizePx = convert(maxSizes[resizerIndex + 1], splitPaneSizePx);

    if (
      primaryMinSizePx > primarySizePx ||
      primaryMaxSizePx < primarySizePx ||
      secondaryMinSizePx > secondarySizePx ||
      secondaryMaxSizePx < secondarySizePx
    ) {
      return;
    }

    const panesSizes = [primarySizePx, secondarySizePx];
    let sizes = this.getSizes().concat();
    let updateRatio;

    panesSizes.forEach((paneSize, idx) => {
      const unit = getUnit(sizes[resizerIndex + idx]);
      if (unit !== "ratio") {
        sizes[resizerIndex + idx] = convertUnits(paneSize, unit, splitPaneSizePx);
      } else {
        updateRatio = true;
      }
    });

    if (updateRatio) {
      let ratioCount = 0;
      let lastRatioIdx;
      sizes = sizes.map((size, idx) => {
        if (getUnit(size) === "ratio") {
          ratioCount++;
          lastRatioIdx = idx;
          return convertUnits(sizesPx[idx], "ratio");
        }

        return size;
      });

      if (ratioCount === 1) {
        sizes[lastRatioIdx] = 1;
      }
    }

    onChange && onChange(sizes);

    this.setState({
      sizes
    });
  }

  setPaneRef = (idx, el) => {
    if (!this.paneElements) {
      this.paneElements = [];
    }

    this.paneElements[idx] = el;
  }

  setResizerRef = (idx, el) => {
    if (!this.resizerElements) {
      this.resizerElements = [];
    }

    this.resizerElements[idx] = el;
  }

  render() {
    const { children, className, split } = this.props;
    const sizes = this.getSizes();

    const elements = children.reduce((acc, child, idx) => {
      let pane;
      const resizerIndex = idx - 1;
      const isPane = child.type === Pane;
      const paneProps = {
        index: idx,
        'data-type': 'Pane',
        split: split,
        key: `Pane-${idx}`,
        ref: this.setPaneRef.bind(null, idx)
      };

      if (sizes) {
        paneProps.size = sizes[idx];
      }

      if (isPane) {
        pane = cloneElement(child, paneProps);
      } else {
        pane = <Pane {...paneProps}>{child}</Pane>;
      }

      if (acc.length === 0) {
        return [...acc, pane];
      } else {
        const resizer = (
          <Resizer
            index={resizerIndex}
            key={`Resizer-${resizerIndex}`}
            ref={this.setResizerRef.bind(null, resizerIndex)}
            split={split}
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onTouchStart}
          />
        );

        return [...acc, resizer, pane];
      }
    }, []);

    const StyleComponent = split === 'vertical' ? RowStyle : ColumnStyle;

    return (
      <StyleComponent
        className={className}
        data-type="SplitPane"
        data-split={split}
        ref={splitPane => (this.splitPane = splitPane)}
      >
        {elements}
      </StyleComponent>
    );
  }
}

SplitPane.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  className: PropTypes.string,
  split: PropTypes.oneOf(['vertical', 'horizontal']),
  resizerSize: PropTypes.number,
  onChange: PropTypes.func,
  onResizeStart: PropTypes.func,
  onResizeEnd: PropTypes.func,
};

SplitPane.defaultProps = {
  split: 'vertical',
  resizerSize: 1,
  allowResize: true
};

export default SplitPane;
