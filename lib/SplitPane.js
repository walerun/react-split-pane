'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

// todo: move utils fn to separate file
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

var SplitPane = function (_Component) {
  _inherits(SplitPane, _Component);

  function SplitPane(props) {
    _classCallCheck(this, SplitPane);

    var _this = _possibleConstructorReturn(this, (SplitPane.__proto__ || Object.getPrototypeOf(SplitPane)).call(this, props));

    _this.onMouseDown = function (event, resizerIndex) {
      _this.onDown(resizerIndex);
    };

    _this.onTouchStart = function (event, resizerIndex) {
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

      document.addEventListener('mousemove', _this.onMouseMove);
      document.addEventListener('mouseup', _this.onMouseUp);

      if (onResizeStart) {
        onResizeStart(resizerIndex);
      }

      _this.setState({
        resizerIndex: resizerIndex
      });
    };

    _this.onMouseMove = function (e) {
      e.stopPropagation();
      e.preventDefault();

      _this.onMove(e.clientX, e.clientY);
    };

    _this.onTouchMove = function (event) {
      e.stopPropagation();
      e.preventDefault();
      _this.onMove(event.touches[0].clientX, event.touches[0].clientY);
    };

    _this.onMouseUp = function () {
      document.removeEventListener('mouseup', _this.onMouseUp);
      document.removeEventListener('mousemove', _this.onMouseMove);

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

    var sizes = _this.getPaneProp("initialSize");

    _this.state = {
      sizes: sizes
    };
    return _this;
  }

  _createClass(SplitPane, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ sizes: this.getPaneProp("initialSize") });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mouseup', this.onMouseUp);
      document.removeEventListener('mousemove', this.onMouseMove);
      // document.removeEventListener('touchmove', this.onTouchMove);
      window.removeEventListener('resize', this.resize);
    }
  }, {
    key: 'getPaneProp',
    value: function getPaneProp(key) {
      return _react2.default.Children.map(this.props.children, function (c) {
        return c.props[key];
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
    key: 'onMove',
    value: function onMove(clientX, clientY) {
      var _props = this.props,
          split = _props.split,
          resizerSize = _props.resizerSize,
          onChange = _props.onChange;
      var resizerIndex = this.state.resizerIndex;

      var minSizes = this.getPaneProp('minSize');
      var maxSizes = this.getPaneProp('maxSize');
      var dimensions = this.dimensions;

      var sizesPx = dimensions.map(function (d) {
        return split === "vertical" ? d.width : d.height;
      });

      var splitPaneDimensions = (0, _reactDom.findDOMNode)(this.splitPane).getBoundingClientRect();
      var resizerDimensions = this.getResizerDimensions()[resizerIndex];

      var sizes = this.state.sizes.concat();

      var primaryUnit = getUnit(sizes[resizerIndex]);
      var secondaryUnit = getUnit(sizes[resizerIndex + 1]);
      var primary = dimensions[resizerIndex];
      var secondary = dimensions[resizerIndex + 1];

      if (split === 'vertical' && clientX >= primary.left && clientX <= secondary.right || split !== 'vertical' && clientY >= primary.top && clientY <= secondary.bottom) {
        var primarySize = void 0;
        var secondarySize = void 0;
        var splitPaneSize = void 0;

        if (split === 'vertical') {
          var resizerLeft = clientX - resizerSize / 2;
          var resizerRight = clientX + resizerSize / 2;

          primarySize = resizerLeft - primary.left;
          secondarySize = secondary.right - resizerRight;
          splitPaneSize = splitPaneDimensions.width;
        } else {
          var resizerTop = clientY - resizerSize / 2;
          var resizerBottom = clientY + resizerSize / 2;

          primarySize = resizerTop - primary.top;
          secondarySize = secondary.bottom - resizerBottom;
          splitPaneSize = splitPaneDimensions.height;
        }

        var primaryMinSize = convert(minSizes[resizerIndex], splitPaneSize);
        var secondaryMinSize = convert(minSizes[resizerIndex + 1], splitPaneSize);

        var primaryMaxSize = convert(maxSizes[resizerIndex], splitPaneSize);
        var secondaryMaxSize = convert(maxSizes[resizerIndex + 1], splitPaneSize);

        if (primaryMinSize <= primarySize && primaryMaxSize >= primarySize && secondaryMinSize <= secondarySize && secondaryMaxSize >= secondarySize) {
          sizesPx[resizerIndex] = primarySize;
          sizesPx[resizerIndex + 1] = secondarySize;

          if (primaryUnit !== "ratio") {
            sizes[resizerIndex] = this.convertUnits(primarySize, primaryUnit, splitPaneSize);
          } else {
            sizes = sizes.map(function (s, idx) {
              if (getUnit(s) === "ratio") {
                s = +sizesPx[idx];
              }

              return s;
            });
          }

          if (secondaryUnit !== "ratio") {
            sizes[resizerIndex + 1] = this.convertUnits(secondarySize, secondaryUnit, splitPaneSize);
          } else {
            sizes = sizes.map(function (s, idx) {
              if (getUnit(s) === "ratio") {
                s = +sizesPx[idx];
              }
              return s;
            });
          }

          this.setState({ sizes: sizes });

          if (onChange) {
            onChange(sizes);
          }
        }
      }
    }
  }, {
    key: 'convertUnits',
    value: function convertUnits(size, unit, containerSize) {
      switch (unit) {
        case "%":
          return size / containerSize * 100 + '%';
        case "px":
          return size + 'px';
        case "ratio":
          return size;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          children = _props2.children,
          className = _props2.className,
          split = _props2.split;
      var _state = this.state,
          ratios = _state.ratios,
          sizes = _state.sizes;


      var paneIndex = 0;
      var resizerIndex = 0;

      var elements = children.reduce(function (acc, child) {
        // const size = sizes[paneIndex] ? sizes[paneIndex] : 0;
        var pane = void 0;
        var isPane = child.type === _Pane2.default;
        var paneProps = {
          index: paneIndex,
          'data-type': 'Pane',
          // size: size,
          split: split,
          key: 'Pane-' + paneIndex,
          ref: _this2.setPaneRef.bind(null, paneIndex)
        };
        if (isPane) {
          pane = (0, _react.cloneElement)(child, paneProps);
        } else {
          pane = _react2.default.createElement(
            _Pane2.default,
            paneProps,
            child
          );
        }
        paneIndex++;
        if (acc.length === 0) {
          return [].concat(_toConsumableArray(acc), [pane]);
        } else {
          var resizer = _react2.default.createElement(_Resizer2.default, {
            index: resizerIndex,
            key: 'Resizer-' + resizerIndex,
            ref: _this2.setResizerRef.bind(null, resizerIndex),
            split: split,
            onMouseDown: _this2.onMouseDown
            // onTouchStart={this.onTouchStart}
            // onTouchEnd={this.onMouseUp}
          });
          resizerIndex++;
          return [].concat(_toConsumableArray(acc), [resizer, pane]);
        }
      }, []);

      if (split === 'vertical') {
        return _react2.default.createElement(
          RowStyle,
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
      } else {
        return _react2.default.createElement(
          ColumnStyle,
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
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TcGxpdFBhbmUuanMiXSwibmFtZXMiOlsiQ29sdW1uU3R5bGUiLCJkaXYiLCJkaXNwbGF5IiwiaGVpZ2h0IiwiZmxleERpcmVjdGlvbiIsImZsZXgiLCJvdXRsaW5lIiwib3ZlcmZsb3ciLCJ1c2VyU2VsZWN0IiwibWluSGVpZ2h0Iiwid2lkdGgiLCJSb3dTdHlsZSIsImNvbnZlcnQiLCJzdHIiLCJzaXplIiwidG9rZW5zIiwibWF0Y2giLCJ2YWx1ZSIsInVuaXQiLCJ0b1B4IiwidG9GaXhlZCIsImdldFVuaXQiLCJlbmRzV2l0aCIsIlNwbGl0UGFuZSIsInByb3BzIiwib25Nb3VzZURvd24iLCJldmVudCIsInJlc2l6ZXJJbmRleCIsIm9uRG93biIsIm9uVG91Y2hTdGFydCIsImFsbG93UmVzaXplIiwib25SZXNpemVTdGFydCIsImRpbWVuc2lvbnMiLCJnZXRQYW5lRGltZW5zaW9ucyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVVwIiwic2V0U3RhdGUiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJvbk1vdmUiLCJjbGllbnRYIiwiY2xpZW50WSIsIm9uVG91Y2hNb3ZlIiwidG91Y2hlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblJlc2l6ZUVuZCIsInNldFBhbmVSZWYiLCJpZHgiLCJlbCIsInBhbmVFbGVtZW50cyIsInNldFJlc2l6ZXJSZWYiLCJyZXNpemVyRWxlbWVudHMiLCJzaXplcyIsImdldFBhbmVQcm9wIiwic3RhdGUiLCJuZXh0UHJvcHMiLCJ3aW5kb3ciLCJyZXNpemUiLCJrZXkiLCJDaGlsZHJlbiIsIm1hcCIsImNoaWxkcmVuIiwiYyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNwbGl0IiwicmVzaXplclNpemUiLCJvbkNoYW5nZSIsIm1pblNpemVzIiwibWF4U2l6ZXMiLCJzaXplc1B4IiwiZCIsInNwbGl0UGFuZURpbWVuc2lvbnMiLCJzcGxpdFBhbmUiLCJyZXNpemVyRGltZW5zaW9ucyIsImdldFJlc2l6ZXJEaW1lbnNpb25zIiwiY29uY2F0IiwicHJpbWFyeVVuaXQiLCJzZWNvbmRhcnlVbml0IiwicHJpbWFyeSIsInNlY29uZGFyeSIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsInByaW1hcnlTaXplIiwic2Vjb25kYXJ5U2l6ZSIsInNwbGl0UGFuZVNpemUiLCJyZXNpemVyTGVmdCIsInJlc2l6ZXJSaWdodCIsInJlc2l6ZXJUb3AiLCJyZXNpemVyQm90dG9tIiwicHJpbWFyeU1pblNpemUiLCJzZWNvbmRhcnlNaW5TaXplIiwicHJpbWFyeU1heFNpemUiLCJzZWNvbmRhcnlNYXhTaXplIiwiY29udmVydFVuaXRzIiwicyIsImNvbnRhaW5lclNpemUiLCJjbGFzc05hbWUiLCJyYXRpb3MiLCJwYW5lSW5kZXgiLCJlbGVtZW50cyIsInJlZHVjZSIsImFjYyIsImNoaWxkIiwicGFuZSIsImlzUGFuZSIsInR5cGUiLCJwYW5lUHJvcHMiLCJpbmRleCIsInJlZiIsImJpbmQiLCJsZW5ndGgiLCJyZXNpemVyIiwicHJvcFR5cGVzIiwiYXJyYXlPZiIsIm5vZGUiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwib25lT2YiLCJudW1iZXIiLCJmdW5jIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsY0FBYyxvQkFBVUMsR0FBVixDQUFjO0FBQ2hDQyxXQUFTLE1BRHVCO0FBRWhDQyxVQUFRLE1BRndCO0FBR2hDQyxpQkFBZSxRQUhpQjtBQUloQ0MsUUFBTSxDQUowQjtBQUtoQ0MsV0FBUyxNQUx1QjtBQU1oQ0MsWUFBVSxRQU5zQjtBQU9oQ0MsY0FBWSxNQVBvQjs7QUFTaENDLGFBQVcsTUFUcUI7QUFVaENDLFNBQU87QUFWeUIsQ0FBZCxDQUFwQjs7QUFhQSxJQUFNQyxXQUFXLG9CQUFVVixH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QU1HNkI7QUFOSCxTQURGO0FBVUQ7QUFDRjs7Ozs7O0FBR0hqRixVQUFVOEYsU0FBVixHQUFzQjtBQUNwQnJELFlBQVUsb0JBQVVzRCxPQUFWLENBQWtCLG9CQUFVQyxJQUE1QixFQUFrQ0MsVUFEeEI7QUFFcEJuQixhQUFXLG9CQUFVb0IsTUFGRDtBQUdwQnRELFNBQU8sb0JBQVV1RCxLQUFWLENBQWdCLENBQUMsVUFBRCxFQUFhLFlBQWIsQ0FBaEIsQ0FIYTtBQUlwQnRELGVBQWEsb0JBQVV1RCxNQUpIO0FBS3BCdEQsWUFBVSxvQkFBVXVELElBTEE7QUFNcEI3RixpQkFBZSxvQkFBVTZGLElBTkw7QUFPcEI1RSxlQUFhLG9CQUFVNEU7QUFQSCxDQUF0Qjs7QUFVQXJHLFVBQVVzRyxZQUFWLEdBQXlCO0FBQ3ZCMUQsU0FBTyxVQURnQjtBQUV2QkMsZUFBYSxDQUZVO0FBR3ZCdEMsZUFBYTtBQUhVLENBQXpCOztrQkFNZVAsUyIsImZpbGUiOiJTcGxpdFBhbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjbG9uZUVsZW1lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBmaW5kRE9NTm9kZSB9IGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgZ2xhbW9yb3VzIGZyb20gJ2dsYW1vcm91cyc7XG5pbXBvcnQgUmVzaXplciBmcm9tICcuL1Jlc2l6ZXInO1xuaW1wb3J0IFBhbmUgZnJvbSAnLi9QYW5lJztcblxuY29uc3QgQ29sdW1uU3R5bGUgPSBnbGFtb3JvdXMuZGl2KHtcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICBoZWlnaHQ6ICcxMDAlJyxcbiAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gIGZsZXg6IDEsXG4gIG91dGxpbmU6ICdub25lJyxcbiAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICB1c2VyU2VsZWN0OiAndGV4dCcsXG5cbiAgbWluSGVpZ2h0OiAnMTAwJScsXG4gIHdpZHRoOiAnMTAwJScsXG59KTtcblxuY29uc3QgUm93U3R5bGUgPSBnbGFtb3JvdXMuZGl2KHtcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICBoZWlnaHQ6ICcxMDAlJyxcbiAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gIGZsZXg6IDEsXG4gIG91dGxpbmU6ICdub25lJyxcbiAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICB1c2VyU2VsZWN0OiAndGV4dCcsXG5cbn0pO1xuXG4vLyB0b2RvOiBtb3ZlIHV0aWxzIGZuIHRvIHNlcGFyYXRlIGZpbGVcbmZ1bmN0aW9uIGNvbnZlcnQgKHN0ciwgc2l6ZSkge1xuICBjb25zdCB0b2tlbnMgPSBzdHIubWF0Y2goLyhbMC05XSspKFtweHwlXSopLyk7XG4gIGNvbnN0IHZhbHVlID0gdG9rZW5zWzFdO1xuICBjb25zdCB1bml0ID0gdG9rZW5zWzJdO1xuICByZXR1cm4gdG9QeCh2YWx1ZSwgdW5pdCwgc2l6ZSk7XG59XG5cbmZ1bmN0aW9uIHRvUHgodmFsdWUsIHVuaXQgPSAncHgnLCBzaXplKSB7XG4gIHN3aXRjaCAodW5pdCkge1xuICAgIGNhc2UgJyUnOiB7XG4gICAgICByZXR1cm4gKHNpemUgKiB2YWx1ZSAvIDEwMCkudG9GaXhlZCgyKTtcbiAgICB9XG4gICAgZGVmYXVsdDoge1xuICAgICAgcmV0dXJuICt2YWx1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VW5pdChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSA9PT0gXCJudW1iZXJcIikge1xuICAgIHJldHVybiBcInJhdGlvXCI7XG4gIH1cblxuICBpZihzaXplLmVuZHNXaXRoKFwicHhcIikpIHtcbiAgICByZXR1cm4gXCJweFwiO1xuICB9XG5cbiAgaWYoc2l6ZS5lbmRzV2l0aChcIiVcIikpIHtcbiAgICByZXR1cm4gXCIlXCI7XG4gIH1cblxuICByZXR1cm4gXCJyYXRpb1wiO1xufVxuXG5jbGFzcyBTcGxpdFBhbmUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIGNvbnN0IHNpemVzID0gdGhpcy5nZXRQYW5lUHJvcChcImluaXRpYWxTaXplXCIpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNpemVzXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7c2l6ZXM6IHRoaXMuZ2V0UGFuZVByb3AoXCJpbml0aWFsU2l6ZVwiKX0pO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAvLyBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemUpO1xuICB9XG5cbiAgb25Nb3VzZURvd24gPSAoZXZlbnQsIHJlc2l6ZXJJbmRleCkgPT4ge1xuICAgIHRoaXMub25Eb3duKHJlc2l6ZXJJbmRleCk7XG4gIH1cblxuICBvblRvdWNoU3RhcnQgPSAoZXZlbnQsIHJlc2l6ZXJJbmRleCkgPT4ge1xuICAgIHRoaXMub25Eb3duKHJlc2l6ZXJJbmRleCk7XG4gIH1cblxuICBvbkRvd24gPSAocmVzaXplckluZGV4KSA9PiB7XG4gICAgY29uc3Qge2FsbG93UmVzaXplLCBvblJlc2l6ZVN0YXJ0fSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIWFsbG93UmVzaXplKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kaW1lbnNpb25zID0gdGhpcy5nZXRQYW5lRGltZW5zaW9ucygpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcblxuICAgIGlmIChvblJlc2l6ZVN0YXJ0KSB7XG4gICAgICBvblJlc2l6ZVN0YXJ0KHJlc2l6ZXJJbmRleCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZXNpemVySW5kZXgsXG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB0aGlzLm9uTW92ZShlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gIH1cblxuICBvblRvdWNoTW92ZSA9IChldmVudCkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMub25Nb3ZlKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCwgZXZlbnQudG91Y2hlc1swXS5jbGllbnRZKTtcbiAgfVxuXG4gIG9uTW91c2VVcCA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXApO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMub25SZXNpemVFbmQpIHtcbiAgICAgIHRoaXMucHJvcHMub25SZXNpemVFbmQoKTtcbiAgICB9XG4gIH1cblxuICBnZXRQYW5lUHJvcChrZXkpIHtcbiAgICByZXR1cm4gUmVhY3QuQ2hpbGRyZW4ubWFwKHRoaXMucHJvcHMuY2hpbGRyZW4sIGMgPT4gYy5wcm9wc1trZXldKTtcbiAgfVxuXG4gIGdldFBhbmVEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVFbGVtZW50cy5tYXAoZWwgPT4gZmluZERPTU5vZGUoZWwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgfVxuXG4gIGdldFJlc2l6ZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnJlc2l6ZXJFbGVtZW50cy5tYXAoZWwgPT4gZmluZERPTU5vZGUoZWwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKVxuICB9XG5cbiAgb25Nb3ZlKGNsaWVudFgsIGNsaWVudFkpIHtcbiAgICBjb25zdCB7IHNwbGl0LCByZXNpemVyU2l6ZSwgb25DaGFuZ2UgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyByZXNpemVySW5kZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgbWluU2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKCdtaW5TaXplJyk7XG4gICAgY29uc3QgbWF4U2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKCdtYXhTaXplJyk7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICBcbiAgICBjb25zdCBzaXplc1B4ID0gZGltZW5zaW9ucy5tYXAoZCA9PiBzcGxpdCA9PT0gXCJ2ZXJ0aWNhbFwiID8gZC53aWR0aCA6IGQuaGVpZ2h0KTtcbiAgICBcbiAgICBjb25zdCBzcGxpdFBhbmVEaW1lbnNpb25zID0gZmluZERPTU5vZGUodGhpcy5zcGxpdFBhbmUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHJlc2l6ZXJEaW1lbnNpb25zID0gdGhpcy5nZXRSZXNpemVyRGltZW5zaW9ucygpW3Jlc2l6ZXJJbmRleF07XG5cbiAgICBsZXQgc2l6ZXMgPSB0aGlzLnN0YXRlLnNpemVzLmNvbmNhdCgpO1xuICAgIFxuICAgIGNvbnN0IHByaW1hcnlVbml0ID0gZ2V0VW5pdChzaXplc1tyZXNpemVySW5kZXhdKTtcbiAgICBjb25zdCBzZWNvbmRhcnlVbml0ID0gZ2V0VW5pdChzaXplc1tyZXNpemVySW5kZXggKyAxXSk7XG4gICAgY29uc3QgcHJpbWFyeSA9IGRpbWVuc2lvbnNbcmVzaXplckluZGV4XTtcbiAgICBjb25zdCBzZWNvbmRhcnkgPSBkaW1lbnNpb25zW3Jlc2l6ZXJJbmRleCArIDFdO1xuICAgIFxuXG4gICAgaWYgKFxuICAgICAgKHNwbGl0ID09PSAndmVydGljYWwnICYmXG4gICAgICAgIGNsaWVudFggPj0gcHJpbWFyeS5sZWZ0ICYmXG4gICAgICAgIGNsaWVudFggPD0gc2Vjb25kYXJ5LnJpZ2h0KSB8fFxuICAgICAgKHNwbGl0ICE9PSAndmVydGljYWwnICYmXG4gICAgICAgIGNsaWVudFkgPj0gcHJpbWFyeS50b3AgJiZcbiAgICAgICAgY2xpZW50WSA8PSBzZWNvbmRhcnkuYm90dG9tKVxuICAgICkge1xuICAgICAgbGV0IHByaW1hcnlTaXplO1xuICAgICAgbGV0IHNlY29uZGFyeVNpemU7XG4gICAgICBsZXQgc3BsaXRQYW5lU2l6ZTtcblxuICAgICAgaWYgKHNwbGl0ID09PSAndmVydGljYWwnKSB7XG4gICAgICAgIGNvbnN0IHJlc2l6ZXJMZWZ0ID0gY2xpZW50WCAtIChyZXNpemVyU2l6ZSAvIDIpO1xuICAgICAgICBjb25zdCByZXNpemVyUmlnaHQgPSBjbGllbnRYICsgKHJlc2l6ZXJTaXplIC8gMik7XG5cbiAgICAgICAgcHJpbWFyeVNpemUgPSByZXNpemVyTGVmdCAtIHByaW1hcnkubGVmdDtcbiAgICAgICAgc2Vjb25kYXJ5U2l6ZSA9IHNlY29uZGFyeS5yaWdodCAtIHJlc2l6ZXJSaWdodDtcbiAgICAgICAgc3BsaXRQYW5lU2l6ZSA9IHNwbGl0UGFuZURpbWVuc2lvbnMud2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXNpemVyVG9wID0gY2xpZW50WSAtIChyZXNpemVyU2l6ZSAvIDIpO1xuICAgICAgICBjb25zdCByZXNpemVyQm90dG9tID0gY2xpZW50WSArIChyZXNpemVyU2l6ZSAvIDIpO1xuXG4gICAgICAgIHByaW1hcnlTaXplID0gcmVzaXplclRvcCAtIHByaW1hcnkudG9wO1xuICAgICAgICBzZWNvbmRhcnlTaXplID0gc2Vjb25kYXJ5LmJvdHRvbSAtIHJlc2l6ZXJCb3R0b207XG4gICAgICAgIHNwbGl0UGFuZVNpemUgPSBzcGxpdFBhbmVEaW1lbnNpb25zLmhlaWdodDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJpbWFyeU1pblNpemUgPSBjb252ZXJ0KG1pblNpemVzW3Jlc2l6ZXJJbmRleF0sIHNwbGl0UGFuZVNpemUpO1xuICAgICAgY29uc3Qgc2Vjb25kYXJ5TWluU2l6ZSA9IGNvbnZlcnQobWluU2l6ZXNbcmVzaXplckluZGV4ICsgMV0sIHNwbGl0UGFuZVNpemUpO1xuXG4gICAgICBjb25zdCBwcmltYXJ5TWF4U2l6ZSA9IGNvbnZlcnQobWF4U2l6ZXNbcmVzaXplckluZGV4XSwgc3BsaXRQYW5lU2l6ZSk7XG4gICAgICBjb25zdCBzZWNvbmRhcnlNYXhTaXplID0gY29udmVydChtYXhTaXplc1tyZXNpemVySW5kZXggKyAxXSwgc3BsaXRQYW5lU2l6ZSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgcHJpbWFyeU1pblNpemUgPD0gcHJpbWFyeVNpemUgJiZcbiAgICAgICAgcHJpbWFyeU1heFNpemUgPj0gcHJpbWFyeVNpemUgJiZcbiAgICAgICAgc2Vjb25kYXJ5TWluU2l6ZSA8PSBzZWNvbmRhcnlTaXplICYmXG4gICAgICAgIHNlY29uZGFyeU1heFNpemUgPj0gc2Vjb25kYXJ5U2l6ZVxuICAgICAgKSB7XG4gICAgICAgIHNpemVzUHhbcmVzaXplckluZGV4XSA9IHByaW1hcnlTaXplO1xuICAgICAgICBzaXplc1B4W3Jlc2l6ZXJJbmRleCArIDFdID0gc2Vjb25kYXJ5U2l6ZTtcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAocHJpbWFyeVVuaXQgIT09IFwicmF0aW9cIikge1xuICAgICAgICAgIHNpemVzW3Jlc2l6ZXJJbmRleF0gPSB0aGlzLmNvbnZlcnRVbml0cyhwcmltYXJ5U2l6ZSwgcHJpbWFyeVVuaXQsIHNwbGl0UGFuZVNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNpemVzID0gc2l6ZXMubWFwKChzLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGlmIChnZXRVbml0KHMpID09PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICAgICAgcyA9ICtzaXplc1B4W2lkeF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlY29uZGFyeVVuaXQgIT09IFwicmF0aW9cIikge1xuICAgICAgICAgIHNpemVzW3Jlc2l6ZXJJbmRleCArIDFdID0gdGhpcy5jb252ZXJ0VW5pdHMoc2Vjb25kYXJ5U2l6ZSwgc2Vjb25kYXJ5VW5pdCwgc3BsaXRQYW5lU2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2l6ZXMgPSBzaXplcy5tYXAoKHMsIGlkeCkgPT4ge1xuICAgICAgICAgICAgaWYgKGdldFVuaXQocykgPT09IFwicmF0aW9cIikge1xuICAgICAgICAgICAgICBzID0gK3NpemVzUHhbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2l6ZXN9KTtcblxuICAgICAgICBpZiAob25DaGFuZ2UpIHtcbiAgICAgICAgICBvbkNoYW5nZShzaXplcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb252ZXJ0VW5pdHMoc2l6ZSwgdW5pdCwgY29udGFpbmVyU2l6ZSkge1xuICAgIHN3aXRjaCh1bml0KSB7XG4gICAgICBjYXNlIFwiJVwiOlxuICAgICAgICByZXR1cm4gYCR7c2l6ZS9jb250YWluZXJTaXplKjEwMH0lYDtcbiAgICAgIGNhc2UgXCJweFwiOlxuICAgICAgICByZXR1cm4gYCR7c2l6ZX1weGA7XG4gICAgICBjYXNlIFwicmF0aW9cIjpcbiAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgfVxuICB9XG5cbiAgc2V0UGFuZVJlZiA9IChpZHgsIGVsKSA9PiB7XG4gICAgaWYgKCF0aGlzLnBhbmVFbGVtZW50cykge1xuICAgICAgdGhpcy5wYW5lRWxlbWVudHMgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLnBhbmVFbGVtZW50c1tpZHhdID0gZWw7XG4gIH1cblxuICBzZXRSZXNpemVyUmVmID0gKGlkeCwgZWwpID0+IHtcbiAgICBpZiAoIXRoaXMucmVzaXplckVsZW1lbnRzKSB7XG4gICAgICB0aGlzLnJlc2l6ZXJFbGVtZW50cyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMucmVzaXplckVsZW1lbnRzW2lkeF0gPSBlbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIHNwbGl0IH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgcmF0aW9zLCBzaXplcyB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGxldCBwYW5lSW5kZXggPSAwO1xuICAgIGxldCByZXNpemVySW5kZXggPSAwO1xuXG4gICAgY29uc3QgZWxlbWVudHMgPSBjaGlsZHJlbi5yZWR1Y2UoKGFjYywgY2hpbGQpID0+IHtcbiAgICAgIC8vIGNvbnN0IHNpemUgPSBzaXplc1twYW5lSW5kZXhdID8gc2l6ZXNbcGFuZUluZGV4XSA6IDA7XG4gICAgICBsZXQgcGFuZTtcbiAgICAgIGNvbnN0IGlzUGFuZSA9IGNoaWxkLnR5cGUgPT09IFBhbmU7XG4gICAgICBjb25zdCBwYW5lUHJvcHMgPSB7XG4gICAgICAgIGluZGV4OiBwYW5lSW5kZXgsXG4gICAgICAgICdkYXRhLXR5cGUnOiAnUGFuZScsXG4gICAgICAgIC8vIHNpemU6IHNpemUsXG4gICAgICAgIHNwbGl0OiBzcGxpdCxcbiAgICAgICAga2V5OiBgUGFuZS0ke3BhbmVJbmRleH1gLFxuICAgICAgICByZWY6IHRoaXMuc2V0UGFuZVJlZi5iaW5kKG51bGwsIHBhbmVJbmRleClcbiAgICAgIH07XG4gICAgICBpZiAoaXNQYW5lKSB7XG4gICAgICAgIHBhbmUgPSBjbG9uZUVsZW1lbnQoY2hpbGQsIHBhbmVQcm9wcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYW5lID0gPFBhbmUgey4uLnBhbmVQcm9wc30+e2NoaWxkfTwvUGFuZT47XG4gICAgICB9XG4gICAgICBwYW5lSW5kZXgrKztcbiAgICAgIGlmIChhY2MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbLi4uYWNjLCBwYW5lXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlc2l6ZXIgPSAoXG4gICAgICAgICAgPFJlc2l6ZXJcbiAgICAgICAgICAgIGluZGV4PXtyZXNpemVySW5kZXh9XG4gICAgICAgICAgICBrZXk9e2BSZXNpemVyLSR7cmVzaXplckluZGV4fWB9XG4gICAgICAgICAgICByZWY9e3RoaXMuc2V0UmVzaXplclJlZi5iaW5kKG51bGwsIHJlc2l6ZXJJbmRleCl9XG4gICAgICAgICAgICBzcGxpdD17c3BsaXR9XG4gICAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5vbk1vdXNlRG93bn1cbiAgICAgICAgICAgIC8vIG9uVG91Y2hTdGFydD17dGhpcy5vblRvdWNoU3RhcnR9XG4gICAgICAgICAgICAvLyBvblRvdWNoRW5kPXt0aGlzLm9uTW91c2VVcH1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgICByZXNpemVySW5kZXgrKztcbiAgICAgICAgcmV0dXJuIFsuLi5hY2MsIHJlc2l6ZXIsIHBhbmVdO1xuICAgICAgfVxuICAgIH0sIFtdKTtcblxuICAgIGlmIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFJvd1N0eWxlXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgICAgZGF0YS10eXBlPVwiU3BsaXRQYW5lXCJcbiAgICAgICAgICBkYXRhLXNwbGl0PXtzcGxpdH1cbiAgICAgICAgICByZWY9e3NwbGl0UGFuZSA9PiAodGhpcy5zcGxpdFBhbmUgPSBzcGxpdFBhbmUpfVxuICAgICAgICA+XG4gICAgICAgICAge2VsZW1lbnRzfVxuICAgICAgICA8L1Jvd1N0eWxlPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbHVtblN0eWxlXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgICAgZGF0YS10eXBlPVwiU3BsaXRQYW5lXCJcbiAgICAgICAgICBkYXRhLXNwbGl0PXtzcGxpdH1cbiAgICAgICAgICByZWY9e3NwbGl0UGFuZSA9PiAodGhpcy5zcGxpdFBhbmUgPSBzcGxpdFBhbmUpfVxuICAgICAgICA+XG4gICAgICAgICAge2VsZW1lbnRzfVxuICAgICAgICA8L0NvbHVtblN0eWxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuU3BsaXRQYW5lLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5ub2RlKS5pc1JlcXVpcmVkLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNwbGl0OiBQcm9wVHlwZXMub25lT2YoWyd2ZXJ0aWNhbCcsICdob3Jpem9udGFsJ10pLFxuICByZXNpemVyU2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblJlc2l6ZVN0YXJ0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25SZXNpemVFbmQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuU3BsaXRQYW5lLmRlZmF1bHRQcm9wcyA9IHtcbiAgc3BsaXQ6ICd2ZXJ0aWNhbCcsXG4gIHJlc2l6ZXJTaXplOiAxLFxuICBhbGxvd1Jlc2l6ZTogdHJ1ZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU3BsaXRQYW5lO1xuIl19