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

    var sizes = _this.getPaneProp("initialSize", props);

    _this.state = {
      sizes: sizes
    };
    return _this;
  }

  _createClass(SplitPane, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ sizes: this.getPaneProp("initialSize", nextProps) });
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
    value: function getPaneProp(key, props) {
      return _react2.default.Children.map(props.children, function (c) {
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

      var minSizes = this.getPaneProp('minSize', this.props);
      var maxSizes = this.getPaneProp('maxSize', this.props);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TcGxpdFBhbmUuanMiXSwibmFtZXMiOlsiQ29sdW1uU3R5bGUiLCJkaXYiLCJkaXNwbGF5IiwiaGVpZ2h0IiwiZmxleERpcmVjdGlvbiIsImZsZXgiLCJvdXRsaW5lIiwib3ZlcmZsb3ciLCJ1c2VyU2VsZWN0IiwibWluSGVpZ2h0Iiwid2lkdGgiLCJSb3dTdHlsZSIsImNvbnZlcnQiLCJzdHIiLCJzaXplIiwidG9rZW5zIiwibWF0Y2giLCJ2YWx1ZSIsInVuaXQiLCJ0b1B4IiwidG9GaXhlZCIsImdldFVuaXQiLCJlbmRzV2l0aCIsIlNwbGl0UGFuZSIsInByb3BzIiwib25Nb3VzZURvd24iLCJldmVudCIsInJlc2l6ZXJJbmRleCIsIm9uRG93biIsIm9uVG91Y2hTdGFydCIsImFsbG93UmVzaXplIiwib25SZXNpemVTdGFydCIsImRpbWVuc2lvbnMiLCJnZXRQYW5lRGltZW5zaW9ucyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVVwIiwic2V0U3RhdGUiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJvbk1vdmUiLCJjbGllbnRYIiwiY2xpZW50WSIsIm9uVG91Y2hNb3ZlIiwidG91Y2hlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblJlc2l6ZUVuZCIsInNldFBhbmVSZWYiLCJpZHgiLCJlbCIsInBhbmVFbGVtZW50cyIsInNldFJlc2l6ZXJSZWYiLCJyZXNpemVyRWxlbWVudHMiLCJzaXplcyIsImdldFBhbmVQcm9wIiwic3RhdGUiLCJuZXh0UHJvcHMiLCJ3aW5kb3ciLCJyZXNpemUiLCJrZXkiLCJDaGlsZHJlbiIsIm1hcCIsImNoaWxkcmVuIiwiYyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNwbGl0IiwicmVzaXplclNpemUiLCJvbkNoYW5nZSIsIm1pblNpemVzIiwibWF4U2l6ZXMiLCJzaXplc1B4IiwiZCIsInNwbGl0UGFuZURpbWVuc2lvbnMiLCJzcGxpdFBhbmUiLCJyZXNpemVyRGltZW5zaW9ucyIsImdldFJlc2l6ZXJEaW1lbnNpb25zIiwiY29uY2F0IiwicHJpbWFyeVVuaXQiLCJzZWNvbmRhcnlVbml0IiwicHJpbWFyeSIsInNlY29uZGFyeSIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsInByaW1hcnlTaXplIiwic2Vjb25kYXJ5U2l6ZSIsInNwbGl0UGFuZVNpemUiLCJyZXNpemVyTGVmdCIsInJlc2l6ZXJSaWdodCIsInJlc2l6ZXJUb3AiLCJyZXNpemVyQm90dG9tIiwicHJpbWFyeU1pblNpemUiLCJzZWNvbmRhcnlNaW5TaXplIiwicHJpbWFyeU1heFNpemUiLCJzZWNvbmRhcnlNYXhTaXplIiwiY29udmVydFVuaXRzIiwicyIsImNvbnRhaW5lclNpemUiLCJjbGFzc05hbWUiLCJyYXRpb3MiLCJwYW5lSW5kZXgiLCJlbGVtZW50cyIsInJlZHVjZSIsImFjYyIsImNoaWxkIiwicGFuZSIsImlzUGFuZSIsInR5cGUiLCJwYW5lUHJvcHMiLCJpbmRleCIsInJlZiIsImJpbmQiLCJsZW5ndGgiLCJyZXNpemVyIiwicHJvcFR5cGVzIiwiYXJyYXlPZiIsIm5vZGUiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwib25lT2YiLCJudW1iZXIiLCJmdW5jIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsY0FBYyxvQkFBVUMsR0FBVixDQUFjO0FBQ2hDQyxXQUFTLE1BRHVCO0FBRWhDQyxVQUFRLE1BRndCO0FBR2hDQyxpQkFBZSxRQUhpQjtBQUloQ0MsUUFBTSxDQUowQjtBQUtoQ0MsV0FBUyxNQUx1QjtBQU1oQ0MsWUFBVSxRQU5zQjtBQU9oQ0MsY0FBWSxNQVBvQjs7QUFTaENDLGFBQVcsTUFUcUI7QUFVaENDLFNBQU87QUFWeUIsQ0FBZCxDQUFwQjs7QUFhQSxJQUFNQyxXQUFXLG9CQUFVVixH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QVlsQyxLQUhkO0FBSUUsaUJBQUs7QUFBQSxxQkFBYyxPQUFLUSxTQUFMLEdBQWlCQSxTQUEvQjtBQUFBO0FBSlA7QUFNRzZCO0FBTkgsU0FERjtBQVVEO0FBQ0Y7Ozs7OztBQUdIakYsVUFBVThGLFNBQVYsR0FBc0I7QUFDcEJyRCxZQUFVLG9CQUFVc0QsT0FBVixDQUFrQixvQkFBVUMsSUFBNUIsRUFBa0NDLFVBRHhCO0FBRXBCbkIsYUFBVyxvQkFBVW9CLE1BRkQ7QUFHcEJ0RCxTQUFPLG9CQUFVdUQsS0FBVixDQUFnQixDQUFDLFVBQUQsRUFBYSxZQUFiLENBQWhCLENBSGE7QUFJcEJ0RCxlQUFhLG9CQUFVdUQsTUFKSDtBQUtwQnRELFlBQVUsb0JBQVV1RCxJQUxBO0FBTXBCN0YsaUJBQWUsb0JBQVU2RixJQU5MO0FBT3BCNUUsZUFBYSxvQkFBVTRFO0FBUEgsQ0FBdEI7O0FBVUFyRyxVQUFVc0csWUFBVixHQUF5QjtBQUN2QjFELFNBQU8sVUFEZ0I7QUFFdkJDLGVBQWEsQ0FGVTtBQUd2QnRDLGVBQWE7QUFIVSxDQUF6Qjs7a0JBTWVQLFMiLCJmaWxlIjoiU3BsaXRQYW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY2xvbmVFbGVtZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmluZERPTU5vZGUgfSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IGdsYW1vcm91cyBmcm9tICdnbGFtb3JvdXMnO1xuaW1wb3J0IFJlc2l6ZXIgZnJvbSAnLi9SZXNpemVyJztcbmltcG9ydCBQYW5lIGZyb20gJy4vUGFuZSc7XG5cbmNvbnN0IENvbHVtblN0eWxlID0gZ2xhbW9yb3VzLmRpdih7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICBmbGV4OiAxLFxuICBvdXRsaW5lOiAnbm9uZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdXNlclNlbGVjdDogJ3RleHQnLFxuXG4gIG1pbkhlaWdodDogJzEwMCUnLFxuICB3aWR0aDogJzEwMCUnLFxufSk7XG5cbmNvbnN0IFJvd1N0eWxlID0gZ2xhbW9yb3VzLmRpdih7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICBmbGV4OiAxLFxuICBvdXRsaW5lOiAnbm9uZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdXNlclNlbGVjdDogJ3RleHQnLFxuXG59KTtcblxuLy8gdG9kbzogbW92ZSB1dGlscyBmbiB0byBzZXBhcmF0ZSBmaWxlXG5mdW5jdGlvbiBjb252ZXJ0IChzdHIsIHNpemUpIHtcbiAgY29uc3QgdG9rZW5zID0gc3RyLm1hdGNoKC8oWzAtOV0rKShbcHh8JV0qKS8pO1xuICBjb25zdCB2YWx1ZSA9IHRva2Vuc1sxXTtcbiAgY29uc3QgdW5pdCA9IHRva2Vuc1syXTtcbiAgcmV0dXJuIHRvUHgodmFsdWUsIHVuaXQsIHNpemUpO1xufVxuXG5mdW5jdGlvbiB0b1B4KHZhbHVlLCB1bml0ID0gJ3B4Jywgc2l6ZSkge1xuICBzd2l0Y2ggKHVuaXQpIHtcbiAgICBjYXNlICclJzoge1xuICAgICAgcmV0dXJuIChzaXplICogdmFsdWUgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHJldHVybiArdmFsdWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFVuaXQoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gXCJyYXRpb1wiO1xuICB9XG5cbiAgaWYoc2l6ZS5lbmRzV2l0aChcInB4XCIpKSB7XG4gICAgcmV0dXJuIFwicHhcIjtcbiAgfVxuXG4gIGlmKHNpemUuZW5kc1dpdGgoXCIlXCIpKSB7XG4gICAgcmV0dXJuIFwiJVwiO1xuICB9XG5cbiAgcmV0dXJuIFwicmF0aW9cIjtcbn1cblxuY2xhc3MgU3BsaXRQYW5lIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICBjb25zdCBzaXplcyA9IHRoaXMuZ2V0UGFuZVByb3AoXCJpbml0aWFsU2l6ZVwiLCBwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2l6ZXNcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzaXplczogdGhpcy5nZXRQYW5lUHJvcChcImluaXRpYWxTaXplXCIsIG5leHRQcm9wcyl9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgLy8gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgfVxuXG4gIG9uTW91c2VEb3duID0gKGV2ZW50LCByZXNpemVySW5kZXgpID0+IHtcbiAgICB0aGlzLm9uRG93bihyZXNpemVySW5kZXgpO1xuICB9XG5cbiAgb25Ub3VjaFN0YXJ0ID0gKGV2ZW50LCByZXNpemVySW5kZXgpID0+IHtcbiAgICB0aGlzLm9uRG93bihyZXNpemVySW5kZXgpO1xuICB9XG5cbiAgb25Eb3duID0gKHJlc2l6ZXJJbmRleCkgPT4ge1xuICAgIGNvbnN0IHthbGxvd1Jlc2l6ZSwgb25SZXNpemVTdGFydH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKCFhbGxvd1Jlc2l6ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZGltZW5zaW9ucyA9IHRoaXMuZ2V0UGFuZURpbWVuc2lvbnMoKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG5cbiAgICBpZiAob25SZXNpemVTdGFydCkge1xuICAgICAgb25SZXNpemVTdGFydChyZXNpemVySW5kZXgpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVzaXplckluZGV4LFxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5vbk1vdmUoZS5jbGllbnRYLCBlLmNsaWVudFkpO1xuICB9XG5cbiAgb25Ub3VjaE1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLm9uTW92ZShldmVudC50b3VjaGVzWzBdLmNsaWVudFgsIGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSk7XG4gIH1cblxuICBvbk1vdXNlVXAgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uUmVzaXplRW5kKSB7XG4gICAgICB0aGlzLnByb3BzLm9uUmVzaXplRW5kKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFuZVByb3Aoa2V5LCBwcm9wcykge1xuICAgIHJldHVybiBSZWFjdC5DaGlsZHJlbi5tYXAocHJvcHMuY2hpbGRyZW4sIGMgPT4gYy5wcm9wc1trZXldKTtcbiAgfVxuXG4gIGdldFBhbmVEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVFbGVtZW50cy5tYXAoZWwgPT4gZmluZERPTU5vZGUoZWwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgfVxuXG4gIGdldFJlc2l6ZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnJlc2l6ZXJFbGVtZW50cy5tYXAoZWwgPT4gZmluZERPTU5vZGUoZWwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKVxuICB9XG5cbiAgb25Nb3ZlKGNsaWVudFgsIGNsaWVudFkpIHtcbiAgICBjb25zdCB7IHNwbGl0LCByZXNpemVyU2l6ZSwgb25DaGFuZ2UgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyByZXNpemVySW5kZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgbWluU2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKCdtaW5TaXplJywgdGhpcy5wcm9wcyk7XG4gICAgY29uc3QgbWF4U2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKCdtYXhTaXplJywgdGhpcy5wcm9wcyk7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICBcbiAgICBjb25zdCBzaXplc1B4ID0gZGltZW5zaW9ucy5tYXAoZCA9PiBzcGxpdCA9PT0gXCJ2ZXJ0aWNhbFwiID8gZC53aWR0aCA6IGQuaGVpZ2h0KTtcbiAgICBcbiAgICBjb25zdCBzcGxpdFBhbmVEaW1lbnNpb25zID0gZmluZERPTU5vZGUodGhpcy5zcGxpdFBhbmUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHJlc2l6ZXJEaW1lbnNpb25zID0gdGhpcy5nZXRSZXNpemVyRGltZW5zaW9ucygpW3Jlc2l6ZXJJbmRleF07XG5cbiAgICBsZXQgc2l6ZXMgPSB0aGlzLnN0YXRlLnNpemVzLmNvbmNhdCgpO1xuICAgIFxuICAgIGNvbnN0IHByaW1hcnlVbml0ID0gZ2V0VW5pdChzaXplc1tyZXNpemVySW5kZXhdKTtcbiAgICBjb25zdCBzZWNvbmRhcnlVbml0ID0gZ2V0VW5pdChzaXplc1tyZXNpemVySW5kZXggKyAxXSk7XG4gICAgY29uc3QgcHJpbWFyeSA9IGRpbWVuc2lvbnNbcmVzaXplckluZGV4XTtcbiAgICBjb25zdCBzZWNvbmRhcnkgPSBkaW1lbnNpb25zW3Jlc2l6ZXJJbmRleCArIDFdO1xuICAgIFxuXG4gICAgaWYgKFxuICAgICAgKHNwbGl0ID09PSAndmVydGljYWwnICYmXG4gICAgICAgIGNsaWVudFggPj0gcHJpbWFyeS5sZWZ0ICYmXG4gICAgICAgIGNsaWVudFggPD0gc2Vjb25kYXJ5LnJpZ2h0KSB8fFxuICAgICAgKHNwbGl0ICE9PSAndmVydGljYWwnICYmXG4gICAgICAgIGNsaWVudFkgPj0gcHJpbWFyeS50b3AgJiZcbiAgICAgICAgY2xpZW50WSA8PSBzZWNvbmRhcnkuYm90dG9tKVxuICAgICkge1xuICAgICAgbGV0IHByaW1hcnlTaXplO1xuICAgICAgbGV0IHNlY29uZGFyeVNpemU7XG4gICAgICBsZXQgc3BsaXRQYW5lU2l6ZTtcblxuICAgICAgaWYgKHNwbGl0ID09PSAndmVydGljYWwnKSB7XG4gICAgICAgIGNvbnN0IHJlc2l6ZXJMZWZ0ID0gY2xpZW50WCAtIChyZXNpemVyU2l6ZSAvIDIpO1xuICAgICAgICBjb25zdCByZXNpemVyUmlnaHQgPSBjbGllbnRYICsgKHJlc2l6ZXJTaXplIC8gMik7XG5cbiAgICAgICAgcHJpbWFyeVNpemUgPSByZXNpemVyTGVmdCAtIHByaW1hcnkubGVmdDtcbiAgICAgICAgc2Vjb25kYXJ5U2l6ZSA9IHNlY29uZGFyeS5yaWdodCAtIHJlc2l6ZXJSaWdodDtcbiAgICAgICAgc3BsaXRQYW5lU2l6ZSA9IHNwbGl0UGFuZURpbWVuc2lvbnMud2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXNpemVyVG9wID0gY2xpZW50WSAtIChyZXNpemVyU2l6ZSAvIDIpO1xuICAgICAgICBjb25zdCByZXNpemVyQm90dG9tID0gY2xpZW50WSArIChyZXNpemVyU2l6ZSAvIDIpO1xuXG4gICAgICAgIHByaW1hcnlTaXplID0gcmVzaXplclRvcCAtIHByaW1hcnkudG9wO1xuICAgICAgICBzZWNvbmRhcnlTaXplID0gc2Vjb25kYXJ5LmJvdHRvbSAtIHJlc2l6ZXJCb3R0b207XG4gICAgICAgIHNwbGl0UGFuZVNpemUgPSBzcGxpdFBhbmVEaW1lbnNpb25zLmhlaWdodDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJpbWFyeU1pblNpemUgPSBjb252ZXJ0KG1pblNpemVzW3Jlc2l6ZXJJbmRleF0sIHNwbGl0UGFuZVNpemUpO1xuICAgICAgY29uc3Qgc2Vjb25kYXJ5TWluU2l6ZSA9IGNvbnZlcnQobWluU2l6ZXNbcmVzaXplckluZGV4ICsgMV0sIHNwbGl0UGFuZVNpemUpO1xuXG4gICAgICBjb25zdCBwcmltYXJ5TWF4U2l6ZSA9IGNvbnZlcnQobWF4U2l6ZXNbcmVzaXplckluZGV4XSwgc3BsaXRQYW5lU2l6ZSk7XG4gICAgICBjb25zdCBzZWNvbmRhcnlNYXhTaXplID0gY29udmVydChtYXhTaXplc1tyZXNpemVySW5kZXggKyAxXSwgc3BsaXRQYW5lU2l6ZSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgcHJpbWFyeU1pblNpemUgPD0gcHJpbWFyeVNpemUgJiZcbiAgICAgICAgcHJpbWFyeU1heFNpemUgPj0gcHJpbWFyeVNpemUgJiZcbiAgICAgICAgc2Vjb25kYXJ5TWluU2l6ZSA8PSBzZWNvbmRhcnlTaXplICYmXG4gICAgICAgIHNlY29uZGFyeU1heFNpemUgPj0gc2Vjb25kYXJ5U2l6ZVxuICAgICAgKSB7XG4gICAgICAgIHNpemVzUHhbcmVzaXplckluZGV4XSA9IHByaW1hcnlTaXplO1xuICAgICAgICBzaXplc1B4W3Jlc2l6ZXJJbmRleCArIDFdID0gc2Vjb25kYXJ5U2l6ZTtcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAocHJpbWFyeVVuaXQgIT09IFwicmF0aW9cIikge1xuICAgICAgICAgIHNpemVzW3Jlc2l6ZXJJbmRleF0gPSB0aGlzLmNvbnZlcnRVbml0cyhwcmltYXJ5U2l6ZSwgcHJpbWFyeVVuaXQsIHNwbGl0UGFuZVNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNpemVzID0gc2l6ZXMubWFwKChzLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGlmIChnZXRVbml0KHMpID09PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICAgICAgcyA9ICtzaXplc1B4W2lkeF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNlY29uZGFyeVVuaXQgIT09IFwicmF0aW9cIikge1xuICAgICAgICAgIHNpemVzW3Jlc2l6ZXJJbmRleCArIDFdID0gdGhpcy5jb252ZXJ0VW5pdHMoc2Vjb25kYXJ5U2l6ZSwgc2Vjb25kYXJ5VW5pdCwgc3BsaXRQYW5lU2l6ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2l6ZXMgPSBzaXplcy5tYXAoKHMsIGlkeCkgPT4ge1xuICAgICAgICAgICAgaWYgKGdldFVuaXQocykgPT09IFwicmF0aW9cIikge1xuICAgICAgICAgICAgICBzID0gK3NpemVzUHhbaWR4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7c2l6ZXN9KTtcblxuICAgICAgICBpZiAob25DaGFuZ2UpIHtcbiAgICAgICAgICBvbkNoYW5nZShzaXplcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb252ZXJ0VW5pdHMoc2l6ZSwgdW5pdCwgY29udGFpbmVyU2l6ZSkge1xuICAgIHN3aXRjaCh1bml0KSB7XG4gICAgICBjYXNlIFwiJVwiOlxuICAgICAgICByZXR1cm4gYCR7c2l6ZS9jb250YWluZXJTaXplKjEwMH0lYDtcbiAgICAgIGNhc2UgXCJweFwiOlxuICAgICAgICByZXR1cm4gYCR7c2l6ZX1weGA7XG4gICAgICBjYXNlIFwicmF0aW9cIjpcbiAgICAgICAgcmV0dXJuIHNpemU7XG4gICAgfVxuICB9XG5cbiAgc2V0UGFuZVJlZiA9IChpZHgsIGVsKSA9PiB7XG4gICAgaWYgKCF0aGlzLnBhbmVFbGVtZW50cykge1xuICAgICAgdGhpcy5wYW5lRWxlbWVudHMgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLnBhbmVFbGVtZW50c1tpZHhdID0gZWw7XG4gIH1cblxuICBzZXRSZXNpemVyUmVmID0gKGlkeCwgZWwpID0+IHtcbiAgICBpZiAoIXRoaXMucmVzaXplckVsZW1lbnRzKSB7XG4gICAgICB0aGlzLnJlc2l6ZXJFbGVtZW50cyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMucmVzaXplckVsZW1lbnRzW2lkeF0gPSBlbDtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNoaWxkcmVuLCBjbGFzc05hbWUsIHNwbGl0IH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgcmF0aW9zLCBzaXplcyB9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGxldCBwYW5lSW5kZXggPSAwO1xuICAgIGxldCByZXNpemVySW5kZXggPSAwO1xuXG4gICAgY29uc3QgZWxlbWVudHMgPSBjaGlsZHJlbi5yZWR1Y2UoKGFjYywgY2hpbGQpID0+IHtcbiAgICAgIC8vIGNvbnN0IHNpemUgPSBzaXplc1twYW5lSW5kZXhdID8gc2l6ZXNbcGFuZUluZGV4XSA6IDA7XG4gICAgICBsZXQgcGFuZTtcbiAgICAgIGNvbnN0IGlzUGFuZSA9IGNoaWxkLnR5cGUgPT09IFBhbmU7XG4gICAgICBjb25zdCBwYW5lUHJvcHMgPSB7XG4gICAgICAgIGluZGV4OiBwYW5lSW5kZXgsXG4gICAgICAgICdkYXRhLXR5cGUnOiAnUGFuZScsXG4gICAgICAgIC8vIHNpemU6IHNpemUsXG4gICAgICAgIHNwbGl0OiBzcGxpdCxcbiAgICAgICAga2V5OiBgUGFuZS0ke3BhbmVJbmRleH1gLFxuICAgICAgICByZWY6IHRoaXMuc2V0UGFuZVJlZi5iaW5kKG51bGwsIHBhbmVJbmRleClcbiAgICAgIH07XG4gICAgICBpZiAoaXNQYW5lKSB7XG4gICAgICAgIHBhbmUgPSBjbG9uZUVsZW1lbnQoY2hpbGQsIHBhbmVQcm9wcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYW5lID0gPFBhbmUgey4uLnBhbmVQcm9wc30+e2NoaWxkfTwvUGFuZT47XG4gICAgICB9XG4gICAgICBwYW5lSW5kZXgrKztcbiAgICAgIGlmIChhY2MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBbLi4uYWNjLCBwYW5lXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJlc2l6ZXIgPSAoXG4gICAgICAgICAgPFJlc2l6ZXJcbiAgICAgICAgICAgIGluZGV4PXtyZXNpemVySW5kZXh9XG4gICAgICAgICAgICBrZXk9e2BSZXNpemVyLSR7cmVzaXplckluZGV4fWB9XG4gICAgICAgICAgICByZWY9e3RoaXMuc2V0UmVzaXplclJlZi5iaW5kKG51bGwsIHJlc2l6ZXJJbmRleCl9XG4gICAgICAgICAgICBzcGxpdD17c3BsaXR9XG4gICAgICAgICAgICBvbk1vdXNlRG93bj17dGhpcy5vbk1vdXNlRG93bn1cbiAgICAgICAgICAgIC8vIG9uVG91Y2hTdGFydD17dGhpcy5vblRvdWNoU3RhcnR9XG4gICAgICAgICAgICAvLyBvblRvdWNoRW5kPXt0aGlzLm9uTW91c2VVcH1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgICByZXNpemVySW5kZXgrKztcbiAgICAgICAgcmV0dXJuIFsuLi5hY2MsIHJlc2l6ZXIsIHBhbmVdO1xuICAgICAgfVxuICAgIH0sIFtdKTtcblxuICAgIGlmIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFJvd1N0eWxlXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgICAgZGF0YS10eXBlPVwiU3BsaXRQYW5lXCJcbiAgICAgICAgICBkYXRhLXNwbGl0PXtzcGxpdH1cbiAgICAgICAgICByZWY9e3NwbGl0UGFuZSA9PiAodGhpcy5zcGxpdFBhbmUgPSBzcGxpdFBhbmUpfVxuICAgICAgICA+XG4gICAgICAgICAge2VsZW1lbnRzfVxuICAgICAgICA8L1Jvd1N0eWxlPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbHVtblN0eWxlXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgICAgZGF0YS10eXBlPVwiU3BsaXRQYW5lXCJcbiAgICAgICAgICBkYXRhLXNwbGl0PXtzcGxpdH1cbiAgICAgICAgICByZWY9e3NwbGl0UGFuZSA9PiAodGhpcy5zcGxpdFBhbmUgPSBzcGxpdFBhbmUpfVxuICAgICAgICA+XG4gICAgICAgICAge2VsZW1lbnRzfVxuICAgICAgICA8L0NvbHVtblN0eWxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuU3BsaXRQYW5lLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5ub2RlKS5pc1JlcXVpcmVkLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNwbGl0OiBQcm9wVHlwZXMub25lT2YoWyd2ZXJ0aWNhbCcsICdob3Jpem9udGFsJ10pLFxuICByZXNpemVyU2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblJlc2l6ZVN0YXJ0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25SZXNpemVFbmQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuU3BsaXRQYW5lLmRlZmF1bHRQcm9wcyA9IHtcbiAgc3BsaXQ6ICd2ZXJ0aWNhbCcsXG4gIHJlc2l6ZXJTaXplOiAxLFxuICBhbGxvd1Jlc2l6ZTogdHJ1ZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU3BsaXRQYW5lO1xuIl19