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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TcGxpdFBhbmUuanMiXSwibmFtZXMiOlsiZ2V0VW5pdCIsIkRFRkFVTFRfUEFORV9TSVpFIiwiREVGQVVMVF9QQU5FX01JTl9TSVpFIiwiREVGQVVMVF9QQU5FX01BWF9TSVpFIiwiQ29sdW1uU3R5bGUiLCJkaXYiLCJkaXNwbGF5IiwiaGVpZ2h0IiwiZmxleERpcmVjdGlvbiIsImZsZXgiLCJvdXRsaW5lIiwib3ZlcmZsb3ciLCJ1c2VyU2VsZWN0IiwibWluSGVpZ2h0Iiwid2lkdGgiLCJSb3dTdHlsZSIsImNvbnZlcnQiLCJzdHIiLCJzaXplIiwidG9rZW5zIiwibWF0Y2giLCJ2YWx1ZSIsInVuaXQiLCJ0b1B4IiwidG9GaXhlZCIsImVuZHNXaXRoIiwiY29udmVydFVuaXRzIiwiY29udGFpbmVyU2l6ZSIsIlNwbGl0UGFuZSIsInByb3BzIiwib25Nb3VzZURvd24iLCJldmVudCIsInJlc2l6ZXJJbmRleCIsImJ1dHRvbiIsInByZXZlbnREZWZhdWx0Iiwib25Eb3duIiwib25Ub3VjaFN0YXJ0IiwiYWxsb3dSZXNpemUiLCJvblJlc2l6ZVN0YXJ0IiwiZGltZW5zaW9ucyIsImdldFBhbmVEaW1lbnNpb25zIiwiY29udGFpbmVyIiwic3BsaXRQYW5lIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJvblRvdWNoTW92ZSIsIm9uTW92ZSIsImNsaWVudFgiLCJjbGllbnRZIiwidG91Y2hlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblJlc2l6ZUVuZCIsInNldFBhbmVSZWYiLCJpZHgiLCJlbCIsInBhbmVFbGVtZW50cyIsInNldFJlc2l6ZXJSZWYiLCJyZXNpemVyRWxlbWVudHMiLCJzdGF0ZSIsInNpemVzIiwiZ2V0UGFuZVByb3BTaXplIiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJDaGlsZHJlbiIsIm1hcCIsImNoaWxkcmVuIiwiY2hpbGQiLCJ1bmRlZmluZWQiLCJTdHJpbmciLCJrZXkiLCJzcGxpdCIsInJlc2l6ZXJTaXplIiwib25DaGFuZ2UiLCJtaW5TaXplcyIsImdldFBhbmVQcm9wTWluTWF4U2l6ZSIsIm1heFNpemVzIiwic3BsaXRQYW5lRGltZW5zaW9ucyIsInNpemVzUHgiLCJkIiwicHJpbWFyeSIsInNlY29uZGFyeSIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsInByaW1hcnlTaXplUHgiLCJzZWNvbmRhcnlTaXplUHgiLCJzcGxpdFBhbmVTaXplUHgiLCJyZXNpemVyTGVmdCIsInJlc2l6ZXJSaWdodCIsInJlc2l6ZXJUb3AiLCJyZXNpemVyQm90dG9tIiwicHJpbWFyeU1pblNpemVQeCIsInNlY29uZGFyeU1pblNpemVQeCIsInByaW1hcnlNYXhTaXplUHgiLCJzZWNvbmRhcnlNYXhTaXplUHgiLCJwYW5lc1NpemVzIiwiZ2V0U2l6ZXMiLCJjb25jYXQiLCJ1cGRhdGVSYXRpbyIsImZvckVhY2giLCJwYW5lU2l6ZSIsInJhdGlvQ291bnQiLCJsYXN0UmF0aW9JZHgiLCJjbGFzc05hbWUiLCJlbGVtZW50cyIsInJlZHVjZSIsImFjYyIsInBhbmUiLCJpc1BhbmUiLCJ0eXBlIiwicGFuZVByb3BzIiwiaW5kZXgiLCJyZWYiLCJiaW5kIiwibGVuZ3RoIiwicmVzaXplciIsIlN0eWxlQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiYXJyYXlPZiIsIm5vZGUiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwib25lT2YiLCJudW1iZXIiLCJmdW5jIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQXNEZ0JBLE8sR0FBQUEsTzs7QUF0RGhCOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUMsb0JBQW9CLEdBQTFCO0FBQ0EsSUFBTUMsd0JBQXdCLEdBQTlCO0FBQ0EsSUFBTUMsd0JBQXdCLE1BQTlCOztBQUVBLElBQU1DLGNBQWMsb0JBQVVDLEdB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QSxtQkFBYyxPQUFLL0IsU0FBTCxHQUFpQkEsU0FBL0I7QUFBQTtBQUpQO0FBTUdrRTtBQU5ILE9BREY7QUFVRDs7Ozs7O0FBR0hoRixVQUFVNkYsU0FBVixHQUFzQjtBQUNwQnJELFlBQVUsb0JBQVVzRCxPQUFWLENBQWtCLG9CQUFVQyxJQUE1QixFQUFrQ0MsVUFEeEI7QUFFcEJqQixhQUFXLG9CQUFVa0IsTUFGRDtBQUdwQnBELFNBQU8sb0JBQVVxRCxLQUFWLENBQWdCLENBQUMsVUFBRCxFQUFhLFlBQWIsQ0FBaEIsQ0FIYTtBQUlwQnBELGVBQWEsb0JBQVVxRCxNQUpIO0FBS3BCcEQsWUFBVSxvQkFBVXFELElBTEE7QUFNcEIxRixpQkFBZSxvQkFBVTBGLElBTkw7QUFPcEIxRSxlQUFhLG9CQUFVMEU7QUFQSCxDQUF0Qjs7QUFVQXBHLFVBQVVxRyxZQUFWLEdBQXlCO0FBQ3ZCeEQsU0FBTyxVQURnQjtBQUV2QkMsZUFBYSxDQUZVO0FBR3ZCckMsZUFBYTtBQUhVLENBQXpCOztrQkFNZVQsUyIsImZpbGUiOiJTcGxpdFBhbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjbG9uZUVsZW1lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBmaW5kRE9NTm9kZSB9IGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgZ2xhbW9yb3VzIGZyb20gJ2dsYW1vcm91cyc7XG5pbXBvcnQgUmVzaXplciBmcm9tICcuL1Jlc2l6ZXInO1xuaW1wb3J0IFBhbmUgZnJvbSAnLi9QYW5lJztcblxuY29uc3QgREVGQVVMVF9QQU5FX1NJWkUgPSBcIjFcIjtcbmNvbnN0IERFRkFVTFRfUEFORV9NSU5fU0laRSA9IFwiMFwiO1xuY29uc3QgREVGQVVMVF9QQU5FX01BWF9TSVpFID0gXCIxMDAlXCI7XG5cbmNvbnN0IENvbHVtblN0eWxlID0gZ2xhbW9yb3VzLmRpdih7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICBmbGV4OiAxLFxuICBvdXRsaW5lOiAnbm9uZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdXNlclNlbGVjdDogJ3RleHQnLFxuXG4gIG1pbkhlaWdodDogJzEwMCUnLFxuICB3aWR0aDogJzEwMCUnLFxufSk7XG5cbmNvbnN0IFJvd1N0eWxlID0gZ2xhbW9yb3VzLmRpdih7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICBmbGV4OiAxLFxuICBvdXRsaW5lOiAnbm9uZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdXNlclNlbGVjdDogJ3RleHQnLFxuXG59KTtcblxuZnVuY3Rpb24gY29udmVydChzdHIsIHNpemUpIHtcbiAgY29uc3QgdG9rZW5zID0gc3RyLm1hdGNoKC8oWzAtOV0rKShbcHh8JV0qKS8pO1xuICBjb25zdCB2YWx1ZSA9IHRva2Vuc1sxXTtcbiAgY29uc3QgdW5pdCA9IHRva2Vuc1syXTtcbiAgcmV0dXJuIHRvUHgodmFsdWUsIHVuaXQsIHNpemUpO1xufVxuXG5mdW5jdGlvbiB0b1B4KHZhbHVlLCB1bml0ID0gJ3B4Jywgc2l6ZSkge1xuICBzd2l0Y2ggKHVuaXQpIHtcbiAgICBjYXNlICclJzoge1xuICAgICAgcmV0dXJuIChzaXplICogdmFsdWUgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHJldHVybiArdmFsdWU7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVbml0KHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0dXJuIFwicmF0aW9cIjtcbiAgfVxuXG4gIGlmKHNpemUuZW5kc1dpdGgoXCJweFwiKSkge1xuICAgIHJldHVybiBcInB4XCI7XG4gIH1cblxuICBpZihzaXplLmVuZHNXaXRoKFwiJVwiKSkge1xuICAgIHJldHVybiBcIiVcIjtcbiAgfVxuXG4gIHJldHVybiBcInJhdGlvXCI7XG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRVbml0cyhzaXplLCB1bml0LCBjb250YWluZXJTaXplKSB7XG4gIHN3aXRjaCh1bml0KSB7XG4gICAgY2FzZSBcIiVcIjpcbiAgICAgIHJldHVybiBgJHsoc2l6ZSAvIGNvbnRhaW5lclNpemUgKiAxMDApLnRvRml4ZWQoMil9JWA7XG4gICAgY2FzZSBcInB4XCI6XG4gICAgICByZXR1cm4gYCR7c2l6ZS50b0ZpeGVkKDIpfXB4YDtcbiAgICBjYXNlIFwicmF0aW9cIjpcbiAgICAgIHJldHVybiBzaXplLnRvRml4ZWQoMikgKiAxMDA7XG4gIH1cbn1cblxuY2xhc3MgU3BsaXRQYW5lIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2l6ZXM6IHRoaXMuZ2V0UGFuZVByb3BTaXplKHByb3BzKVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIHRoaXMuc2V0U3RhdGUoe3NpemVzOiB0aGlzLmdldFBhbmVQcm9wU2l6ZShuZXh0UHJvcHMpfSk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXApO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uTW91c2VVcCk7XG4gIH1cblxuICBvbk1vdXNlRG93biA9IChldmVudCwgcmVzaXplckluZGV4KSA9PiB7XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB0aGlzLm9uRG93bihyZXNpemVySW5kZXgpO1xuICB9XG5cbiAgb25Ub3VjaFN0YXJ0ID0gKGV2ZW50LCByZXNpemVySW5kZXgpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5vbkRvd24ocmVzaXplckluZGV4KTtcbiAgfVxuXG4gIG9uRG93biA9IChyZXNpemVySW5kZXgpID0+IHtcbiAgICBjb25zdCB7YWxsb3dSZXNpemUsIG9uUmVzaXplU3RhcnR9ID0gdGhpcy5wcm9wcztcblxuICAgIGlmICghYWxsb3dSZXNpemUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLmdldFBhbmVEaW1lbnNpb25zKCk7XG4gICAgdGhpcy5jb250YWluZXIgPSBmaW5kRE9NTm9kZSh0aGlzLnNwbGl0UGFuZSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdGhpcy5yZXNpemVySW5kZXggPSByZXNpemVySW5kZXg7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXApO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLm9uTW91c2VVcCk7XG5cbiAgICBpZiAob25SZXNpemVTdGFydCkge1xuICAgICAgb25SZXNpemVTdGFydChyZXNpemVySW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIG9uTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHRoaXMub25Nb3ZlKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICB9XG5cbiAgb25Ub3VjaE1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3Qge2NsaWVudFgsIGNsaWVudFl9ID0gZXZlbnQudG91Y2hlc1swXTtcblxuICAgIHRoaXMub25Nb3ZlKGNsaWVudFgsIGNsaWVudFkpO1xuICB9XG5cbiAgb25Nb3VzZVVwID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG5cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Nb3VzZVVwKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uUmVzaXplRW5kKSB7XG4gICAgICB0aGlzLnByb3BzLm9uUmVzaXplRW5kKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFuZVByb3BTaXplKHByb3BzKSB7XG4gICAgcmV0dXJuIFJlYWN0LkNoaWxkcmVuLm1hcChwcm9wcy5jaGlsZHJlbiwgY2hpbGQgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBjaGlsZC5wcm9wc1tcInNpemVcIl0gfHwgY2hpbGQucHJvcHNbXCJpbml0aWFsU2l6ZVwiXTtcbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBERUZBVUxUX1BBTkVfU0laRTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIFN0cmluZyh2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRQYW5lUHJvcE1pbk1heFNpemUocHJvcHMsIGtleSkge1xuICAgIHJldHVybiBSZWFjdC5DaGlsZHJlbi5tYXAocHJvcHMuY2hpbGRyZW4sIGNoaWxkID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY2hpbGQucHJvcHNba2V5XTtcbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBrZXkgPT09IFwibWF4U2l6ZVwiID8gREVGQVVMVF9QQU5FX01BWF9TSVpFIDogREVGQVVMVF9QQU5FX01JTl9TSVpFO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICBnZXRQYW5lRGltZW5zaW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lRWxlbWVudHMubWFwKGVsID0+IGZpbmRET01Ob2RlKGVsKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gIH1cblxuICBnZXRSZXNpemVyRGltZW5zaW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNpemVyRWxlbWVudHMubWFwKGVsID0+IGZpbmRET01Ob2RlKGVsKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSlcbiAgfVxuXG4gIGdldFNpemVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuc2l6ZXM7XG4gIH1cblxuICBvbk1vdmUoY2xpZW50WCwgY2xpZW50WSkge1xuICAgIGNvbnN0IHsgc3BsaXQsIHJlc2l6ZXJTaXplLCBvbkNoYW5nZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBtaW5TaXplcyA9IHRoaXMuZ2V0UGFuZVByb3BNaW5NYXhTaXplKHRoaXMucHJvcHMsICdtaW5TaXplJyk7XG4gICAgY29uc3QgbWF4U2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wTWluTWF4U2l6ZSh0aGlzLnByb3BzLCAnbWF4U2l6ZScpO1xuICAgIGNvbnN0IHJlc2l6ZXJJbmRleCA9IHRoaXMucmVzaXplckluZGV4O1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB0aGlzLmRpbWVuc2lvbnM7XG4gICAgY29uc3Qgc3BsaXRQYW5lRGltZW5zaW9ucyA9IHRoaXMuY29udGFpbmVyO1xuICAgIGNvbnN0IHNpemVzUHggPSBkaW1lbnNpb25zLm1hcChkID0+IHNwbGl0ID09PSBcInZlcnRpY2FsXCIgPyBkLndpZHRoIDogZC5oZWlnaHQpO1xuXG4gICAgY29uc3QgcHJpbWFyeSA9IGRpbWVuc2lvbnNbcmVzaXplckluZGV4XTtcbiAgICBjb25zdCBzZWNvbmRhcnkgPSBkaW1lbnNpb25zW3Jlc2l6ZXJJbmRleCArIDFdO1xuXG4gICAgaWYgKFxuICAgICAgKHNwbGl0ID09PSAndmVydGljYWwnICYmIChjbGllbnRYIDwgcHJpbWFyeS5sZWZ0IHx8IGNsaWVudFggPiBzZWNvbmRhcnkucmlnaHQpKSB8fFxuICAgICAgKHNwbGl0ICE9PSAndmVydGljYWwnICYmIChjbGllbnRZIDwgcHJpbWFyeS50b3AgfHwgY2xpZW50WSA+IHNlY29uZGFyeS5ib3R0b20pKVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBwcmltYXJ5U2l6ZVB4O1xuICAgIGxldCBzZWNvbmRhcnlTaXplUHg7XG4gICAgbGV0IHNwbGl0UGFuZVNpemVQeDtcblxuICAgIGlmIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgY29uc3QgcmVzaXplckxlZnQgPSBjbGllbnRYIC0gKHJlc2l6ZXJTaXplIC8gMik7XG4gICAgICBjb25zdCByZXNpemVyUmlnaHQgPSBjbGllbnRYICsgKHJlc2l6ZXJTaXplIC8gMik7XG5cbiAgICAgIHByaW1hcnlTaXplUHggPSByZXNpemVyTGVmdCAtIHByaW1hcnkubGVmdDtcbiAgICAgIHNlY29uZGFyeVNpemVQeCA9IHNlY29uZGFyeS5yaWdodCAtIHJlc2l6ZXJSaWdodDtcbiAgICAgIHNwbGl0UGFuZVNpemVQeCA9IHNwbGl0UGFuZURpbWVuc2lvbnMud2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHJlc2l6ZXJUb3AgPSBjbGllbnRZIC0gKHJlc2l6ZXJTaXplIC8gMik7XG4gICAgICBjb25zdCByZXNpemVyQm90dG9tID0gY2xpZW50WSArIChyZXNpemVyU2l6ZSAvIDIpO1xuXG4gICAgICBwcmltYXJ5U2l6ZVB4ID0gcmVzaXplclRvcCAtIHByaW1hcnkudG9wO1xuICAgICAgc2Vjb25kYXJ5U2l6ZVB4ID0gc2Vjb25kYXJ5LmJvdHRvbSAtIHJlc2l6ZXJCb3R0b207XG4gICAgICBzcGxpdFBhbmVTaXplUHggPSBzcGxpdFBhbmVEaW1lbnNpb25zLmhlaWdodDtcbiAgICB9XG5cbiAgICBzaXplc1B4W3Jlc2l6ZXJJbmRleF0gPSBwcmltYXJ5U2l6ZVB4O1xuICAgIHNpemVzUHhbcmVzaXplckluZGV4ICsgMV0gPSBzZWNvbmRhcnlTaXplUHg7XG5cbiAgICAvLyBjb25zdCBzaXplc1B4ID0gW3ByaW1hcnlTaXplUHgsIHNlY29uZGFyeVNpemVQeF07XG5cbiAgICBjb25zdCBwcmltYXJ5TWluU2l6ZVB4ID0gY29udmVydChtaW5TaXplc1tyZXNpemVySW5kZXhdLCBzcGxpdFBhbmVTaXplUHgpO1xuICAgIGNvbnN0IHNlY29uZGFyeU1pblNpemVQeCA9IGNvbnZlcnQobWluU2l6ZXNbcmVzaXplckluZGV4ICsgMV0sIHNwbGl0UGFuZVNpemVQeCk7XG5cbiAgICBjb25zdCBwcmltYXJ5TWF4U2l6ZVB4ID0gY29udmVydChtYXhTaXplc1tyZXNpemVySW5kZXhdLCBzcGxpdFBhbmVTaXplUHgpO1xuICAgIGNvbnN0IHNlY29uZGFyeU1heFNpemVQeCA9IGNvbnZlcnQobWF4U2l6ZXNbcmVzaXplckluZGV4ICsgMV0sIHNwbGl0UGFuZVNpemVQeCk7XG5cbiAgICBpZiAoXG4gICAgICBwcmltYXJ5TWluU2l6ZVB4ID4gcHJpbWFyeVNpemVQeCB8fFxuICAgICAgcHJpbWFyeU1heFNpemVQeCA8IHByaW1hcnlTaXplUHggfHxcbiAgICAgIHNlY29uZGFyeU1pblNpemVQeCA+IHNlY29uZGFyeVNpemVQeCB8fFxuICAgICAgc2Vjb25kYXJ5TWF4U2l6ZVB4IDwgc2Vjb25kYXJ5U2l6ZVB4XG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGFuZXNTaXplcyA9IFtwcmltYXJ5U2l6ZVB4LCBzZWNvbmRhcnlTaXplUHhdO1xuICAgIGxldCBzaXplcyA9IHRoaXMuZ2V0U2l6ZXMoKS5jb25jYXQoKTtcbiAgICBsZXQgdXBkYXRlUmF0aW87XG5cbiAgICBwYW5lc1NpemVzLmZvckVhY2goKHBhbmVTaXplLCBpZHgpID0+IHtcbiAgICAgIGNvbnN0IHVuaXQgPSBnZXRVbml0KHNpemVzW3Jlc2l6ZXJJbmRleCArIGlkeF0pO1xuICAgICAgaWYgKHVuaXQgIT09IFwicmF0aW9cIikge1xuICAgICAgICBzaXplc1tyZXNpemVySW5kZXggKyBpZHhdID0gY29udmVydFVuaXRzKHBhbmVTaXplLCB1bml0LCBzcGxpdFBhbmVTaXplUHgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXBkYXRlUmF0aW8gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHVwZGF0ZVJhdGlvKSB7XG4gICAgICBsZXQgcmF0aW9Db3VudCA9IDA7XG4gICAgICBsZXQgbGFzdFJhdGlvSWR4O1xuICAgICAgc2l6ZXMgPSBzaXplcy5tYXAoKHNpemUsIGlkeCkgPT4ge1xuICAgICAgICBpZiAoZ2V0VW5pdChzaXplKSA9PT0gXCJyYXRpb1wiKSB7XG4gICAgICAgICAgcmF0aW9Db3VudCsrO1xuICAgICAgICAgIGxhc3RSYXRpb0lkeCA9IGlkeDtcbiAgICAgICAgICByZXR1cm4gY29udmVydFVuaXRzKHNpemVzUHhbaWR4XSwgXCJyYXRpb1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzaXplO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChyYXRpb0NvdW50ID09PSAxKSB7XG4gICAgICAgIHNpemVzW2xhc3RSYXRpb0lkeF0gPSAxO1xuICAgICAgfVxuICAgIH1cblxuICAgIG9uQ2hhbmdlICYmIG9uQ2hhbmdlKHNpemVzKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2l6ZXNcbiAgICB9KTtcbiAgfVxuXG4gIHNldFBhbmVSZWYgPSAoaWR4LCBlbCkgPT4ge1xuICAgIGlmICghdGhpcy5wYW5lRWxlbWVudHMpIHtcbiAgICAgIHRoaXMucGFuZUVsZW1lbnRzID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5wYW5lRWxlbWVudHNbaWR4XSA9IGVsO1xuICB9XG5cbiAgc2V0UmVzaXplclJlZiA9IChpZHgsIGVsKSA9PiB7XG4gICAgaWYgKCF0aGlzLnJlc2l6ZXJFbGVtZW50cykge1xuICAgICAgdGhpcy5yZXNpemVyRWxlbWVudHMgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLnJlc2l6ZXJFbGVtZW50c1tpZHhdID0gZWw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBzcGxpdCB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBzaXplcyA9IHRoaXMuZ2V0U2l6ZXMoKTtcblxuICAgIGNvbnN0IGVsZW1lbnRzID0gY2hpbGRyZW4ucmVkdWNlKChhY2MsIGNoaWxkLCBpZHgpID0+IHtcbiAgICAgIGxldCBwYW5lO1xuICAgICAgY29uc3QgcmVzaXplckluZGV4ID0gaWR4IC0gMTtcbiAgICAgIGNvbnN0IGlzUGFuZSA9IGNoaWxkLnR5cGUgPT09IFBhbmU7XG4gICAgICBjb25zdCBwYW5lUHJvcHMgPSB7XG4gICAgICAgIGluZGV4OiBpZHgsXG4gICAgICAgICdkYXRhLXR5cGUnOiAnUGFuZScsXG4gICAgICAgIHNwbGl0OiBzcGxpdCxcbiAgICAgICAga2V5OiBgUGFuZS0ke2lkeH1gLFxuICAgICAgICByZWY6IHRoaXMuc2V0UGFuZVJlZi5iaW5kKG51bGwsIGlkeClcbiAgICAgIH07XG5cbiAgICAgIGlmIChzaXplcykge1xuICAgICAgICBwYW5lUHJvcHMuc2l6ZSA9IHNpemVzW2lkeF07XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1BhbmUpIHtcbiAgICAgICAgcGFuZSA9IGNsb25lRWxlbWVudChjaGlsZCwgcGFuZVByb3BzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhbmUgPSA8UGFuZSB7Li4ucGFuZVByb3BzfT57Y2hpbGR9PC9QYW5lPjtcbiAgICAgIH1cblxuICAgICAgaWYgKGFjYy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFsuLi5hY2MsIHBhbmVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzaXplciA9IChcbiAgICAgICAgICA8UmVzaXplclxuICAgICAgICAgICAgaW5kZXg9e3Jlc2l6ZXJJbmRleH1cbiAgICAgICAgICAgIGtleT17YFJlc2l6ZXItJHtyZXNpemVySW5kZXh9YH1cbiAgICAgICAgICAgIHJlZj17dGhpcy5zZXRSZXNpemVyUmVmLmJpbmQobnVsbCwgcmVzaXplckluZGV4KX1cbiAgICAgICAgICAgIHNwbGl0PXtzcGxpdH1cbiAgICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLm9uTW91c2VEb3dufVxuICAgICAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBbLi4uYWNjLCByZXNpemVyLCBwYW5lXTtcbiAgICAgIH1cbiAgICB9LCBbXSk7XG5cbiAgICBjb25zdCBTdHlsZUNvbXBvbmVudCA9IHNwbGl0ID09PSAndmVydGljYWwnID8gUm93U3R5bGUgOiBDb2x1bW5TdHlsZTtcblxuICAgIHJldHVybiAoXG4gICAgICA8U3R5bGVDb21wb25lbnRcbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgIGRhdGEtdHlwZT1cIlNwbGl0UGFuZVwiXG4gICAgICAgIGRhdGEtc3BsaXQ9e3NwbGl0fVxuICAgICAgICByZWY9e3NwbGl0UGFuZSA9PiAodGhpcy5zcGxpdFBhbmUgPSBzcGxpdFBhbmUpfVxuICAgICAgPlxuICAgICAgICB7ZWxlbWVudHN9XG4gICAgICA8L1N0eWxlQ29tcG9uZW50PlxuICAgICk7XG4gIH1cbn1cblxuU3BsaXRQYW5lLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5ub2RlKS5pc1JlcXVpcmVkLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNwbGl0OiBQcm9wVHlwZXMub25lT2YoWyd2ZXJ0aWNhbCcsICdob3Jpem9udGFsJ10pLFxuICByZXNpemVyU2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblJlc2l6ZVN0YXJ0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25SZXNpemVFbmQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuU3BsaXRQYW5lLmRlZmF1bHRQcm9wcyA9IHtcbiAgc3BsaXQ6ICd2ZXJ0aWNhbCcsXG4gIHJlc2l6ZXJTaXplOiAxLFxuICBhbGxvd1Jlc2l6ZTogdHJ1ZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU3BsaXRQYW5lO1xuIl19