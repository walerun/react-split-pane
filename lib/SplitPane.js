'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getUnit = getUnit;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _glamorous = require('glamorous');

var _glamorous2 = _interopRequireDefault(_glamorous);

var _Resizer = require('./Resizer');

var _Resizer2 = _interopRequireDefault(_Resizer);

var _Pane = require('./Pane');

var _Pane2 = _interopRequireDefault(_Pane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_PANE_SIZE = "1";
var DEFAULT_PANE_MIN_SIZE = "0";
var DEFAULT_PANE_MAX_SIZE = "100%";

var ColumnStyle = _glamorous2.default.div({
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  flex: 1,
  outline: 'none',
  overflow: 'hidden',
  userSelect: 'text',

  minHeight: '100%',
  width: '100%'
});

var RowStyle = _glamorous2.default.div({
  display: 'flex',
  height: '100%',
  flexDirection: 'row',
  flex: 1,
  outline: 'none',
  overflow: 'hidden',
  userSelect: 'text'

});

function convert(str, size) {
  var tokens = str.match(/([0-9]+)([px|%]*)/);
  var value = tokens[1];
  var unit = tokens[2];
  return toPx(value, unit, size);
}

function toPx(value) {
  var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'px';
  var size = arguments[2];

  switch (unit) {
    case '%':
      {
        return (size * value / 100).toFixed(2);
      }
    default:
      {
        return +value;
      }
  }
}

function getUnit(size) {
  if (typeof size === "number") {
    return "ratio";
  }

  if (size.endsWith("px")) {
    return "px";
  }

  if (size.endsWith("%")) {
    return "%";
  }

  return "ratio";
}

function convertUnits(size, unit, containerSize) {
  switch (unit) {
    case "%":
      return (size / containerSize * 100).toFixed(2) + '%';
    case "px":
      return size.toFixed(2) + 'px';
    case "ratio":
      return size.toFixed(2) * 100;
  }
}

var SplitPane = function (_Component) {
  _inherits(SplitPane, _Component);

  function SplitPane(props) {
    _classCallCheck(this, SplitPane);

    var _this = _possibleConstructorReturn(this, (SplitPane.__proto__ || Object.getPrototypeOf(SplitPane)).call(this, props));

    _this.onMouseDown = function (event, resizerIndex) {
      if (event.button !== 0) {
        return;
      }

      event.preventDefault();

      _this.onDown(resizerIndex);
    };

    _this.onTouchStart = function (event, resizerIndex) {
      event.preventDefault();

      _this.onDown(resizerIndex);
    };

    _this.onDown = function (resizerIndex) {
      var _this$props = _this.props,
          allowResize = _this$props.allowResize,
          onResizeStart = _this$props.onResizeStart;


      if (!allowResize) {
        return;
      }

      _this.dimensions = _this.getPaneDimensions();
      _this.container = (0, _reactDom.findDOMNode)(_this.splitPane).getBoundingClientRect();
      _this.resizerIndex = resizerIndex;

      document.addEventListener('mousemove', _this.onMouseMove);
      document.addEventListener('mouseup', _this.onMouseUp);

      document.addEventListener('touchmove', _this.onTouchMove);
      document.addEventListener('touchend', _this.onMouseUp);
      // document.addEventListener('touchcancel', this.onMouseUp);

      if (onResizeStart) {
        onResizeStart(resizerIndex);
      }
    };

    _this.onMouseMove = function (event) {
      event.preventDefault();

      _this.onMove(event.clientX, event.clientY);
    };

    _this.onTouchMove = function (event) {
      event.preventDefault();

      var _event$touches$ = event.touches[0],
          clientX = _event$touches$.clientX,
          clientY = _event$touches$.clientY;


      _this.onMove(clientX, clientY);
    };

    _this.onMouseUp = function (event) {
      event.preventDefault();

      document.removeEventListener('mouseup', _this.onMouseUp);
      document.removeEventListener('mousemove', _this.onMouseMove);

      document.removeEventListener('touchmove', _this.onTouchMove);
      document.removeEventListener('touchend', _this.onMouseUp);

      if (_this.props.onResizeEnd) {
        _this.props.onResizeEnd();
      }
    };

    _this.setPaneRef = function (idx, el) {
      if (!_this.paneElements) {
        _this.paneElements = [];
      }

      _this.paneElements[idx] = el;
    };

    _this.setResizerRef = function (idx, el) {
      if (!_this.resizerElements) {
        _this.resizerElements = [];
      }

      _this.resizerElements[idx] = el;
    };

    _this.state = {
      sizes: _this.getPanePropSize(props)
    };
    return _this;
  }

  _createClass(SplitPane, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ sizes: this.getPanePropSize(nextProps) });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mouseup', this.onMouseUp);
      document.removeEventListener('mousemove', this.onMouseMove);

      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onMouseUp);
    }
  }, {
    key: 'getPanePropSize',
    value: function getPanePropSize(props) {
      return _react2.default.Children.map(props.children, function (child) {
        var value = child.props["size"] || child.props["initialSize"];
        if (value === undefined) {
          return DEFAULT_PANE_SIZE;
        }

        return String(value);
      });
    }
  }, {
    key: 'getPanePropMinMaxSize',
    value: function getPanePropMinMaxSize(props, key) {
      return _react2.default.Children.map(props.children, function (child) {
        var value = child.props[key];
        if (value === undefined) {
          return key === "maxSize" ? DEFAULT_PANE_MAX_SIZE : DEFAULT_PANE_MIN_SIZE;
        }

        return value;
      });
    }
  }, {
    key: 'getPaneDimensions',
    value: function getPaneDimensions() {
      return this.paneElements.map(function (el) {
        return (0, _reactDom.findDOMNode)(el).getBoundingClientRect();
      });
    }
  }, {
    key: 'getResizerDimensions',
    value: function getResizerDimensions() {
      return this.resizerElements.map(function (el) {
        return (0, _reactDom.findDOMNode)(el).getBoundingClientRect();
      });
    }
  }, {
    key: 'getSizes',
    value: function getSizes() {
      return this.state.sizes;
    }
  }, {
    key: 'onMove',
    value: function onMove(clientX, clientY) {
      var _props = this.props,
          split = _props.split,
          resizerSize = _props.resizerSize,
          onChange = _props.onChange;

      var minSizes = this.getPanePropMinMaxSize(this.props, 'minSize');
      var maxSizes = this.getPanePropMinMaxSize(this.props, 'maxSize');
      var resizerIndex = this.resizerIndex;
      var dimensions = this.dimensions;
      var splitPaneDimensions = this.container;
      var sizesPx = dimensions.map(function (d) {
        return split === "vertical" ? d.width : d.height;
      });

      var primary = dimensions[resizerIndex];
      var secondary = dimensions[resizerIndex + 1];

      if (split === 'vertical' && (clientX < primary.left || clientX > secondary.right) || split !== 'vertical' && (clientY < primary.top || clientY > secondary.bottom)) {
        return;
      }

      var primarySizePx = void 0;
      var secondarySizePx = void 0;
      var splitPaneSizePx = void 0;

      if (split === 'vertical') {
        var resizerLeft = clientX - resizerSize / 2;
        var resizerRight = clientX + resizerSize / 2;

        primarySizePx = resizerLeft - primary.left;
        secondarySizePx = secondary.right - resizerRight;
        splitPaneSizePx = splitPaneDimensions.width;
      } else {
        var resizerTop = clientY - resizerSize / 2;
        var resizerBottom = clientY + resizerSize / 2;

        primarySizePx = resizerTop - primary.top;
        secondarySizePx = secondary.bottom - resizerBottom;
        splitPaneSizePx = splitPaneDimensions.height;
      }

      sizesPx[resizerIndex] = primarySizePx;
      sizesPx[resizerIndex + 1] = secondarySizePx;

      // const sizesPx = [primarySizePx, secondarySizePx];

      var primaryMinSizePx = convert(minSizes[resizerIndex], splitPaneSizePx);
      var secondaryMinSizePx = convert(minSizes[resizerIndex + 1], splitPaneSizePx);

      var primaryMaxSizePx = convert(maxSizes[resizerIndex], splitPaneSizePx);
      var secondaryMaxSizePx = convert(maxSizes[resizerIndex + 1], splitPaneSizePx);

      if (primaryMinSizePx > primarySizePx || primaryMaxSizePx < primarySizePx || secondaryMinSizePx > secondarySizePx || secondaryMaxSizePx < secondarySizePx) {
        return;
      }

      var panesSizes = [primarySizePx, secondarySizePx];
      var sizes = this.getSizes().concat();
      var updateRatio = void 0;

      panesSizes.forEach(function (paneSize, idx) {
        var unit = getUnit(sizes[resizerIndex + idx]);
        if (unit !== "ratio") {
          sizes[resizerIndex + idx] = convertUnits(paneSize, unit, splitPaneSizePx);
        } else {
          updateRatio = true;
        }
      });

      if (updateRatio) {
        var ratioCount = 0;
        var lastRatioIdx = void 0;
        sizes = sizes.map(function (size, idx) {
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
        sizes: sizes
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          split = _props2.split;

      var sizes = this.getSizes();

      var elements = children.reduce(function (acc, child, idx) {
        var pane = void 0;
        var resizerIndex = idx - 1;
        var isPane = child.type === _Pane2.default;
        var paneProps = {
          index: idx,
          'data-type': 'Pane',
          split: split,
          key: 'Pane-' + idx,
          ref: _this2.setPaneRef.bind(null, idx)
        };

        if (sizes) {
          paneProps.size = sizes[idx];
        }

        if (isPane) {
          pane = (0, _react.cloneElement)(child, paneProps);
        } else {
          pane = _react2.default.createElement(
            _Pane2.default,
            paneProps,
            child
          );
        }

        if (acc.length === 0) {
          return [].concat(_toConsumableArray(acc), [pane]);
        } else {
          var resizer = _react2.default.createElement(_Resizer2.default, {
            index: resizerIndex,
            key: 'Resizer-' + resizerIndex,
            ref: _this2.setResizerRef.bind(null, resizerIndex),
            split: split,
            onMouseDown: _this2.onMouseDown,
            onTouchStart: _this2.onTouchStart
          });

          return [].concat(_toConsumableArray(acc), [resizer, pane]);
        }
      }, []);

      var StyleComponent = split === 'vertical' ? RowStyle : ColumnStyle;

      return _react2.default.createElement(
        StyleComponent,
        {
          className: className,
          'data-type': 'SplitPane',
          'data-split': split,
          ref: function ref(splitPane) {
            return _this2.splitPane = splitPane;
          }
        },
        elements
      );
    }
  }]);

  return SplitPane;
}(_react.Component);

SplitPane.propTypes = {
  children: _propTypes2.default.arrayOf(_propTypes2.default.node).isRequired,
  className: _propTypes2.default.string,
  split: _propTypes2.default.oneOf(['vertical', 'horizontal']),
  resizerSize: _propTypes2.default.number,
  onChange: _propTypes2.default.func,
  onResizeStart: _propTypes2.default.func,
  onResizeEnd: _propTypes2.default.func
};

SplitPane.defaultProps = {
  split: 'vertical',
  resizerSize: 1,
  allowResize: true
};

exports.default = SplitPane;