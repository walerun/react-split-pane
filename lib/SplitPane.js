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
  flexDirection: 'column'
  // flex: 1,
  // outline: 'none',
  // overflow: 'hidden',
  // userSelect: 'text',

  // minHeight: '100%',
  // width: '100%',
});

var RowStyle = _glamorous2.default.div({
  display: 'flex',
  height: '100%',
  flexDirection: 'row'
  // flex: 1,
  // outline: 'none',
  // overflow: 'hidden',
  // userSelect: 'text',

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
      if (!_this.props.allowResize) {
        return;
      }

      _this.dimensions = _this.getPaneDimensions();

      document.addEventListener('mousemove', _this.onMouseMove);
      document.addEventListener('mouseup', _this.onMouseUp);

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

      // if (onChange) {
      //   onChange(this.state.sizes);
      // }
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
    value: function componentWillReceiveProps(nextProps) {}
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
  onChange: _propTypes2.default.func
};

SplitPane.defaultProps = {
  split: 'vertical',
  resizerSize: 1,
  allowResize: true
};

exports.default = SplitPane;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TcGxpdFBhbmUuanMiXSwibmFtZXMiOlsiQ29sdW1uU3R5bGUiLCJkaXYiLCJkaXNwbGF5IiwiaGVpZ2h0IiwiZmxleERpcmVjdGlvbiIsIlJvd1N0eWxlIiwiY29udmVydCIsInN0ciIsInNpemUiLCJ0b2tlbnMiLCJtYXRjaCIsInZhbHVlIiwidW5pdCIsInRvUHgiLCJ0b0ZpeGVkIiwiZ2V0VW5pdCIsImVuZHNXaXRoIiwiU3BsaXRQYW5lIiwicHJvcHMiLCJvbk1vdXNlRG93biIsImV2ZW50IiwicmVzaXplckluZGV4Iiwib25Eb3duIiwib25Ub3VjaFN0YXJ0IiwiYWxsb3dSZXNpemUiLCJkaW1lbnNpb25zIiwiZ2V0UGFuZURpbWVuc2lvbnMiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbk1vdXNlTW92ZSIsIm9uTW91c2VVcCIsInNldFN0YXRlIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0Iiwib25Nb3ZlIiwiY2xpZW50WCIsImNsaWVudFkiLCJvblRvdWNoTW92ZSIsInRvdWNoZXMiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwic2V0UGFuZVJlZiIsImlkeCIsImVsIiwicGFuZUVsZW1lbnRzIiwic2V0UmVzaXplclJlZiIsInJlc2l6ZXJFbGVtZW50cyIsInNpemVzIiwiZ2V0UGFuZVByb3AiLCJzdGF0ZSIsIm5leHRQcm9wcyIsIndpbmRvdyIsInJlc2l6ZSIsImtleSIsIkNoaWxkcmVuIiwibWFwIiwiY2hpbGRyZW4iLCJjIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic3BsaXQiLCJyZXNpemVyU2l6ZSIsIm9uQ2hhbmdlIiwibWluU2l6ZXMiLCJtYXhTaXplcyIsInNpemVzUHgiLCJkIiwid2lkdGgiLCJzcGxpdFBhbmVEaW1lbnNpb25zIiwic3BsaXRQYW5lIiwicmVzaXplckRpbWVuc2lvbnMiLCJnZXRSZXNpemVyRGltZW5zaW9ucyIsImNvbmNhdCIsInByaW1hcnlVbml0Iiwic2Vjb25kYXJ5VW5pdCIsInByaW1hcnkiLCJzZWNvbmRhcnkiLCJsZWZ0IiwicmlnaHQiLCJ0b3AiLCJib3R0b20iLCJwcmltYXJ5U2l6ZSIsInNlY29uZGFyeVNpemUiLCJzcGxpdFBhbmVTaXplIiwicmVzaXplckxlZnQiLCJyZXNpemVyUmlnaHQiLCJyZXNpemVyVG9wIiwicmVzaXplckJvdHRvbSIsInByaW1hcnlNaW5TaXplIiwic2Vjb25kYXJ5TWluU2l6ZSIsInByaW1hcnlNYXhTaXplIiwic2Vjb25kYXJ5TWF4U2l6ZSIsImNvbnZlcnRVbml0cyIsInMiLCJjb250YWluZXJTaXplIiwiY2xhc3NOYW1lIiwicmF0aW9zIiwicGFuZUluZGV4IiwiZWxlbWVudHMiLCJyZWR1Y2UiLCJhY2MiLCJjaGlsZCIsInBhbmUiLCJpc1BhbmUiLCJ0eXBlIiwicGFuZVByb3BzIiwiaW5kZXgiLCJyZWYiLCJiaW5kIiwibGVuZ3RoIiwicmVzaXplciIsInByb3BUeXBlcyIsImFycmF5T2YiLCJub2RlIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsIm9uZU9mIiwibnVtYmVyIiwiZnVuYyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGNBQWMsb0JBQVVDLEdBQVYsQ0FBYztBQUNoQ0MsV0FBUyxNQUR1QjtBQUVoQ0MsVUFBUSxNQUZ3QjtBQUdoQ0MsaUJBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBVmdDLENBQWQsQ0FBcEI7O0FBYUEsSUFBTUMsV0FBVyxvQkFBVUosR0FBVixDQUFjO0FBQzdCQyxXQUFTLE1BRG9CO0FBRTdCQyxVQUFRLE1BRnFCO0FBRzdCQyxpQkFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBOztBQVA2QixDQUFkLENBQWpCOztBQVdBO0FBQ0EsU0FBU0UsT0FBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLElBQXZCLEVBQTZCO0FBQzNCLE1BQU1D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YSxPQUFLeEM7QUFDbEI7QUFDQTtBQVBGLFlBREY7QUFXQUU7QUFDQSw4Q0FBVzhFLEdBQVgsSUFBZ0JVLE9BQWhCLEVBQXlCUixJQUF6QjtBQUNEO0FBQ0YsT0FuQ2dCLEVBbUNkLEVBbkNjLENBQWpCOztBQXFDQSxVQUFJMUMsVUFBVSxVQUFkLEVBQTBCO0FBQ3hCLGVBQ0U7QUFBQyxrQkFBRDtBQUFBO0FBQ0UsdUJBQVdtQyxTQURiO0FBRUUseUJBQVUsV0FGWjtBQUdFLDBCQUFZbkMsS0FIZDtBQUlFLGlCQUFLO0FBQUEscUJBQWMsT0FBS1MsU0FBTCxHQUFpQkEsU0FBL0I7QUFBQTtBQUpQO0FBTUc2QjtBQU5ILFNBREY7QUFVRCxPQVhELE1BV087QUFDTCxlQUNFO0FBQUMscUJBQUQ7QUFBQTtBQUNFLHVCQUFXSCxTQURiO0FBRUUseUJBQVUsV0FGWjtBQUdFLDBCQUFZbkMsS0FIZDtBQUlFLGlCQUFLO0FBQUEscUJBQWMsT0FBS1MsU0FBTCxHQUFpQkEsU0FBL0I7QUFBQTtBQUpQO0FBTUc2QjtBQU5ILFNBREY7QUFVRDtBQUNGOzs7Ozs7QUFHSGhGLFVBQVU2RixTQUFWLEdBQXNCO0FBQ3BCdEQsWUFBVSxvQkFBVXVELE9BQVYsQ0FBa0Isb0JBQVVDLElBQTVCLEVBQWtDQyxVQUR4QjtBQUVwQm5CLGFBQVcsb0JBQVVvQixNQUZEO0FBR3BCdkQsU0FBTyxvQkFBVXdELEtBQVYsQ0FBZ0IsQ0FBQyxVQUFELEVBQWEsWUFBYixDQUFoQixDQUhhO0FBSXBCdkQsZUFBYSxvQkFBVXdELE1BSkg7QUFLcEJ2RCxZQUFVLG9CQUFVd0Q7QUFMQSxDQUF0Qjs7QUFRQXBHLFVBQVVxRyxZQUFWLEdBQXlCO0FBQ3ZCM0QsU0FBTyxVQURnQjtBQUV2QkMsZUFBYSxDQUZVO0FBR3ZCcEMsZUFBYTtBQUhVLENBQXpCOztrQkFNZVAsUyIsImZpbGUiOiJTcGxpdFBhbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjbG9uZUVsZW1lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBmaW5kRE9NTm9kZSB9IGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQgZ2xhbW9yb3VzIGZyb20gJ2dsYW1vcm91cyc7XG5pbXBvcnQgUmVzaXplciBmcm9tICcuL1Jlc2l6ZXInO1xuaW1wb3J0IFBhbmUgZnJvbSAnLi9QYW5lJztcblxuY29uc3QgQ29sdW1uU3R5bGUgPSBnbGFtb3JvdXMuZGl2KHtcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICBoZWlnaHQ6ICcxMDAlJyxcbiAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gIC8vIGZsZXg6IDEsXG4gIC8vIG91dGxpbmU6ICdub25lJyxcbiAgLy8gb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAvLyB1c2VyU2VsZWN0OiAndGV4dCcsXG5cbiAgLy8gbWluSGVpZ2h0OiAnMTAwJScsXG4gIC8vIHdpZHRoOiAnMTAwJScsXG59KTtcblxuY29uc3QgUm93U3R5bGUgPSBnbGFtb3JvdXMuZGl2KHtcbiAgZGlzcGxheTogJ2ZsZXgnLFxuICBoZWlnaHQ6ICcxMDAlJyxcbiAgZmxleERpcmVjdGlvbjogJ3JvdycsXG4gIC8vIGZsZXg6IDEsXG4gIC8vIG91dGxpbmU6ICdub25lJyxcbiAgLy8gb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAvLyB1c2VyU2VsZWN0OiAndGV4dCcsXG5cbn0pO1xuXG4vLyB0b2RvOiBtb3ZlIHV0aWxzIGZuIHRvIHNlcGFyYXRlIGZpbGVcbmZ1bmN0aW9uIGNvbnZlcnQgKHN0ciwgc2l6ZSkge1xuICBjb25zdCB0b2tlbnMgPSBzdHIubWF0Y2goLyhbMC05XSspKFtweHwlXSopLyk7XG4gIGNvbnN0IHZhbHVlID0gdG9rZW5zWzFdO1xuICBjb25zdCB1bml0ID0gdG9rZW5zWzJdO1xuICByZXR1cm4gdG9QeCh2YWx1ZSwgdW5pdCwgc2l6ZSk7XG59XG5cbmZ1bmN0aW9uIHRvUHgodmFsdWUsIHVuaXQgPSAncHgnLCBzaXplKSB7XG4gIHN3aXRjaCAodW5pdCkge1xuICAgIGNhc2UgJyUnOiB7XG4gICAgICByZXR1cm4gKHNpemUgKiB2YWx1ZSAvIDEwMCkudG9GaXhlZCgyKTtcbiAgICB9XG4gICAgZGVmYXVsdDoge1xuICAgICAgcmV0dXJuICt2YWx1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VW5pdChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSA9PT0gXCJudW1iZXJcIikge1xuICAgIHJldHVybiBcInJhdGlvXCI7XG4gIH1cblxuICBpZihzaXplLmVuZHNXaXRoKFwicHhcIikpIHtcbiAgICByZXR1cm4gXCJweFwiO1xuICB9XG5cbiAgaWYoc2l6ZS5lbmRzV2l0aChcIiVcIikpIHtcbiAgICByZXR1cm4gXCIlXCI7XG4gIH1cblxuICByZXR1cm4gXCJyYXRpb1wiO1xufVxuXG5jbGFzcyBTcGxpdFBhbmUgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIGNvbnN0IHNpemVzID0gdGhpcy5nZXRQYW5lUHJvcChcImluaXRpYWxTaXplXCIpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNpemVzXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXApO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgIC8vIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZSk7XG4gIH1cblxuICBvbk1vdXNlRG93biA9IChldmVudCwgcmVzaXplckluZGV4KSA9PiB7XG4gICAgdGhpcy5vbkRvd24ocmVzaXplckluZGV4KTtcbiAgfVxuXG4gIG9uVG91Y2hTdGFydCA9IChldmVudCwgcmVzaXplckluZGV4KSA9PiB7XG4gICAgdGhpcy5vbkRvd24ocmVzaXplckluZGV4KTtcbiAgfVxuXG4gIG9uRG93biA9IChyZXNpemVySW5kZXgpID0+IHtcbiAgICBpZiAoIXRoaXMucHJvcHMuYWxsb3dSZXNpemUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmRpbWVuc2lvbnMgPSB0aGlzLmdldFBhbmVEaW1lbnNpb25zKCk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXApO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZXNpemVySW5kZXgsXG4gICAgfSk7XG4gIH1cblxuICBvbk1vdXNlTW92ZSA9IChlKSA9PiB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB0aGlzLm9uTW92ZShlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gIH1cblxuICBvblRvdWNoTW92ZSA9IChldmVudCkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRoaXMub25Nb3ZlKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCwgZXZlbnQudG91Y2hlc1swXS5jbGllbnRZKTtcbiAgfVxuXG4gIG9uTW91c2VVcCA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5vbk1vdXNlVXApO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuXG4gICAgLy8gaWYgKG9uQ2hhbmdlKSB7XG4gICAgLy8gICBvbkNoYW5nZSh0aGlzLnN0YXRlLnNpemVzKTtcbiAgICAvLyB9XG4gIH1cblxuICBnZXRQYW5lUHJvcChrZXkpIHtcbiAgICByZXR1cm4gUmVhY3QuQ2hpbGRyZW4ubWFwKHRoaXMucHJvcHMuY2hpbGRyZW4sIGMgPT4gYy5wcm9wc1trZXldKTtcbiAgfVxuXG4gIGdldFBhbmVEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVFbGVtZW50cy5tYXAoZWwgPT4gZmluZERPTU5vZGUoZWwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgfVxuXG4gIGdldFJlc2l6ZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnJlc2l6ZXJFbGVtZW50cy5tYXAoZWwgPT4gZmluZERPTU5vZGUoZWwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKVxuICB9XG5cbiAgb25Nb3ZlKGNsaWVudFgsIGNsaWVudFkpIHtcbiAgICBjb25zdCB7IHNwbGl0LCByZXNpemVyU2l6ZSwgb25DaGFuZ2UgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyByZXNpemVySW5kZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgbWluU2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKCdtaW5TaXplJyk7XG4gICAgY29uc3QgbWF4U2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKCdtYXhTaXplJyk7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICBcbiAgICBjb25zdCBzaXplc1B4ID0gZGltZW5zaW9ucy5tYXAoZCA9PiBzcGxpdCA9PT0gXCJ2ZXJ0aWNhbFwiID8gZC53aWR0aCA6IGQuaGVpZ2h0KTtcbiAgICBcbiAgICBjb25zdCBzcGxpdFBhbmVEaW1lbnNpb25zID0gZmluZERPTU5vZGUodGhpcy5zcGxpdFBhbmUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHJlc2l6ZXJEaW1lbnNpb25zID0gdGhpcy5nZXRSZXNpemVyRGltZW5zaW9ucygpW3Jlc2l6ZXJJbmRleF07XG5cbiAgICBsZXQgc2l6ZXMgPSB0aGlzLnN0YXRlLnNpemVzLmNvbmNhdCgpO1xuICAgIFxuICAgIGNvbnN0IHByaW1hcnlVbml0ID0gZ2V0VW5pdChzaXplc1tyZXNpemVySW5kZXhdKTtcbiAgICBjb25zdCBzZWNvbmRhcnlVbml0ID0gZ2V0VW5pdChzaXplc1tyZXNpemVySW5kZXggKyAxXSk7XG4gICAgY29uc3QgcHJpbWFyeSA9IGRpbWVuc2lvbnNbcmVzaXplckluZGV4XTtcbiAgICBjb25zdCBzZWNvbmRhcnkgPSBkaW1lbnNpb25zW3Jlc2l6ZXJJbmRleCArIDFdO1xuICAgIFxuXG4gICAgaWYgKFxuICAgICAgKHNwbGl0ID09PSAndmVydGljYWwnICYmXG4gICAgICAgIGNsaWVudFggPj0gcHJpbWFyeS5sZWZ0ICYmXG4gICAgICAgIGNsaWVudFggPD0gc2Vjb25kYXJ5LnJpZ2h0KSB8fFxuICAgICAgKHNwbGl0ICE9PSAndmVydGljYWwnICYmXG4gICAgICAgIGNsaWVudFkgPj0gcHJpbWFyeS50b3AgJiZcbiAgICAgICAgY2xpZW50WSA8PSBzZWNvbmRhcnkuYm90dG9tKVxuICAgICkge1xuICAgICAgbGV0IHByaW1hcnlTaXplO1xuICAgICAgbGV0IHNlY29uZGFyeVNpemU7XG4gICAgICBsZXQgc3BsaXRQYW5lU2l6ZTtcblxuICAgICAgaWYgKHNwbGl0ID09PSAndmVydGljYWwnKSB7XG4gICAgICAgIGNvbnN0IHJlc2l6ZXJMZWZ0ID0gY2xpZW50WCAtIChyZXNpemVyU2l6ZSAvIDIpO1xuICAgICAgICBjb25zdCByZXNpemVyUmlnaHQgPSBjbGllbnRYICsgKHJlc2l6ZXJTaXplIC8gMik7XG5cbiAgICAgICAgcHJpbWFyeVNpemUgPSByZXNpemVyTGVmdCAtIHByaW1hcnkubGVmdDtcbiAgICAgICAgc2Vjb25kYXJ5U2l6ZSA9IHNlY29uZGFyeS5yaWdodCAtIHJlc2l6ZXJSaWdodDtcbiAgICAgICAgc3BsaXRQYW5lU2l6ZSA9IHNwbGl0UGFuZURpbWVuc2lvbnMud2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXNpemVyVG9wID0gY2xpZW50WSAtIChyZXNpemVyU2l6ZSAvIDIpO1xuICAgICAgICBjb25zdCByZXNpemVyQm90dG9tID0gY2xpZW50WSArIChyZXNpemVyU2l6ZSAvIDIpO1xuXG4gICAgICAgIHByaW1hcnlTaXplID0gcmVzaXplclRvcCAtIHByaW1hcnkudG9wO1xuICAgICAgICBzZWNvbmRhcnlTaXplID0gc2Vjb25kYXJ5LmJvdHRvbSAtIHJlc2l6ZXJCb3R0b207XG4gICAgICAgIHNwbGl0UGFuZVNpemUgPSBzcGxpdFBhbmVEaW1lbnNpb25zLmhlaWdodDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJpbWFyeU1pblNpemUgPSBjb252ZXJ0KG1pblNpemVzW3Jlc2l6ZXJJbmRleF0sIHNwbGl0UGFuZVNpemUpO1xuICAgICAgY29uc3Qgc2Vjb25kYXJ5TWluU2l6ZSA9IGNvbnZlcnQobWluU2l6ZXNbcmVzaXplckluZGV4ICsgMV0sIHNwbGl0UGFuZVNpemUpO1xuXG4gICAgICBjb25zdCBwcmltYXJ5TWF4U2l6ZSA9IGNvbnZlcnQobWF4U2l6ZXNbcmVzaXplckluZGV4XSwgc3BsaXRQYW5lU2l6ZSk7XG4gICAgICBjb25zdCBzZWNvbmRhcnlNYXhTaXplID0gY29udmVydChtYXhTaXplc1tyZXNpemVySW5kZXggKyAxXSwgc3BsaXRQYW5lU2l6ZSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgcHJpbWFyeU1pblNpemUgPD0gcHJpbWFyeVNpemUgJiZcbiAgICAgICAgcHJpbWFyeU1heFNpemUgPj0gcHJpbWFyeVNpemUgJiZcbiAgICAgICAgc2Vjb25kYXJ5TWluU2l6ZSA8PSBzZWNvbmRhcnlTaXplICYmXG4gICAgICAgIHNlY29uZGFyeU1heFNpemUgPj0gc2Vjb25kYXJ5U2l6ZVxuICAgICAgKSB7XG4gICAgICAgIHNpemVzUHhbcmVzaXplckluZGV4XSA9IHByaW1hcnlTaXplO1xuICAgICAgICBzaXplc1B4W3Jlc2l6ZXJJbmRleCArIDFdID0gc2Vjb25kYXJ5U2l6ZTtcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAocHJpbWFyeVVuaXQgIT09IFwicmF0aW9cIikge1xuICAgICAgICAgIHNpemVzW3Jlc2l6ZXJJbmRleF0gPSB0aGlzLmNvbnZlcnRVbml0cyhwcmltYXJ5U2l6ZSwgcHJpbWFyeVVuaXQsIHNwbGl0UGFuZVNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNpemVzID0gc2l6ZXMubWFwKChzLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGlmIChnZXRVbml0KHMpID09PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICAgICAgcyA9ICtzaXplc1B4W2lkeF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlY29uZGFyeVVuaXQgIT09IFwicmF0aW9cIikge1xuICAgICAgICAgIHNpemVzW3Jlc2l6ZXJJbmRleCArIDFdID0gdGhpcy5jb252ZXJ0VW5pdHMoc2Vjb25kYXJ5U2l6ZSwgc2Vjb25kYXJ5VW5pdCwgc3BsaXRQYW5lU2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2l6ZXMgPSBzaXplcy5tYXAoKHMsIGlkeCkgPT4ge1xuICAgICAgICAgICAgaWYgKGdldFVuaXQocykgPT09IFwicmF0aW9cIikge1xuICAgICAgICAgICAgICBzID0gK3NpemVzUHhbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2l6ZXN9KTtcblxuICAgICAgICBpZiAob25DaGFuZ2UpIHtcbiAgICAgICAgICBvbkNoYW5nZShzaXplcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb252ZXJ0VW5pdHMoc2l6ZSwgdW5pdCwgY29udGFpbmVyU2l6ZSkge1xuICAgIHN3aXRjaCh1bml0KSB7XG4gICAgICBjYXNlIFwiJVwiOlxuICAgICAgICByZXR1cm4gYCR7c2l6ZS9jb250YWluZXJTaXplKjEwMH0lYDtcbiAgICAgIGNhc2UgXCJweFwiOlxuICAgICAgICByZXR1cm4gYCR7c2l6ZX1weGA7XG4gICAgICBjYXNlIFwicmF0aW9cIjpcbiAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgfVxuICB9XG5cbiAgc2V0UGFuZVJlZiA9IChpZHgsIGVsKSA9PiB7XG4gICAgaWYgKCF0aGlzLnBhbmVFbGVtZW50cykge1xuICAgICAgdGhpcy5wYW5lRWxlbWVudHMgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLnBhbmVFbGVtZW50c1tpZHhdID0gZWw7XG4gIH1cblxuICBzZXRSZXNpemVyUmVmID0gKGlkeCwgZWwpID0+IHtcbiAgICBpZiAoIXRoaXMucmVzaXplckVsZW1lbnRzKSB7XG4gICAgICB0aGlzLnJlc2l6ZXJFbGVtZW50cyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMucmVzaXplckVsZW1lbnRzW2lkeF0gPSBlbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIHNwbGl0IH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgcmF0aW9zLCBzaXplcyB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGxldCBwYW5lSW5kZXggPSAwO1xuICAgIGxldCByZXNpemVySW5kZXggPSAwO1xuXG4gICAgY29uc3QgZWxlbWVudHMgPSBjaGlsZHJlbi5yZWR1Y2UoKGFjYywgY2hpbGQpID0+IHtcbiAgICAgIC8vIGNvbnN0IHNpemUgPSBzaXplc1twYW5lSW5kZXhdID8gc2l6ZXNbcGFuZUluZGV4XSA6IDA7XG4gICAgICBsZXQgcGFuZTtcbiAgICAgIGNvbnN0IGlzUGFuZSA9IGNoaWxkLnR5cGUgPT09IFBhbmU7XG4gICAgICBjb25zdCBwYW5lUHJvcHMgPSB7XG4gICAgICAgIGluZGV4OiBwYW5lSW5kZXgsXG4gICAgICAgICdkYXRhLXR5cGUnOiAnUGFuZScsXG4gICAgICAgIC8vIHNpemU6IHNpemUsXG4gICAgICAgIHNwbGl0OiBzcGxpdCxcbiAgICAgICAga2V5OiBgUGFuZS0ke3BhbmVJbmRleH1gLFxuICAgICAgICByZWY6IHRoaXMuc2V0UGFuZVJlZi5iaW5kKG51bGwsIHBhbmVJbmRleClcbiAgICAgIH07XG4gICAgICBpZiAoaXNQYW5lKSB7XG4gICAgICAgIHBhbmUgPSBjbG9uZUVsZW1lbnQoY2hpbGQsIHBhbmVQcm9wcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYW5lID0gPFBhbmUgey4uLnBhbmVQcm9wc30+e2NoaWxkfTwvUGFuZT47XG4gICAgICB9XG4gICAgICBwYW5lSW5kZXgrKztcbiAgICAgIGlmIChhY2MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbLi4uYWNjLCBwYW5lXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlc2l6ZXIgPSAoXG4gICAgICAgICAgPFJlc2l6ZXJcbiAgICAgICAgICAgIGluZGV4PXtyZXNpemVySW5kZXh9XG4gICAgICAgICAgICBrZXk9e2BSZXNpemVyLSR7cmVzaXplckluZGV4fWB9XG4gICAgICAgICAgICByZWY9e3RoaXMuc2V0UmVzaXplclJlZi5iaW5kKG51bGwsIHJlc2l6ZXJJbmRleCl9XG4gICAgICAgICAgICBzcGxpdD17c3BsaXR9XG4gICAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5vbk1vdXNlRG93bn1cbiAgICAgICAgICAgIC8vIG9uVG91Y2hTdGFydD17dGhpcy5vblRvdWNoU3RhcnR9XG4gICAgICAgICAgICAvLyBvblRvdWNoRW5kPXt0aGlzLm9uTW91c2VVcH1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgICByZXNpemVySW5kZXgrKztcbiAgICAgICAgcmV0dXJuIFsuLi5hY2MsIHJlc2l6ZXIsIHBhbmVdO1xuICAgICAgfVxuICAgIH0sIFtdKTtcblxuICAgIGlmIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFJvd1N0eWxlXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgICAgZGF0YS10eXBlPVwiU3BsaXRQYW5lXCJcbiAgICAgICAgICBkYXRhLXNwbGl0PXtzcGxpdH1cbiAgICAgICAgICByZWY9e3NwbGl0UGFuZSA9PiAodGhpcy5zcGxpdFBhbmUgPSBzcGxpdFBhbmUpfVxuICAgICAgICA+XG4gICAgICAgICAge2VsZW1lbnRzfVxuICAgICAgICA8L1Jvd1N0eWxlPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbHVtblN0eWxlXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgICAgZGF0YS10eXBlPVwiU3BsaXRQYW5lXCJcbiAgICAgICAgICBkYXRhLXNwbGl0PXtzcGxpdH1cbiAgICAgICAgICByZWY9e3NwbGl0UGFuZSA9PiAodGhpcy5zcGxpdFBhbmUgPSBzcGxpdFBhbmUpfVxuICAgICAgICA+XG4gICAgICAgICAge2VsZW1lbnRzfVxuICAgICAgICA8L0NvbHVtblN0eWxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuU3BsaXRQYW5lLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5ub2RlKS5pc1JlcXVpcmVkLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNwbGl0OiBQcm9wVHlwZXMub25lT2YoWyd2ZXJ0aWNhbCcsICdob3Jpem9udGFsJ10pLFxuICByZXNpemVyU2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jXG59O1xuXG5TcGxpdFBhbmUuZGVmYXVsdFByb3BzID0ge1xuICBzcGxpdDogJ3ZlcnRpY2FsJyxcbiAgcmVzaXplclNpemU6IDEsXG4gIGFsbG93UmVzaXplOiB0cnVlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTcGxpdFBhbmU7XG4iXX0=