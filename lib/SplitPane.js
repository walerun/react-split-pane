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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TcGxpdFBhbmUuanMiXSwibmFtZXMiOlsiQ29sdW1uU3R5bGUiLCJkaXYiLCJkaXNwbGF5IiwiaGVpZ2h0IiwiZmxleERpcmVjdGlvbiIsImZsZXgiLCJvdXRsaW5lIiwib3ZlcmZsb3ciLCJ1c2VyU2VsZWN0IiwibWluSGVpZ2h0Iiwid2lkdGgiLCJSb3dTdHlsZSIsImNvbnZlcnQiLCJzdHIiLCJzaXplIiwidG9rZW5zIiwibWF0Y2giLCJ2YWx1ZSIsInVuaXQiLCJ0b1B4IiwidG9GaXhlZCIsImdldFVuaXQiLCJlbmRzV2l0aCIsIlNwbGl0UGFuZSIsInByb3BzIiwib25Nb3VzZURvd24iLCJldmVudCIsInJlc2l6ZXJJbmRleCIsIm9uRG93biIsIm9uVG91Y2hTdGFydCIsImFsbG93UmVzaXplIiwib25SZXNpemVTdGFydCIsImRpbWVuc2lvbnMiLCJnZXRQYW5lRGltZW5zaW9ucyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVVwIiwic2V0U3RhdGUiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJvbk1vdmUiLCJjbGllbnRYIiwiY2xpZW50WSIsIm9uVG91Y2hNb3ZlIiwidG91Y2hlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblJlc2l6ZUVuZCIsInNldFBhbmVSZWYiLCJpZHgiLCJlbCIsInBhbmVFbGVtZW50cyIsInNldFJlc2l6ZXJSZWYiLCJyZXNpemVyRWxlbWVudHMiLCJzaXplcyIsImdldFBhbmVQcm9wIiwic3RhdGUiLCJuZXh0UHJvcHMiLCJ3aW5kb3ciLCJyZXNpemUiLCJrZXkiLCJDaGlsZHJlbiIsIm1hcCIsImNoaWxkcmVuIiwiYyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNwbGl0IiwicmVzaXplclNpemUiLCJvbkNoYW5nZSIsIm1pblNpemVzIiwibWF4U2l6ZXMiLCJzaXplc1B4IiwiZCIsInNwbGl0UGFuZURpbWVuc2lvbnMiLCJzcGxpdFBhbmUiLCJyZXNpemVyRGltZW5zaW9ucyIsImdldFJlc2l6ZXJEaW1lbnNpb25zIiwiY29uY2F0IiwicHJpbWFyeVVuaXQiLCJzZWNvbmRhcnlVbml0IiwicHJpbWFyeSIsInNlY29uZGFyeSIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsInByaW1hcnlTaXplIiwic2Vjb25kYXJ5U2l6ZSIsInNwbGl0UGFuZVNpemUiLCJyZXNpemVyTGVmdCIsInJlc2l6ZXJSaWdodCIsInJlc2l6ZXJUb3AiLCJyZXNpemVyQm90dG9tIiwicHJpbWFyeU1pblNpemUiLCJzZWNvbmRhcnlNaW5TaXplIiwicHJpbWFyeU1heFNpemUiLCJzZWNvbmRhcnlNYXhTaXplIiwiY29udmVydFVuaXRzIiwicyIsImNvbnRhaW5lclNpemUiLCJjbGFzc05hbWUiLCJyYXRpb3MiLCJwYW5lSW5kZXgiLCJlbGVtZW50cyIsInJlZHVjZSIsImFjYyIsImNoaWxkIiwicGFuZSIsImlzUGFuZSIsInR5cGUiLCJwYW5lUHJvcHMiLCJpbmRleCIsInJlZiIsImJpbmQiLCJsZW5ndGgiLCJyZXNpemVyIiwicHJvcFR5cGVzIiwiYXJyYXlPZiIsIm5vZGUiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwib25lT2YiLCJudW1iZXIiLCJmdW5jIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsY0FBYyxvQkFBVUMsR0FBVixDQUFjO0FBQ2hDQyxXQUFTLE1BRHVCO0FBRWhDQyxVQUFRLE1BRndCO0FBR2hDQyxpQkFBZSxRQUhpQjtBQUloQ0MsUUFBTSxDQUowQjtBQUtoQ0MsV0FBUyxNQUx1QjtBQU1oQ0MsWUFBVSxRQU5zQjtBQU9oQ0MsY0FBWSxNQVBvQjs7QUFTaENDLGFBQVcsTUFUcUI7QUFVaENDLFNBQU87QUFWeUIsQ0FBZCxDQUFwQjs7QUFhQSxJQUFNQyxXQUFXLG9CQUFVVixH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VSxvQkFBVXNELE9BQVYsQ0FBa0Isb0JBQVVDLElBQTVCLEVBQWtDQyxVQUR4QjtBQUVwQm5CLGFBQVcsb0JBQVVvQixNQUZEO0FBR3BCdEQsU0FBTyxvQkFBVXVELEtBQVYsQ0FBZ0IsQ0FBQyxVQUFELEVBQWEsWUFBYixDQUFoQixDQUhhO0FBSXBCdEQsZUFBYSxvQkFBVXVELE1BSkg7QUFLcEJ0RCxZQUFVLG9CQUFVdUQsSUFMQTtBQU1wQjdGLGlCQUFlLG9CQUFVNkYsSUFOTDtBQU9wQjVFLGVBQWEsb0JBQVU0RTtBQVBILENBQXRCOztBQVVBckcsVUFBVXNHLFlBQVYsR0FBeUI7QUFDdkIxRCxTQUFPLFVBRGdCO0FBRXZCQyxlQUFhLENBRlU7QUFHdkJ0QyxlQUFhO0FBSFUsQ0FBekI7O2tCQU1lUCxTIiwiZmlsZSI6IlNwbGl0UGFuZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIGNsb25lRWxlbWVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGZpbmRET01Ob2RlIH0gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBnbGFtb3JvdXMgZnJvbSAnZ2xhbW9yb3VzJztcbmltcG9ydCBSZXNpemVyIGZyb20gJy4vUmVzaXplcic7XG5pbXBvcnQgUGFuZSBmcm9tICcuL1BhbmUnO1xuXG5jb25zdCBDb2x1bW5TdHlsZSA9IGdsYW1vcm91cy5kaXYoe1xuICBkaXNwbGF5OiAnZmxleCcsXG4gIGhlaWdodDogJzEwMCUnLFxuICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJyxcbiAgZmxleDogMSxcbiAgb3V0bGluZTogJ25vbmUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gIHVzZXJTZWxlY3Q6ICd0ZXh0JyxcblxuICBtaW5IZWlnaHQ6ICcxMDAlJyxcbiAgd2lkdGg6ICcxMDAlJyxcbn0pO1xuXG5jb25zdCBSb3dTdHlsZSA9IGdsYW1vcm91cy5kaXYoe1xuICBkaXNwbGF5OiAnZmxleCcsXG4gIGhlaWdodDogJzEwMCUnLFxuICBmbGV4RGlyZWN0aW9uOiAncm93JyxcbiAgZmxleDogMSxcbiAgb3V0bGluZTogJ25vbmUnLFxuICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gIHVzZXJTZWxlY3Q6ICd0ZXh0JyxcblxufSk7XG5cbi8vIHRvZG86IG1vdmUgdXRpbHMgZm4gdG8gc2VwYXJhdGUgZmlsZVxuZnVuY3Rpb24gY29udmVydCAoc3RyLCBzaXplKSB7XG4gIGNvbnN0IHRva2VucyA9IHN0ci5tYXRjaCgvKFswLTldKykoW3B4fCVdKikvKTtcbiAgY29uc3QgdmFsdWUgPSB0b2tlbnNbMV07XG4gIGNvbnN0IHVuaXQgPSB0b2tlbnNbMl07XG4gIHJldHVybiB0b1B4KHZhbHVlLCB1bml0LCBzaXplKTtcbn1cblxuZnVuY3Rpb24gdG9QeCh2YWx1ZSwgdW5pdCA9ICdweCcsIHNpemUpIHtcbiAgc3dpdGNoICh1bml0KSB7XG4gICAgY2FzZSAnJSc6IHtcbiAgICAgIHJldHVybiAoc2l6ZSAqIHZhbHVlIC8gMTAwKS50b0ZpeGVkKDIpO1xuICAgIH1cbiAgICBkZWZhdWx0OiB7XG4gICAgICByZXR1cm4gK3ZhbHVlO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRVbml0KHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplID09PSBcIm51bWJlclwiKSB7XG4gICAgcmV0dXJuIFwicmF0aW9cIjtcbiAgfVxuXG4gIGlmKHNpemUuZW5kc1dpdGgoXCJweFwiKSkge1xuICAgIHJldHVybiBcInB4XCI7XG4gIH1cblxuICBpZihzaXplLmVuZHNXaXRoKFwiJVwiKSkge1xuICAgIHJldHVybiBcIiVcIjtcbiAgfVxuXG4gIHJldHVybiBcInJhdGlvXCI7XG59XG5cbmNsYXNzIFNwbGl0UGFuZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgY29uc3Qgc2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKFwiaW5pdGlhbFNpemVcIik7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2l6ZXNcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgLy8gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgfVxuXG4gIG9uTW91c2VEb3duID0gKGV2ZW50LCByZXNpemVySW5kZXgpID0+IHtcbiAgICB0aGlzLm9uRG93bihyZXNpemVySW5kZXgpO1xuICB9XG5cbiAgb25Ub3VjaFN0YXJ0ID0gKGV2ZW50LCByZXNpemVySW5kZXgpID0+IHtcbiAgICB0aGlzLm9uRG93bihyZXNpemVySW5kZXgpO1xuICB9XG5cbiAgb25Eb3duID0gKHJlc2l6ZXJJbmRleCkgPT4ge1xuICAgIGNvbnN0IHthbGxvd1Jlc2l6ZSwgb25SZXNpemVTdGFydH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKCFhbGxvd1Jlc2l6ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZGltZW5zaW9ucyA9IHRoaXMuZ2V0UGFuZURpbWVuc2lvbnMoKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG5cbiAgICBpZiAob25SZXNpemVTdGFydCkge1xuICAgICAgb25SZXNpemVTdGFydChyZXNpemVySW5kZXgpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVzaXplckluZGV4LFxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5vbk1vdmUoZS5jbGllbnRYLCBlLmNsaWVudFkpO1xuICB9XG5cbiAgb25Ub3VjaE1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLm9uTW92ZShldmVudC50b3VjaGVzWzBdLmNsaWVudFgsIGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSk7XG4gIH1cblxuICBvbk1vdXNlVXAgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uUmVzaXplRW5kKSB7XG4gICAgICB0aGlzLnByb3BzLm9uUmVzaXplRW5kKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFuZVByb3Aoa2V5KSB7XG4gICAgcmV0dXJuIFJlYWN0LkNoaWxkcmVuLm1hcCh0aGlzLnByb3BzLmNoaWxkcmVuLCBjID0+IGMucHJvcHNba2V5XSk7XG4gIH1cblxuICBnZXRQYW5lRGltZW5zaW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5wYW5lRWxlbWVudHMubWFwKGVsID0+IGZpbmRET01Ob2RlKGVsKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XG4gIH1cblxuICBnZXRSZXNpemVyRGltZW5zaW9ucygpIHtcbiAgICByZXR1cm4gdGhpcy5yZXNpemVyRWxlbWVudHMubWFwKGVsID0+IGZpbmRET01Ob2RlKGVsKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSlcbiAgfVxuXG4gIG9uTW92ZShjbGllbnRYLCBjbGllbnRZKSB7XG4gICAgY29uc3QgeyBzcGxpdCwgcmVzaXplclNpemUsIG9uQ2hhbmdlIH0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IHsgcmVzaXplckluZGV4IH0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IG1pblNpemVzID0gdGhpcy5nZXRQYW5lUHJvcCgnbWluU2l6ZScpO1xuICAgIGNvbnN0IG1heFNpemVzID0gdGhpcy5nZXRQYW5lUHJvcCgnbWF4U2l6ZScpO1xuICAgIGNvbnN0IGRpbWVuc2lvbnMgPSB0aGlzLmRpbWVuc2lvbnM7XG4gICAgXG4gICAgY29uc3Qgc2l6ZXNQeCA9IGRpbWVuc2lvbnMubWFwKGQgPT4gc3BsaXQgPT09IFwidmVydGljYWxcIiA/IGQud2lkdGggOiBkLmhlaWdodCk7XG4gICAgXG4gICAgY29uc3Qgc3BsaXRQYW5lRGltZW5zaW9ucyA9IGZpbmRET01Ob2RlKHRoaXMuc3BsaXRQYW5lKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCByZXNpemVyRGltZW5zaW9ucyA9IHRoaXMuZ2V0UmVzaXplckRpbWVuc2lvbnMoKVtyZXNpemVySW5kZXhdO1xuXG4gICAgbGV0IHNpemVzID0gdGhpcy5zdGF0ZS5zaXplcy5jb25jYXQoKTtcbiAgICBcbiAgICBjb25zdCBwcmltYXJ5VW5pdCA9IGdldFVuaXQoc2l6ZXNbcmVzaXplckluZGV4XSk7XG4gICAgY29uc3Qgc2Vjb25kYXJ5VW5pdCA9IGdldFVuaXQoc2l6ZXNbcmVzaXplckluZGV4ICsgMV0pO1xuICAgIGNvbnN0IHByaW1hcnkgPSBkaW1lbnNpb25zW3Jlc2l6ZXJJbmRleF07XG4gICAgY29uc3Qgc2Vjb25kYXJ5ID0gZGltZW5zaW9uc1tyZXNpemVySW5kZXggKyAxXTtcbiAgICBcblxuICAgIGlmIChcbiAgICAgIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJyAmJlxuICAgICAgICBjbGllbnRYID49IHByaW1hcnkubGVmdCAmJlxuICAgICAgICBjbGllbnRYIDw9IHNlY29uZGFyeS5yaWdodCkgfHxcbiAgICAgIChzcGxpdCAhPT0gJ3ZlcnRpY2FsJyAmJlxuICAgICAgICBjbGllbnRZID49IHByaW1hcnkudG9wICYmXG4gICAgICAgIGNsaWVudFkgPD0gc2Vjb25kYXJ5LmJvdHRvbSlcbiAgICApIHtcbiAgICAgIGxldCBwcmltYXJ5U2l6ZTtcbiAgICAgIGxldCBzZWNvbmRhcnlTaXplO1xuICAgICAgbGV0IHNwbGl0UGFuZVNpemU7XG5cbiAgICAgIGlmIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgICBjb25zdCByZXNpemVyTGVmdCA9IGNsaWVudFggLSAocmVzaXplclNpemUgLyAyKTtcbiAgICAgICAgY29uc3QgcmVzaXplclJpZ2h0ID0gY2xpZW50WCArIChyZXNpemVyU2l6ZSAvIDIpO1xuXG4gICAgICAgIHByaW1hcnlTaXplID0gcmVzaXplckxlZnQgLSBwcmltYXJ5LmxlZnQ7XG4gICAgICAgIHNlY29uZGFyeVNpemUgPSBzZWNvbmRhcnkucmlnaHQgLSByZXNpemVyUmlnaHQ7XG4gICAgICAgIHNwbGl0UGFuZVNpemUgPSBzcGxpdFBhbmVEaW1lbnNpb25zLndpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzaXplclRvcCA9IGNsaWVudFkgLSAocmVzaXplclNpemUgLyAyKTtcbiAgICAgICAgY29uc3QgcmVzaXplckJvdHRvbSA9IGNsaWVudFkgKyAocmVzaXplclNpemUgLyAyKTtcblxuICAgICAgICBwcmltYXJ5U2l6ZSA9IHJlc2l6ZXJUb3AgLSBwcmltYXJ5LnRvcDtcbiAgICAgICAgc2Vjb25kYXJ5U2l6ZSA9IHNlY29uZGFyeS5ib3R0b20gLSByZXNpemVyQm90dG9tO1xuICAgICAgICBzcGxpdFBhbmVTaXplID0gc3BsaXRQYW5lRGltZW5zaW9ucy5oZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByaW1hcnlNaW5TaXplID0gY29udmVydChtaW5TaXplc1tyZXNpemVySW5kZXhdLCBzcGxpdFBhbmVTaXplKTtcbiAgICAgIGNvbnN0IHNlY29uZGFyeU1pblNpemUgPSBjb252ZXJ0KG1pblNpemVzW3Jlc2l6ZXJJbmRleCArIDFdLCBzcGxpdFBhbmVTaXplKTtcblxuICAgICAgY29uc3QgcHJpbWFyeU1heFNpemUgPSBjb252ZXJ0KG1heFNpemVzW3Jlc2l6ZXJJbmRleF0sIHNwbGl0UGFuZVNpemUpO1xuICAgICAgY29uc3Qgc2Vjb25kYXJ5TWF4U2l6ZSA9IGNvbnZlcnQobWF4U2l6ZXNbcmVzaXplckluZGV4ICsgMV0sIHNwbGl0UGFuZVNpemUpO1xuXG4gICAgICBpZiAoXG4gICAgICAgIHByaW1hcnlNaW5TaXplIDw9IHByaW1hcnlTaXplICYmXG4gICAgICAgIHByaW1hcnlNYXhTaXplID49IHByaW1hcnlTaXplICYmXG4gICAgICAgIHNlY29uZGFyeU1pblNpemUgPD0gc2Vjb25kYXJ5U2l6ZSAmJlxuICAgICAgICBzZWNvbmRhcnlNYXhTaXplID49IHNlY29uZGFyeVNpemVcbiAgICAgICkge1xuICAgICAgICBzaXplc1B4W3Jlc2l6ZXJJbmRleF0gPSBwcmltYXJ5U2l6ZTtcbiAgICAgICAgc2l6ZXNQeFtyZXNpemVySW5kZXggKyAxXSA9IHNlY29uZGFyeVNpemU7XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKHByaW1hcnlVbml0ICE9PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICBzaXplc1tyZXNpemVySW5kZXhdID0gdGhpcy5jb252ZXJ0VW5pdHMocHJpbWFyeVNpemUsIHByaW1hcnlVbml0LCBzcGxpdFBhbmVTaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzaXplcyA9IHNpemVzLm1hcCgocywgaWR4KSA9PiB7XG4gICAgICAgICAgICBpZiAoZ2V0VW5pdChzKSA9PT0gXCJyYXRpb1wiKSB7XG4gICAgICAgICAgICAgIHMgPSArc2l6ZXNQeFtpZHhdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzZWNvbmRhcnlVbml0ICE9PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICBzaXplc1tyZXNpemVySW5kZXggKyAxXSA9IHRoaXMuY29udmVydFVuaXRzKHNlY29uZGFyeVNpemUsIHNlY29uZGFyeVVuaXQsIHNwbGl0UGFuZVNpemUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNpemVzID0gc2l6ZXMubWFwKChzLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGlmIChnZXRVbml0KHMpID09PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICAgICAgcyA9ICtzaXplc1B4W2lkeF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3NpemVzfSk7XG5cbiAgICAgICAgaWYgKG9uQ2hhbmdlKSB7XG4gICAgICAgICAgb25DaGFuZ2Uoc2l6ZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgY29udmVydFVuaXRzKHNpemUsIHVuaXQsIGNvbnRhaW5lclNpemUpIHtcbiAgICBzd2l0Y2godW5pdCkge1xuICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgcmV0dXJuIGAke3NpemUvY29udGFpbmVyU2l6ZSoxMDB9JWA7XG4gICAgICBjYXNlIFwicHhcIjpcbiAgICAgICAgcmV0dXJuIGAke3NpemV9cHhgO1xuICAgICAgY2FzZSBcInJhdGlvXCI6XG4gICAgICAgIHJldHVybiBzaXplO1xuICAgIH1cbiAgfVxuXG4gIHNldFBhbmVSZWYgPSAoaWR4LCBlbCkgPT4ge1xuICAgIGlmICghdGhpcy5wYW5lRWxlbWVudHMpIHtcbiAgICAgIHRoaXMucGFuZUVsZW1lbnRzID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5wYW5lRWxlbWVudHNbaWR4XSA9IGVsO1xuICB9XG5cbiAgc2V0UmVzaXplclJlZiA9IChpZHgsIGVsKSA9PiB7XG4gICAgaWYgKCF0aGlzLnJlc2l6ZXJFbGVtZW50cykge1xuICAgICAgdGhpcy5yZXNpemVyRWxlbWVudHMgPSBbXTtcbiAgICB9XG5cbiAgICB0aGlzLnJlc2l6ZXJFbGVtZW50c1tpZHhdID0gZWw7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBjaGlsZHJlbiwgY2xhc3NOYW1lLCBzcGxpdCB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7IHJhdGlvcywgc2l6ZXMgfSA9IHRoaXMuc3RhdGU7XG5cbiAgICBsZXQgcGFuZUluZGV4ID0gMDtcbiAgICBsZXQgcmVzaXplckluZGV4ID0gMDtcblxuICAgIGNvbnN0IGVsZW1lbnRzID0gY2hpbGRyZW4ucmVkdWNlKChhY2MsIGNoaWxkKSA9PiB7XG4gICAgICAvLyBjb25zdCBzaXplID0gc2l6ZXNbcGFuZUluZGV4XSA/IHNpemVzW3BhbmVJbmRleF0gOiAwO1xuICAgICAgbGV0IHBhbmU7XG4gICAgICBjb25zdCBpc1BhbmUgPSBjaGlsZC50eXBlID09PSBQYW5lO1xuICAgICAgY29uc3QgcGFuZVByb3BzID0ge1xuICAgICAgICBpbmRleDogcGFuZUluZGV4LFxuICAgICAgICAnZGF0YS10eXBlJzogJ1BhbmUnLFxuICAgICAgICAvLyBzaXplOiBzaXplLFxuICAgICAgICBzcGxpdDogc3BsaXQsXG4gICAgICAgIGtleTogYFBhbmUtJHtwYW5lSW5kZXh9YCxcbiAgICAgICAgcmVmOiB0aGlzLnNldFBhbmVSZWYuYmluZChudWxsLCBwYW5lSW5kZXgpXG4gICAgICB9O1xuICAgICAgaWYgKGlzUGFuZSkge1xuICAgICAgICBwYW5lID0gY2xvbmVFbGVtZW50KGNoaWxkLCBwYW5lUHJvcHMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFuZSA9IDxQYW5lIHsuLi5wYW5lUHJvcHN9PntjaGlsZH08L1BhbmU+O1xuICAgICAgfVxuICAgICAgcGFuZUluZGV4Kys7XG4gICAgICBpZiAoYWNjLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gWy4uLmFjYywgcGFuZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXNpemVyID0gKFxuICAgICAgICAgIDxSZXNpemVyXG4gICAgICAgICAgICBpbmRleD17cmVzaXplckluZGV4fVxuICAgICAgICAgICAga2V5PXtgUmVzaXplci0ke3Jlc2l6ZXJJbmRleH1gfVxuICAgICAgICAgICAgcmVmPXt0aGlzLnNldFJlc2l6ZXJSZWYuYmluZChudWxsLCByZXNpemVySW5kZXgpfVxuICAgICAgICAgICAgc3BsaXQ9e3NwbGl0fVxuICAgICAgICAgICAgb25Nb3VzZURvd249e3RoaXMub25Nb3VzZURvd259XG4gICAgICAgICAgICAvLyBvblRvdWNoU3RhcnQ9e3RoaXMub25Ub3VjaFN0YXJ0fVxuICAgICAgICAgICAgLy8gb25Ub3VjaEVuZD17dGhpcy5vbk1vdXNlVXB9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgICAgcmVzaXplckluZGV4Kys7XG4gICAgICAgIHJldHVybiBbLi4uYWNjLCByZXNpemVyLCBwYW5lXTtcbiAgICAgIH1cbiAgICB9LCBbXSk7XG5cbiAgICBpZiAoc3BsaXQgPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxSb3dTdHlsZVxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgICAgIGRhdGEtdHlwZT1cIlNwbGl0UGFuZVwiXG4gICAgICAgICAgZGF0YS1zcGxpdD17c3BsaXR9XG4gICAgICAgICAgcmVmPXtzcGxpdFBhbmUgPT4gKHRoaXMuc3BsaXRQYW5lID0gc3BsaXRQYW5lKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtlbGVtZW50c31cbiAgICAgICAgPC9Sb3dTdHlsZT5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb2x1bW5TdHlsZVxuICAgICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgICAgIGRhdGEtdHlwZT1cIlNwbGl0UGFuZVwiXG4gICAgICAgICAgZGF0YS1zcGxpdD17c3BsaXR9XG4gICAgICAgICAgcmVmPXtzcGxpdFBhbmUgPT4gKHRoaXMuc3BsaXRQYW5lID0gc3BsaXRQYW5lKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtlbGVtZW50c31cbiAgICAgICAgPC9Db2x1bW5TdHlsZT5cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cblNwbGl0UGFuZS5wcm9wVHlwZXMgPSB7XG4gIGNoaWxkcmVuOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubm9kZSkuaXNSZXF1aXJlZCxcbiAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICBzcGxpdDogUHJvcFR5cGVzLm9uZU9mKFsndmVydGljYWwnLCAnaG9yaXpvbnRhbCddKSxcbiAgcmVzaXplclNpemU6IFByb3BUeXBlcy5udW1iZXIsXG4gIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgb25SZXNpemVTdGFydDogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uUmVzaXplRW5kOiBQcm9wVHlwZXMuZnVuYyxcbn07XG5cblNwbGl0UGFuZS5kZWZhdWx0UHJvcHMgPSB7XG4gIHNwbGl0OiAndmVydGljYWwnLFxuICByZXNpemVyU2l6ZTogMSxcbiAgYWxsb3dSZXNpemU6IHRydWVcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNwbGl0UGFuZTtcbiJdfQ==