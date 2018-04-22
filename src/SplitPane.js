import React, { Component, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

import glamorous from 'glamorous';
import Resizer from './Resizer';
import Pane from './Pane';

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

// todo: move utils fn to separate file
function convert (str, size) {
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

function getUnit(size) {
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

class SplitPane extends Component {
  constructor(props) {
    super(props);

    const sizes = this.getPaneProp("initialSize", props);

    this.state = {
      sizes
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({sizes: this.getPaneProp("initialSize", nextProps)});
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
    // document.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('resize', this.resize);
  }

  onMouseDown = (event, resizerIndex) => {
    this.onDown(resizerIndex);
  }

  onTouchStart = (event, resizerIndex) => {
    this.onDown(resizerIndex);
  }

  onDown = (resizerIndex) => {
    const {allowResize, onResizeStart} = this.props;

    if (!allowResize) {
      return;
    }

    this.dimensions = this.getPaneDimensions();

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);

    if (onResizeStart) {
      onResizeStart(resizerIndex);
    }

    this.setState({
      resizerIndex,
    });
  }

  onMouseMove = (e) => {
    e.stopPropagation();
    e.preventDefault();

    this.onMove(e.clientX, e.clientY);
  }

  onTouchMove = (event) => {
    e.stopPropagation();
    e.preventDefault();
    this.onMove(event.touches[0].clientX, event.touches[0].clientY);
  }

  onMouseUp = () => {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);

    if (this.props.onResizeEnd) {
      this.props.onResizeEnd();
    }
  }

  getPaneProp(key, props) {
    return React.Children.map(props.children, c => c.props[key]);
  }

  getPaneDimensions() {
    return this.paneElements.map(el => findDOMNode(el).getBoundingClientRect());
  }

  getResizerDimensions() {
    return this.resizerElements.map(el => findDOMNode(el).getBoundingClientRect())
  }

  onMove(clientX, clientY) {
    const { split, resizerSize, onChange } = this.props;
    const { resizerIndex } = this.state;
    const minSizes = this.getPaneProp('minSize', this.props);
    const maxSizes = this.getPaneProp('maxSize', this.props);
    const dimensions = this.dimensions;
    
    const sizesPx = dimensions.map(d => split === "vertical" ? d.width : d.height);
    
    const splitPaneDimensions = findDOMNode(this.splitPane).getBoundingClientRect();
    const resizerDimensions = this.getResizerDimensions()[resizerIndex];

    let sizes = this.state.sizes.concat();
    
    const primaryUnit = getUnit(sizes[resizerIndex]);
    const secondaryUnit = getUnit(sizes[resizerIndex + 1]);
    const primary = dimensions[resizerIndex];
    const secondary = dimensions[resizerIndex + 1];

    if (
      (split === 'vertical' &&
        clientX >= primary.left &&
        clientX <= secondary.right) ||
      (split !== 'vertical' &&
        clientY >= primary.top &&
        clientY <= secondary.bottom)
    ) {
      let primarySize;
      let secondarySize;
      let splitPaneSize;

      if (split === 'vertical') {
        const resizerLeft = clientX - (resizerSize / 2);
        const resizerRight = clientX + (resizerSize / 2);

        primarySize = resizerLeft - primary.left;
        secondarySize = secondary.right - resizerRight;
        splitPaneSize = splitPaneDimensions.width;
      } else {
        const resizerTop = clientY - (resizerSize / 2);
        const resizerBottom = clientY + (resizerSize / 2);

        primarySize = resizerTop - primary.top;
        secondarySize = secondary.bottom - resizerBottom;
        splitPaneSize = splitPaneDimensions.height;
      }

      const primaryMinSize = convert(minSizes[resizerIndex], splitPaneSize);
      const secondaryMinSize = convert(minSizes[resizerIndex + 1], splitPaneSize);

      const primaryMaxSize = convert(maxSizes[resizerIndex], splitPaneSize);
      const secondaryMaxSize = convert(maxSizes[resizerIndex + 1], splitPaneSize);

      if (
        primaryMinSize <= primarySize &&
        primaryMaxSize >= primarySize &&
        secondaryMinSize <= secondarySize &&
        secondaryMaxSize >= secondarySize
      ) {
        sizesPx[resizerIndex] = primarySize;
        sizesPx[resizerIndex + 1] = secondarySize;

        let updateRatio;

        if (primaryUnit !== "ratio") {
          sizes[resizerIndex] = this.convertUnits(primarySize, primaryUnit, splitPaneSize);
        } else {
          updateRatio = true;
        }

        if (secondaryUnit !== "ratio") {
          sizes[resizerIndex + 1] = this.convertUnits(secondarySize, secondaryUnit, splitPaneSize);
        } else {
          updateRatio = true;
        }

        if (updateRatio) {
          const ratioIdx = sizes.map((s, idx) => getUnit(s) === "ratio" ? idx : -1).filter(idx => idx >= 0);
          let ratio = ratioIdx.length === 1 ? [1] : ratioIdx.map(i => sizesPx[i]);

          ratioIdx.forEach((i, idx) => sizes[i] = ratio[idx]);
        }

        this.setState({sizes});

        if (onChange) {
          onChange(sizes);
        }
      }
    }
  }

  convertUnits(size, unit, containerSize) {
    switch(unit) {
      case "%":
        return `${size/containerSize*100}%`;
      case "px":
        return `${size}px`;
      case "ratio":
        return size;
    }
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
    const { ratios, sizes } = this.state;

    let paneIndex = 0;
    let resizerIndex = 0;

    const elements = children.reduce((acc, child) => {
      // const size = sizes[paneIndex] ? sizes[paneIndex] : 0;
      let pane;
      const isPane = child.type === Pane;
      const paneProps = {
        index: paneIndex,
        'data-type': 'Pane',
        // size: size,
        split: split,
        key: `Pane-${paneIndex}`,
        ref: this.setPaneRef.bind(null, paneIndex)
      };
      if (isPane) {
        pane = cloneElement(child, paneProps);
      } else {
        pane = <Pane {...paneProps}>{child}</Pane>;
      }
      paneIndex++;
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
            // onTouchStart={this.onTouchStart}
            // onTouchEnd={this.onMouseUp}
          />
        );
        resizerIndex++;
        return [...acc, resizer, pane];
      }
    }, []);

    if (split === 'vertical') {
      return (
        <RowStyle
          className={className}
          data-type="SplitPane"
          data-split={split}
          ref={splitPane => (this.splitPane = splitPane)}
        >
          {elements}
        </RowStyle>
      );
    } else {
      return (
        <ColumnStyle
          className={className}
          data-type="SplitPane"
          data-split={split}
          ref={splitPane => (this.splitPane = splitPane)}
        >
          {elements}
        </ColumnStyle>
      );
    }
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
