import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import prefixAll from 'inline-style-prefixer/static';

const RowPx = ({ useInitial, initialSize, size, minSize, maxSize }) => ({
  width: useInitial && initialSize ? initialSize : size + 'px',
  minWidth: minSize,
  maxWidth: maxSize,
  outline: 'none',
});

const ColumnPx = ({ useInitial, initialSize, size, minSize, maxSize }) => ({
  height: useInitial && initialSize ? initialSize : size + 'px',
  minHeight: minSize,
  maxHeight: maxSize,
  outline: 'none',
});

const RowFlex = ({ initialSize, minSize, maxSize }) => {

  const style = {
    // flex: initialSize,
    minWidth: minSize,
    maxWidth: maxSize,
    display: 'flex',
    outline: 'none',
    position: 'relative'
  };

  if (typeof initialSize === "number") {
    style.flex = initialSize;
  } else {
    style.flexGrow = 0;
    style.width = initialSize;
  }

  return style;
};

const ColumnFlex = ({ initialSize, minSize, maxSize }) => {
  const style = {
    minHeight: minSize,
    maxHeight: maxSize,
    display: 'flex',
    outline: 'none',
    flexShrink: 1,
    position: 'relative'
  };

  if (typeof initialSize === "number") {
    style.flex = initialSize;
  } else {
    style.flexGrow = 0;
    style.height = initialSize;
  }

  return style;
};


class Pane extends PureComponent {
  render() {
    const {
      children,
      className,
      resized,
      split,
      useInitial,
      initialSize,
    } = this.props;

    let prefixedStyle;

    if (split === 'vertical') {
      prefixedStyle = prefixAll(RowFlex(this.props));
    } else {
      prefixedStyle = prefixAll(ColumnFlex(this.props));
    }

    return (
      <div className={className} style={prefixedStyle}>
        {children}
      </div>
    );
  }
}

Pane.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  initialSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minSize: PropTypes.string,
  maxSize: PropTypes.string,
};

Pane.defaultProps = {
  initialSize: 1,
  split: 'vertical',
  minSize: '0px',
  maxSize: '100%',
};

export default Pane;
