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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TcGxpdFBhbmUuanMiXSwibmFtZXMiOlsiQ29sdW1uU3R5bGUiLCJkaXYiLCJkaXNwbGF5IiwiaGVpZ2h0IiwiZmxleERpcmVjdGlvbiIsImZsZXgiLCJvdXRsaW5lIiwib3ZlcmZsb3ciLCJ1c2VyU2VsZWN0IiwibWluSGVpZ2h0Iiwid2lkdGgiLCJSb3dTdHlsZSIsImNvbnZlcnQiLCJzdHIiLCJzaXplIiwidG9rZW5zIiwibWF0Y2giLCJ2YWx1ZSIsInVuaXQiLCJ0b1B4IiwidG9GaXhlZCIsImdldFVuaXQiLCJlbmRzV2l0aCIsIlNwbGl0UGFuZSIsInByb3BzIiwib25Nb3VzZURvd24iLCJldmVudCIsInJlc2l6ZXJJbmRleCIsIm9uRG93biIsIm9uVG91Y2hTdGFydCIsImFsbG93UmVzaXplIiwiZGltZW5zaW9ucyIsImdldFBhbmVEaW1lbnNpb25zIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJzZXRTdGF0ZSIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsIm9uTW92ZSIsImNsaWVudFgiLCJjbGllbnRZIiwib25Ub3VjaE1vdmUiLCJ0b3VjaGVzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsInNldFBhbmVSZWYiLCJpZHgiLCJlbCIsInBhbmVFbGVtZW50cyIsInNldFJlc2l6ZXJSZWYiLCJyZXNpemVyRWxlbWVudHMiLCJzaXplcyIsImdldFBhbmVQcm9wIiwic3RhdGUiLCJuZXh0UHJvcHMiLCJ3aW5kb3ciLCJyZXNpemUiLCJrZXkiLCJDaGlsZHJlbiIsIm1hcCIsImNoaWxkcmVuIiwiYyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNwbGl0IiwicmVzaXplclNpemUiLCJvbkNoYW5nZSIsIm1pblNpemVzIiwibWF4U2l6ZXMiLCJzaXplc1B4IiwiZCIsInNwbGl0UGFuZURpbWVuc2lvbnMiLCJzcGxpdFBhbmUiLCJyZXNpemVyRGltZW5zaW9ucyIsImdldFJlc2l6ZXJEaW1lbnNpb25zIiwiY29uY2F0IiwicHJpbWFyeVVuaXQiLCJzZWNvbmRhcnlVbml0IiwicHJpbWFyeSIsInNlY29uZGFyeSIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsInByaW1hcnlTaXplIiwic2Vjb25kYXJ5U2l6ZSIsInNwbGl0UGFuZVNpemUiLCJyZXNpemVyTGVmdCIsInJlc2l6ZXJSaWdodCIsInJlc2l6ZXJUb3AiLCJyZXNpemVyQm90dG9tIiwicHJpbWFyeU1pblNpemUiLCJzZWNvbmRhcnlNaW5TaXplIiwicHJpbWFyeU1heFNpemUiLCJzZWNvbmRhcnlNYXhTaXplIiwiY29udmVydFVuaXRzIiwicyIsImNvbnRhaW5lclNpemUiLCJjbGFzc05hbWUiLCJyYXRpb3MiLCJwYW5lSW5kZXgiLCJlbGVtZW50cyIsInJlZHVjZSIsImFjYyIsImNoaWxkIiwicGFuZSIsImlzUGFuZSIsInR5cGUiLCJwYW5lUHJvcHMiLCJpbmRleCIsInJlZiIsImJpbmQiLCJsZW5ndGgiLCJyZXNpemVyIiwicHJvcFR5cGVzIiwiYXJyYXlPZiIsIm5vZGUiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwib25lT2YiLCJudW1iZXIiLCJmdW5jIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsY0FBYyxvQkFBVUMsR0FBVixDQUFjO0FBQ2hDQyxXQUFTLE1BRHVCO0FBRWhDQyxVQUFRLE1BRndCO0FBR2hDQyxpQkFBZSxRQUhpQjtBQUloQ0MsUUFBTSxDQUowQjtBQUtoQ0MsV0FBUyxNQUx1QjtBQU1oQ0MsWUFBVSxRQU5zQjtBQU9oQ0MsY0FBWSxNQVBvQjs7QUFTaENDLGFBQVcsTUFUcUI7QUFVaENDLFNBQU87QUFWeUIsQ0FBZCxDQUFwQjs7QUFhQSxJQUFNQyxXQUFXLG9CQUFVVixHQUFWLENBQWM7QUFDN0JDLFdBQVMsTUFEb0I7QUFF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QUFVb0csWUFBVixHQUF5QjtBQUN2QjFELFNBQU8sVUFEZ0I7QUFFdkJDLGVBQWEsQ0FGVTtBQUd2QnBDLGVBQWE7QUFIVSxDQUF6Qjs7a0JBTWVQLFMiLCJmaWxlIjoiU3BsaXRQYW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY2xvbmVFbGVtZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmluZERPTU5vZGUgfSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IGdsYW1vcm91cyBmcm9tICdnbGFtb3JvdXMnO1xuaW1wb3J0IFJlc2l6ZXIgZnJvbSAnLi9SZXNpemVyJztcbmltcG9ydCBQYW5lIGZyb20gJy4vUGFuZSc7XG5cbmNvbnN0IENvbHVtblN0eWxlID0gZ2xhbW9yb3VzLmRpdih7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICBmbGV4OiAxLFxuICBvdXRsaW5lOiAnbm9uZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdXNlclNlbGVjdDogJ3RleHQnLFxuXG4gIG1pbkhlaWdodDogJzEwMCUnLFxuICB3aWR0aDogJzEwMCUnLFxufSk7XG5cbmNvbnN0IFJvd1N0eWxlID0gZ2xhbW9yb3VzLmRpdih7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICBmbGV4OiAxLFxuICBvdXRsaW5lOiAnbm9uZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdXNlclNlbGVjdDogJ3RleHQnLFxuXG59KTtcblxuLy8gdG9kbzogbW92ZSB1dGlscyBmbiB0byBzZXBhcmF0ZSBmaWxlXG5mdW5jdGlvbiBjb252ZXJ0IChzdHIsIHNpemUpIHtcbiAgY29uc3QgdG9rZW5zID0gc3RyLm1hdGNoKC8oWzAtOV0rKShbcHh8JV0qKS8pO1xuICBjb25zdCB2YWx1ZSA9IHRva2Vuc1sxXTtcbiAgY29uc3QgdW5pdCA9IHRva2Vuc1syXTtcbiAgcmV0dXJuIHRvUHgodmFsdWUsIHVuaXQsIHNpemUpO1xufVxuXG5mdW5jdGlvbiB0b1B4KHZhbHVlLCB1bml0ID0gJ3B4Jywgc2l6ZSkge1xuICBzd2l0Y2ggKHVuaXQpIHtcbiAgICBjYXNlICclJzoge1xuICAgICAgcmV0dXJuIChzaXplICogdmFsdWUgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHJldHVybiArdmFsdWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFVuaXQoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gXCJyYXRpb1wiO1xuICB9XG5cbiAgaWYoc2l6ZS5lbmRzV2l0aChcInB4XCIpKSB7XG4gICAgcmV0dXJuIFwicHhcIjtcbiAgfVxuXG4gIGlmKHNpemUuZW5kc1dpdGgoXCIlXCIpKSB7XG4gICAgcmV0dXJuIFwiJVwiO1xuICB9XG5cbiAgcmV0dXJuIFwicmF0aW9cIjtcbn1cblxuY2xhc3MgU3BsaXRQYW5lIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICBjb25zdCBzaXplcyA9IHRoaXMuZ2V0UGFuZVByb3AoXCJpbml0aWFsU2l6ZVwiKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzaXplc1xuICAgIH07XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIFxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcbiAgICAvLyBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5yZXNpemUpO1xuICB9XG5cbiAgb25Nb3VzZURvd24gPSAoZXZlbnQsIHJlc2l6ZXJJbmRleCkgPT4ge1xuICAgIHRoaXMub25Eb3duKHJlc2l6ZXJJbmRleCk7XG4gIH1cblxuICBvblRvdWNoU3RhcnQgPSAoZXZlbnQsIHJlc2l6ZXJJbmRleCkgPT4ge1xuICAgIHRoaXMub25Eb3duKHJlc2l6ZXJJbmRleCk7XG4gIH1cblxuICBvbkRvd24gPSAocmVzaXplckluZGV4KSA9PiB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmFsbG93UmVzaXplKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kaW1lbnNpb25zID0gdGhpcy5nZXRQYW5lRGltZW5zaW9ucygpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVzaXplckluZGV4LFxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5vbk1vdmUoZS5jbGllbnRYLCBlLmNsaWVudFkpO1xuICB9XG5cbiAgb25Ub3VjaE1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLm9uTW92ZShldmVudC50b3VjaGVzWzBdLmNsaWVudFgsIGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSk7XG4gIH1cblxuICBvbk1vdXNlVXAgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcblxuICAgIC8vIGlmIChvbkNoYW5nZSkge1xuICAgIC8vICAgb25DaGFuZ2UodGhpcy5zdGF0ZS5zaXplcyk7XG4gICAgLy8gfVxuICB9XG5cbiAgZ2V0UGFuZVByb3Aoa2V5KSB7XG4gICAgcmV0dXJuIFJlYWN0LkNoaWxkcmVuLm1hcCh0aGlzLnByb3BzLmNoaWxkcmVuLCBjID0+IGMucHJvcHNba2V5XSk7XG4gIH1cblxuICBnZXRQYW5lRGltZW5zaW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lRWxlbWVudHMubWFwKGVsID0+IGZpbmRET01Ob2RlKGVsKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gIH1cblxuICBnZXRSZXNpemVyRGltZW5zaW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNpemVyRWxlbWVudHMubWFwKGVsID0+IGZpbmRET01Ob2RlKGVsKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSlcbiAgfVxuXG4gIG9uTW92ZShjbGllbnRYLCBjbGllbnRZKSB7XG4gICAgY29uc3QgeyBzcGxpdCwgcmVzaXplclNpemUsIG9uQ2hhbmdlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgcmVzaXplckluZGV4IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IG1pblNpemVzID0gdGhpcy5nZXRQYW5lUHJvcCgnbWluU2l6ZScpO1xuICAgIGNvbnN0IG1heFNpemVzID0gdGhpcy5nZXRQYW5lUHJvcCgnbWF4U2l6ZScpO1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB0aGlzLmRpbWVuc2lvbnM7XG4gICAgXG4gICAgY29uc3Qgc2l6ZXNQeCA9IGRpbWVuc2lvbnMubWFwKGQgPT4gc3BsaXQgPT09IFwidmVydGljYWxcIiA/IGQud2lkdGggOiBkLmhlaWdodCk7XG4gICAgXG4gICAgY29uc3Qgc3BsaXRQYW5lRGltZW5zaW9ucyA9IGZpbmRET01Ob2RlKHRoaXMuc3BsaXRQYW5lKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCByZXNpemVyRGltZW5zaW9ucyA9IHRoaXMuZ2V0UmVzaXplckRpbWVuc2lvbnMoKVtyZXNpemVySW5kZXhdO1xuXG4gICAgbGV0IHNpemVzID0gdGhpcy5zdGF0ZS5zaXplcy5jb25jYXQoKTtcbiAgICBcbiAgICBjb25zdCBwcmltYXJ5VW5pdCA9IGdldFVuaXQoc2l6ZXNbcmVzaXplckluZGV4XSk7XG4gICAgY29uc3Qgc2Vjb25kYXJ5VW5pdCA9IGdldFVuaXQoc2l6ZXNbcmVzaXplckluZGV4ICsgMV0pO1xuICAgIGNvbnN0IHByaW1hcnkgPSBkaW1lbnNpb25zW3Jlc2l6ZXJJbmRleF07XG4gICAgY29uc3Qgc2Vjb25kYXJ5ID0gZGltZW5zaW9uc1tyZXNpemVySW5kZXggKyAxXTtcbiAgICBcblxuICAgIGlmIChcbiAgICAgIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJyAmJlxuICAgICAgICBjbGllbnRYID49IHByaW1hcnkubGVmdCAmJlxuICAgICAgICBjbGllbnRYIDw9IHNlY29uZGFyeS5yaWdodCkgfHxcbiAgICAgIChzcGxpdCAhPT0gJ3ZlcnRpY2FsJyAmJlxuICAgICAgICBjbGllbnRZID49IHByaW1hcnkudG9wICYmXG4gICAgICAgIGNsaWVudFkgPD0gc2Vjb25kYXJ5LmJvdHRvbSlcbiAgICApIHtcbiAgICAgIGxldCBwcmltYXJ5U2l6ZTtcbiAgICAgIGxldCBzZWNvbmRhcnlTaXplO1xuICAgICAgbGV0IHNwbGl0UGFuZVNpemU7XG5cbiAgICAgIGlmIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICBjb25zdCByZXNpemVyTGVmdCA9IGNsaWVudFggLSAocmVzaXplclNpemUgLyAyKTtcbiAgICAgICAgY29uc3QgcmVzaXplclJpZ2h0ID0gY2xpZW50WCArIChyZXNpemVyU2l6ZSAvIDIpO1xuXG4gICAgICAgIHByaW1hcnlTaXplID0gcmVzaXplckxlZnQgLSBwcmltYXJ5LmxlZnQ7XG4gICAgICAgIHNlY29uZGFyeVNpemUgPSBzZWNvbmRhcnkucmlnaHQgLSByZXNpemVyUmlnaHQ7XG4gICAgICAgIHNwbGl0UGFuZVNpemUgPSBzcGxpdFBhbmVEaW1lbnNpb25zLndpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzaXplclRvcCA9IGNsaWVudFkgLSAocmVzaXplclNpemUgLyAyKTtcbiAgICAgICAgY29uc3QgcmVzaXplckJvdHRvbSA9IGNsaWVudFkgKyAocmVzaXplclNpemUgLyAyKTtcblxuICAgICAgICBwcmltYXJ5U2l6ZSA9IHJlc2l6ZXJUb3AgLSBwcmltYXJ5LnRvcDtcbiAgICAgICAgc2Vjb25kYXJ5U2l6ZSA9IHNlY29uZGFyeS5ib3R0b20gLSByZXNpemVyQm90dG9tO1xuICAgICAgICBzcGxpdFBhbmVTaXplID0gc3BsaXRQYW5lRGltZW5zaW9ucy5oZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByaW1hcnlNaW5TaXplID0gY29udmVydChtaW5TaXplc1tyZXNpemVySW5kZXhdLCBzcGxpdFBhbmVTaXplKTtcbiAgICAgIGNvbnN0IHNlY29uZGFyeU1pblNpemUgPSBjb252ZXJ0KG1pblNpemVzW3Jlc2l6ZXJJbmRleCArIDFdLCBzcGxpdFBhbmVTaXplKTtcblxuICAgICAgY29uc3QgcHJpbWFyeU1heFNpemUgPSBjb252ZXJ0KG1heFNpemVzW3Jlc2l6ZXJJbmRleF0sIHNwbGl0UGFuZVNpemUpO1xuICAgICAgY29uc3Qgc2Vjb25kYXJ5TWF4U2l6ZSA9IGNvbnZlcnQobWF4U2l6ZXNbcmVzaXplckluZGV4ICsgMV0sIHNwbGl0UGFuZVNpemUpO1xuXG4gICAgICBpZiAoXG4gICAgICAgIHByaW1hcnlNaW5TaXplIDw9IHByaW1hcnlTaXplICYmXG4gICAgICAgIHByaW1hcnlNYXhTaXplID49IHByaW1hcnlTaXplICYmXG4gICAgICAgIHNlY29uZGFyeU1pblNpemUgPD0gc2Vjb25kYXJ5U2l6ZSAmJlxuICAgICAgICBzZWNvbmRhcnlNYXhTaXplID49IHNlY29uZGFyeVNpemVcbiAgICAgICkge1xuICAgICAgICBzaXplc1B4W3Jlc2l6ZXJJbmRleF0gPSBwcmltYXJ5U2l6ZTtcbiAgICAgICAgc2l6ZXNQeFtyZXNpemVySW5kZXggKyAxXSA9IHNlY29uZGFyeVNpemU7XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKHByaW1hcnlVbml0ICE9PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICBzaXplc1tyZXNpemVySW5kZXhdID0gdGhpcy5jb252ZXJ0VW5pdHMocHJpbWFyeVNpemUsIHByaW1hcnlVbml0LCBzcGxpdFBhbmVTaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzaXplcyA9IHNpemVzLm1hcCgocywgaWR4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZ2V0VW5pdChzKSA9PT0gXCJyYXRpb1wiKSB7XG4gICAgICAgICAgICAgIHMgPSArc2l6ZXNQeFtpZHhdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWNvbmRhcnlVbml0ICE9PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICBzaXplc1tyZXNpemVySW5kZXggKyAxXSA9IHRoaXMuY29udmVydFVuaXRzKHNlY29uZGFyeVNpemUsIHNlY29uZGFyeVVuaXQsIHNwbGl0UGFuZVNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNpemVzID0gc2l6ZXMubWFwKChzLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGlmIChnZXRVbml0KHMpID09PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICAgICAgcyA9ICtzaXplc1B4W2lkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3NpemVzfSk7XG5cbiAgICAgICAgaWYgKG9uQ2hhbmdlKSB7XG4gICAgICAgICAgb25DaGFuZ2Uoc2l6ZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29udmVydFVuaXRzKHNpemUsIHVuaXQsIGNvbnRhaW5lclNpemUpIHtcbiAgICBzd2l0Y2godW5pdCkge1xuICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgcmV0dXJuIGAke3NpemUvY29udGFpbmVyU2l6ZSoxMDB9JWA7XG4gICAgICBjYXNlIFwicHhcIjpcbiAgICAgICAgcmV0dXJuIGAke3NpemV9cHhgO1xuICAgICAgY2FzZSBcInJhdGlvXCI6XG4gICAgICAgIHJldHVybiBzaXplO1xuICAgIH1cbiAgfVxuXG4gIHNldFBhbmVSZWYgPSAoaWR4LCBlbCkgPT4ge1xuICAgIGlmICghdGhpcy5wYW5lRWxlbWVudHMpIHtcbiAgICAgIHRoaXMucGFuZUVsZW1lbnRzID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5wYW5lRWxlbWVudHNbaWR4XSA9IGVsO1xuICB9XG5cbiAgc2V0UmVzaXplclJlZiA9IChpZHgsIGVsKSA9PiB7XG4gICAgaWYgKCF0aGlzLnJlc2l6ZXJFbGVtZW50cykge1xuICAgICAgdGhpcy5yZXNpemVyRWxlbWVudHMgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLnJlc2l6ZXJFbGVtZW50c1tpZHhdID0gZWw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBzcGxpdCB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHJhdGlvcywgc2l6ZXMgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBsZXQgcGFuZUluZGV4ID0gMDtcbiAgICBsZXQgcmVzaXplckluZGV4ID0gMDtcblxuICAgIGNvbnN0IGVsZW1lbnRzID0gY2hpbGRyZW4ucmVkdWNlKChhY2MsIGNoaWxkKSA9PiB7XG4gICAgICAvLyBjb25zdCBzaXplID0gc2l6ZXNbcGFuZUluZGV4XSA/IHNpemVzW3BhbmVJbmRleF0gOiAwO1xuICAgICAgbGV0IHBhbmU7XG4gICAgICBjb25zdCBpc1BhbmUgPSBjaGlsZC50eXBlID09PSBQYW5lO1xuICAgICAgY29uc3QgcGFuZVByb3BzID0ge1xuICAgICAgICBpbmRleDogcGFuZUluZGV4LFxuICAgICAgICAnZGF0YS10eXBlJzogJ1BhbmUnLFxuICAgICAgICAvLyBzaXplOiBzaXplLFxuICAgICAgICBzcGxpdDogc3BsaXQsXG4gICAgICAgIGtleTogYFBhbmUtJHtwYW5lSW5kZXh9YCxcbiAgICAgICAgcmVmOiB0aGlzLnNldFBhbmVSZWYuYmluZChudWxsLCBwYW5lSW5kZXgpXG4gICAgICB9O1xuICAgICAgaWYgKGlzUGFuZSkge1xuICAgICAgICBwYW5lID0gY2xvbmVFbGVtZW50KGNoaWxkLCBwYW5lUHJvcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFuZSA9IDxQYW5lIHsuLi5wYW5lUHJvcHN9PntjaGlsZH08L1BhbmU+O1xuICAgICAgfVxuICAgICAgcGFuZUluZGV4Kys7XG4gICAgICBpZiAoYWNjLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gWy4uLmFjYywgcGFuZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXNpemVyID0gKFxuICAgICAgICAgIDxSZXNpemVyXG4gICAgICAgICAgICBpbmRleD17cmVzaXplckluZGV4fVxuICAgICAgICAgICAga2V5PXtgUmVzaXplci0ke3Jlc2l6ZXJJbmRleH1gfVxuICAgICAgICAgICAgcmVmPXt0aGlzLnNldFJlc2l6ZXJSZWYuYmluZChudWxsLCByZXNpemVySW5kZXgpfVxuICAgICAgICAgICAgc3BsaXQ9e3NwbGl0fVxuICAgICAgICAgICAgb25Nb3VzZURvd249e3RoaXMub25Nb3VzZURvd259XG4gICAgICAgICAgICAvLyBvblRvdWNoU3RhcnQ9e3RoaXMub25Ub3VjaFN0YXJ0fVxuICAgICAgICAgICAgLy8gb25Ub3VjaEVuZD17dGhpcy5vbk1vdXNlVXB9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgICAgcmVzaXplckluZGV4Kys7XG4gICAgICAgIHJldHVybiBbLi4uYWNjLCByZXNpemVyLCBwYW5lXTtcbiAgICAgIH1cbiAgICB9LCBbXSk7XG5cbiAgICBpZiAoc3BsaXQgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxSb3dTdHlsZVxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgICAgIGRhdGEtdHlwZT1cIlNwbGl0UGFuZVwiXG4gICAgICAgICAgZGF0YS1zcGxpdD17c3BsaXR9XG4gICAgICAgICAgcmVmPXtzcGxpdFBhbmUgPT4gKHRoaXMuc3BsaXRQYW5lID0gc3BsaXRQYW5lKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtlbGVtZW50c31cbiAgICAgICAgPC9Sb3dTdHlsZT5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb2x1bW5TdHlsZVxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgICAgIGRhdGEtdHlwZT1cIlNwbGl0UGFuZVwiXG4gICAgICAgICAgZGF0YS1zcGxpdD17c3BsaXR9XG4gICAgICAgICAgcmVmPXtzcGxpdFBhbmUgPT4gKHRoaXMuc3BsaXRQYW5lID0gc3BsaXRQYW5lKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtlbGVtZW50c31cbiAgICAgICAgPC9Db2x1bW5TdHlsZT5cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cblNwbGl0UGFuZS5wcm9wVHlwZXMgPSB7XG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubm9kZSkuaXNSZXF1aXJlZCxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzcGxpdDogUHJvcFR5cGVzLm9uZU9mKFsndmVydGljYWwnLCAnaG9yaXpvbnRhbCddKSxcbiAgcmVzaXplclNpemU6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xufTtcblxuU3BsaXRQYW5lLmRlZmF1bHRQcm9wcyA9IHtcbiAgc3BsaXQ6ICd2ZXJ0aWNhbCcsXG4gIHJlc2l6ZXJTaXplOiAxLFxuICBhbGxvd1Jlc2l6ZTogdHJ1ZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU3BsaXRQYW5lO1xuIl19