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

      document.addEventListener('mousemove', _this.onMouseMove);
      document.addEventListener('mouseup', _this.onMouseUp);

      document.addEventListener('touchmove', _this.onTouchMove);
      document.addEventListener('touchend', _this.onMouseUp);
      // document.addEventListener('touchcancel', this.onMouseUp);

      if (onResizeStart) {
        onResizeStart(resizerIndex);
      }

      _this.setState({
        resizerIndex: resizerIndex
      });
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

      document.removeEventListener('touchmove', this.onTouchMove);
      document.removeEventListener('touchend', this.onMouseUp);
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

          var updateRatio = void 0;

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
            var ratioIdx = sizes.map(function (s, idx) {
              return getUnit(s) === "ratio" ? idx : -1;
            }).filter(function (idx) {
              return idx >= 0;
            });
            var ratio = ratioIdx.length === 1 ? [1] : ratioIdx.map(function (i) {
              return sizesPx[i];
            });

            ratioIdx.forEach(function (i, idx) {
              return sizes[i] = ratio[idx];
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
            onMouseDown: _this2.onMouseDown,
            onTouchStart: _this2.onTouchStart
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TcGxpdFBhbmUuanMiXSwibmFtZXMiOlsiQ29sdW1uU3R5bGUiLCJkaXYiLCJkaXNwbGF5IiwiaGVpZ2h0IiwiZmxleERpcmVjdGlvbiIsImZsZXgiLCJvdXRsaW5lIiwib3ZlcmZsb3ciLCJ1c2VyU2VsZWN0IiwibWluSGVpZ2h0Iiwid2lkdGgiLCJSb3dTdHlsZSIsImNvbnZlcnQiLCJzdHIiLCJzaXplIiwidG9rZW5zIiwibWF0Y2giLCJ2YWx1ZSIsInVuaXQiLCJ0b1B4IiwidG9GaXhlZCIsImdldFVuaXQiLCJlbmRzV2l0aCIsIlNwbGl0UGFuZSIsInByb3BzIiwib25Nb3VzZURvd24iLCJldmVudCIsInJlc2l6ZXJJbmRleCIsInByZXZlbnREZWZhdWx0Iiwib25Eb3duIiwib25Ub3VjaFN0YXJ0IiwiYWxsb3dSZXNpemUiLCJvblJlc2l6ZVN0YXJ0IiwiZGltZW5zaW9ucyIsImdldFBhbmVEaW1lbnNpb25zIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwib25Nb3VzZU1vdmUiLCJvbk1vdXNlVXAiLCJvblRvdWNoTW92ZSIsInNldFN0YXRlIiwib25Nb3ZlIiwiY2xpZW50WCIsImNsaWVudFkiLCJ0b3VjaGVzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uUmVzaXplRW5kIiwic2V0UGFuZVJlZiIsImlkeCIsImVsIiwicGFuZUVsZW1lbnRzIiwic2V0UmVzaXplclJlZiIsInJlc2l6ZXJFbGVtZW50cyIsInNpemVzIiwiZ2V0UGFuZVByb3AiLCJzdGF0ZSIsIm5leHRQcm9wcyIsImtleSIsIkNoaWxkcmVuIiwibWFwIiwiY2hpbGRyZW4iLCJjIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0Iiwic3BsaXQiLCJyZXNpemVyU2l6ZSIsIm9uQ2hhbmdlIiwibWluU2l6ZXMiLCJtYXhTaXplcyIsInNpemVzUHgiLCJkIiwic3BsaXRQYW5lRGltZW5zaW9ucyIsInNwbGl0UGFuZSIsInJlc2l6ZXJEaW1lbnNpb25zIiwiZ2V0UmVzaXplckRpbWVuc2lvbnMiLCJjb25jYXQiLCJwcmltYXJ5VW5pdCIsInNlY29uZGFyeVVuaXQiLCJwcmltYXJ5Iiwic2Vjb25kYXJ5IiwibGVmdCIsInJpZ2h0IiwidG9wIiwiYm90dG9tIiwicHJpbWFyeVNpemUiLCJzZWNvbmRhcnlTaXplIiwic3BsaXRQYW5lU2l6ZSIsInJlc2l6ZXJMZWZ0IiwicmVzaXplclJpZ2h0IiwicmVzaXplclRvcCIsInJlc2l6ZXJCb3R0b20iLCJwcmltYXJ5TWluU2l6ZSIsInNlY29uZGFyeU1pblNpemUiLCJwcmltYXJ5TWF4U2l6ZSIsInNlY29uZGFyeU1heFNpemUiLCJ1cGRhdGVSYXRpbyIsImNvbnZlcnRVbml0cyIsInJhdGlvSWR4IiwicyIsImZpbHRlciIsInJhdGlvIiwibGVuZ3RoIiwiaSIsImZvckVhY2giLCJjb250YWluZXJTaXplIiwiY2xhc3NOYW1lIiwicmF0aW9zIiwicGFuZUluZGV4IiwiZWxlbWVudHMiLCJyZWR1Y2UiLCJhY2MiLCJjaGlsZCIsInBhbmUiLCJpc1BhbmUiLCJ0eXBlIiwicGFuZVByb3BzIiwiaW5kZXgiLCJyZWYiLCJiaW5kIiwicmVzaXplciIsInByb3BUeXBlcyIsImFycmF5T2YiLCJub2RlIiwiaXNSZXF1aXJlZCIsInN0cmluZyIsIm9uZU9mIiwibnVtYmVyIiwiZnVuYyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGNBQWMsb0JBQVVDLEdBQVYsQ0FBYztBQUNoQ0MsV0FBUyxNQUR1QjtBQUVoQ0MsVUFBUSxNQUZ3QjtBQUdoQ0MsaUJBQWUsUUFIaUI7QUFJaENDLFFBQU0sQ0FKMEI7QUFLaENDLFdBQVMsTUFMdUI7QUFNaENDLFlBQVUsUUFOc0I7QUFPaENDLGNBQVksTUFQb0I7O0FBU2hDQyxhQUFXLE1BVHFCO0FBVWhDQyxTQUFPO0FBVnlCLENBQWQsQ0FBcEI7O0FBYUEsSUFB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d0csWUFBVixHQUF5QjtBQUN2QmhFLFNBQU8sVUFEZ0I7QUFFdkJDLGVBQWEsQ0FGVTtBQUd2QmpDLGVBQWE7QUFIVSxDQUF6Qjs7a0JBTWVSLFMiLCJmaWxlIjoiU3BsaXRQYW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY2xvbmVFbGVtZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmluZERPTU5vZGUgfSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IGdsYW1vcm91cyBmcm9tICdnbGFtb3JvdXMnO1xuaW1wb3J0IFJlc2l6ZXIgZnJvbSAnLi9SZXNpemVyJztcbmltcG9ydCBQYW5lIGZyb20gJy4vUGFuZSc7XG5cbmNvbnN0IENvbHVtblN0eWxlID0gZ2xhbW9yb3VzLmRpdih7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICBmbGV4OiAxLFxuICBvdXRsaW5lOiAnbm9uZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdXNlclNlbGVjdDogJ3RleHQnLFxuXG4gIG1pbkhlaWdodDogJzEwMCUnLFxuICB3aWR0aDogJzEwMCUnLFxufSk7XG5cbmNvbnN0IFJvd1N0eWxlID0gZ2xhbW9yb3VzLmRpdih7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICBmbGV4OiAxLFxuICBvdXRsaW5lOiAnbm9uZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdXNlclNlbGVjdDogJ3RleHQnLFxuXG59KTtcblxuLy8gdG9kbzogbW92ZSB1dGlscyBmbiB0byBzZXBhcmF0ZSBmaWxlXG5mdW5jdGlvbiBjb252ZXJ0IChzdHIsIHNpemUpIHtcbiAgY29uc3QgdG9rZW5zID0gc3RyLm1hdGNoKC8oWzAtOV0rKShbcHh8JV0qKS8pO1xuICBjb25zdCB2YWx1ZSA9IHRva2Vuc1sxXTtcbiAgY29uc3QgdW5pdCA9IHRva2Vuc1syXTtcbiAgcmV0dXJuIHRvUHgodmFsdWUsIHVuaXQsIHNpemUpO1xufVxuXG5mdW5jdGlvbiB0b1B4KHZhbHVlLCB1bml0ID0gJ3B4Jywgc2l6ZSkge1xuICBzd2l0Y2ggKHVuaXQpIHtcbiAgICBjYXNlICclJzoge1xuICAgICAgcmV0dXJuIChzaXplICogdmFsdWUgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHJldHVybiArdmFsdWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFVuaXQoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gXCJyYXRpb1wiO1xuICB9XG5cbiAgaWYoc2l6ZS5lbmRzV2l0aChcInB4XCIpKSB7XG4gICAgcmV0dXJuIFwicHhcIjtcbiAgfVxuXG4gIGlmKHNpemUuZW5kc1dpdGgoXCIlXCIpKSB7XG4gICAgcmV0dXJuIFwiJVwiO1xuICB9XG5cbiAgcmV0dXJuIFwicmF0aW9cIjtcbn1cblxuY2xhc3MgU3BsaXRQYW5lIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICBjb25zdCBzaXplcyA9IHRoaXMuZ2V0UGFuZVByb3AoXCJpbml0aWFsU2l6ZVwiLCBwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2l6ZXNcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzaXplczogdGhpcy5nZXRQYW5lUHJvcChcImluaXRpYWxTaXplXCIsIG5leHRQcm9wcyl9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG5cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgfVxuXG4gIG9uTW91c2VEb3duID0gKGV2ZW50LCByZXNpemVySW5kZXgpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5vbkRvd24ocmVzaXplckluZGV4KTtcbiAgfVxuXG4gIG9uVG91Y2hTdGFydCA9IChldmVudCwgcmVzaXplckluZGV4KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHRoaXMub25Eb3duKHJlc2l6ZXJJbmRleCk7XG4gIH1cblxuICBvbkRvd24gPSAocmVzaXplckluZGV4KSA9PiB7XG4gICAgY29uc3Qge2FsbG93UmVzaXplLCBvblJlc2l6ZVN0YXJ0fSA9IHRoaXMucHJvcHM7XG5cbiAgICBpZiAoIWFsbG93UmVzaXplKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5kaW1lbnNpb25zID0gdGhpcy5nZXRQYW5lRGltZW5zaW9ucygpO1xuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMub25Ub3VjaE1vdmUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5vbk1vdXNlVXApO1xuICAgIC8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5vbk1vdXNlVXApO1xuXG4gICAgaWYgKG9uUmVzaXplU3RhcnQpIHtcbiAgICAgIG9uUmVzaXplU3RhcnQocmVzaXplckluZGV4KTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlc2l6ZXJJbmRleCxcbiAgICB9KTtcbiAgfVxuXG4gIG9uTW91c2VNb3ZlID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHRoaXMub25Nb3ZlKGV2ZW50LmNsaWVudFgsIGV2ZW50LmNsaWVudFkpO1xuICB9XG5cbiAgb25Ub3VjaE1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgY29uc3Qge2NsaWVudFgsIGNsaWVudFl9ID0gZXZlbnQudG91Y2hlc1swXTtcblxuICAgIHRoaXMub25Nb3ZlKGNsaWVudFgsIGNsaWVudFkpO1xuICB9XG5cbiAgb25Nb3VzZVVwID0gKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG5cbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLm9uVG91Y2hNb3ZlKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMub25Nb3VzZVVwKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uUmVzaXplRW5kKSB7XG4gICAgICB0aGlzLnByb3BzLm9uUmVzaXplRW5kKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFuZVByb3Aoa2V5LCBwcm9wcykge1xuICAgIHJldHVybiBSZWFjdC5DaGlsZHJlbi5tYXAocHJvcHMuY2hpbGRyZW4sIGMgPT4gYy5wcm9wc1trZXldKTtcbiAgfVxuXG4gIGdldFBhbmVEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVFbGVtZW50cy5tYXAoZWwgPT4gZmluZERPTU5vZGUoZWwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgfVxuXG4gIGdldFJlc2l6ZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnJlc2l6ZXJFbGVtZW50cy5tYXAoZWwgPT4gZmluZERPTU5vZGUoZWwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKVxuICB9XG5cbiAgb25Nb3ZlKGNsaWVudFgsIGNsaWVudFkpIHtcbiAgICBjb25zdCB7IHNwbGl0LCByZXNpemVyU2l6ZSwgb25DaGFuZ2UgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyByZXNpemVySW5kZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgbWluU2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKCdtaW5TaXplJywgdGhpcy5wcm9wcyk7XG4gICAgY29uc3QgbWF4U2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKCdtYXhTaXplJywgdGhpcy5wcm9wcyk7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICBcbiAgICBjb25zdCBzaXplc1B4ID0gZGltZW5zaW9ucy5tYXAoZCA9PiBzcGxpdCA9PT0gXCJ2ZXJ0aWNhbFwiID8gZC53aWR0aCA6IGQuaGVpZ2h0KTtcbiAgICBcbiAgICBjb25zdCBzcGxpdFBhbmVEaW1lbnNpb25zID0gZmluZERPTU5vZGUodGhpcy5zcGxpdFBhbmUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHJlc2l6ZXJEaW1lbnNpb25zID0gdGhpcy5nZXRSZXNpemVyRGltZW5zaW9ucygpW3Jlc2l6ZXJJbmRleF07XG5cbiAgICBsZXQgc2l6ZXMgPSB0aGlzLnN0YXRlLnNpemVzLmNvbmNhdCgpO1xuICAgIFxuICAgIGNvbnN0IHByaW1hcnlVbml0ID0gZ2V0VW5pdChzaXplc1tyZXNpemVySW5kZXhdKTtcbiAgICBjb25zdCBzZWNvbmRhcnlVbml0ID0gZ2V0VW5pdChzaXplc1tyZXNpemVySW5kZXggKyAxXSk7XG4gICAgY29uc3QgcHJpbWFyeSA9IGRpbWVuc2lvbnNbcmVzaXplckluZGV4XTtcbiAgICBjb25zdCBzZWNvbmRhcnkgPSBkaW1lbnNpb25zW3Jlc2l6ZXJJbmRleCArIDFdO1xuXG4gICAgaWYgKFxuICAgICAgKHNwbGl0ID09PSAndmVydGljYWwnICYmXG4gICAgICAgIGNsaWVudFggPj0gcHJpbWFyeS5sZWZ0ICYmXG4gICAgICAgIGNsaWVudFggPD0gc2Vjb25kYXJ5LnJpZ2h0KSB8fFxuICAgICAgKHNwbGl0ICE9PSAndmVydGljYWwnICYmXG4gICAgICAgIGNsaWVudFkgPj0gcHJpbWFyeS50b3AgJiZcbiAgICAgICAgY2xpZW50WSA8PSBzZWNvbmRhcnkuYm90dG9tKVxuICAgICkge1xuICAgICAgbGV0IHByaW1hcnlTaXplO1xuICAgICAgbGV0IHNlY29uZGFyeVNpemU7XG4gICAgICBsZXQgc3BsaXRQYW5lU2l6ZTtcblxuICAgICAgaWYgKHNwbGl0ID09PSAndmVydGljYWwnKSB7XG4gICAgICAgIGNvbnN0IHJlc2l6ZXJMZWZ0ID0gY2xpZW50WCAtIChyZXNpemVyU2l6ZSAvIDIpO1xuICAgICAgICBjb25zdCByZXNpemVyUmlnaHQgPSBjbGllbnRYICsgKHJlc2l6ZXJTaXplIC8gMik7XG5cbiAgICAgICAgcHJpbWFyeVNpemUgPSByZXNpemVyTGVmdCAtIHByaW1hcnkubGVmdDtcbiAgICAgICAgc2Vjb25kYXJ5U2l6ZSA9IHNlY29uZGFyeS5yaWdodCAtIHJlc2l6ZXJSaWdodDtcbiAgICAgICAgc3BsaXRQYW5lU2l6ZSA9IHNwbGl0UGFuZURpbWVuc2lvbnMud2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXNpemVyVG9wID0gY2xpZW50WSAtIChyZXNpemVyU2l6ZSAvIDIpO1xuICAgICAgICBjb25zdCByZXNpemVyQm90dG9tID0gY2xpZW50WSArIChyZXNpemVyU2l6ZSAvIDIpO1xuXG4gICAgICAgIHByaW1hcnlTaXplID0gcmVzaXplclRvcCAtIHByaW1hcnkudG9wO1xuICAgICAgICBzZWNvbmRhcnlTaXplID0gc2Vjb25kYXJ5LmJvdHRvbSAtIHJlc2l6ZXJCb3R0b207XG4gICAgICAgIHNwbGl0UGFuZVNpemUgPSBzcGxpdFBhbmVEaW1lbnNpb25zLmhlaWdodDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJpbWFyeU1pblNpemUgPSBjb252ZXJ0KG1pblNpemVzW3Jlc2l6ZXJJbmRleF0sIHNwbGl0UGFuZVNpemUpO1xuICAgICAgY29uc3Qgc2Vjb25kYXJ5TWluU2l6ZSA9IGNvbnZlcnQobWluU2l6ZXNbcmVzaXplckluZGV4ICsgMV0sIHNwbGl0UGFuZVNpemUpO1xuXG4gICAgICBjb25zdCBwcmltYXJ5TWF4U2l6ZSA9IGNvbnZlcnQobWF4U2l6ZXNbcmVzaXplckluZGV4XSwgc3BsaXRQYW5lU2l6ZSk7XG4gICAgICBjb25zdCBzZWNvbmRhcnlNYXhTaXplID0gY29udmVydChtYXhTaXplc1tyZXNpemVySW5kZXggKyAxXSwgc3BsaXRQYW5lU2l6ZSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgcHJpbWFyeU1pblNpemUgPD0gcHJpbWFyeVNpemUgJiZcbiAgICAgICAgcHJpbWFyeU1heFNpemUgPj0gcHJpbWFyeVNpemUgJiZcbiAgICAgICAgc2Vjb25kYXJ5TWluU2l6ZSA8PSBzZWNvbmRhcnlTaXplICYmXG4gICAgICAgIHNlY29uZGFyeU1heFNpemUgPj0gc2Vjb25kYXJ5U2l6ZVxuICAgICAgKSB7XG4gICAgICAgIHNpemVzUHhbcmVzaXplckluZGV4XSA9IHByaW1hcnlTaXplO1xuICAgICAgICBzaXplc1B4W3Jlc2l6ZXJJbmRleCArIDFdID0gc2Vjb25kYXJ5U2l6ZTtcblxuICAgICAgICBsZXQgdXBkYXRlUmF0aW87XG5cbiAgICAgICAgaWYgKHByaW1hcnlVbml0ICE9PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICBzaXplc1tyZXNpemVySW5kZXhdID0gdGhpcy5jb252ZXJ0VW5pdHMocHJpbWFyeVNpemUsIHByaW1hcnlVbml0LCBzcGxpdFBhbmVTaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cGRhdGVSYXRpbyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2Vjb25kYXJ5VW5pdCAhPT0gXCJyYXRpb1wiKSB7XG4gICAgICAgICAgc2l6ZXNbcmVzaXplckluZGV4ICsgMV0gPSB0aGlzLmNvbnZlcnRVbml0cyhzZWNvbmRhcnlTaXplLCBzZWNvbmRhcnlVbml0LCBzcGxpdFBhbmVTaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cGRhdGVSYXRpbyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXBkYXRlUmF0aW8pIHtcbiAgICAgICAgICBjb25zdCByYXRpb0lkeCA9IHNpemVzLm1hcCgocywgaWR4KSA9PiBnZXRVbml0KHMpID09PSBcInJhdGlvXCIgPyBpZHggOiAtMSkuZmlsdGVyKGlkeCA9PiBpZHggPj0gMCk7XG4gICAgICAgICAgbGV0IHJhdGlvID0gcmF0aW9JZHgubGVuZ3RoID09PSAxID8gWzFdIDogcmF0aW9JZHgubWFwKGkgPT4gc2l6ZXNQeFtpXSk7XG5cbiAgICAgICAgICByYXRpb0lkeC5mb3JFYWNoKChpLCBpZHgpID0+IHNpemVzW2ldID0gcmF0aW9baWR4XSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtzaXplc30pO1xuXG4gICAgICAgIGlmIChvbkNoYW5nZSkge1xuICAgICAgICAgIG9uQ2hhbmdlKHNpemVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnZlcnRVbml0cyhzaXplLCB1bml0LCBjb250YWluZXJTaXplKSB7XG4gICAgc3dpdGNoKHVuaXQpIHtcbiAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgIHJldHVybiBgJHtzaXplL2NvbnRhaW5lclNpemUqMTAwfSVgO1xuICAgICAgY2FzZSBcInB4XCI6XG4gICAgICAgIHJldHVybiBgJHtzaXplfXB4YDtcbiAgICAgIGNhc2UgXCJyYXRpb1wiOlxuICAgICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG4gIH1cblxuICBzZXRQYW5lUmVmID0gKGlkeCwgZWwpID0+IHtcbiAgICBpZiAoIXRoaXMucGFuZUVsZW1lbnRzKSB7XG4gICAgICB0aGlzLnBhbmVFbGVtZW50cyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMucGFuZUVsZW1lbnRzW2lkeF0gPSBlbDtcbiAgfVxuXG4gIHNldFJlc2l6ZXJSZWYgPSAoaWR4LCBlbCkgPT4ge1xuICAgIGlmICghdGhpcy5yZXNpemVyRWxlbWVudHMpIHtcbiAgICAgIHRoaXMucmVzaXplckVsZW1lbnRzID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5yZXNpemVyRWxlbWVudHNbaWR4XSA9IGVsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgc3BsaXQgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyByYXRpb3MsIHNpemVzIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgbGV0IHBhbmVJbmRleCA9IDA7XG4gICAgbGV0IHJlc2l6ZXJJbmRleCA9IDA7XG5cbiAgICBjb25zdCBlbGVtZW50cyA9IGNoaWxkcmVuLnJlZHVjZSgoYWNjLCBjaGlsZCkgPT4ge1xuICAgICAgLy8gY29uc3Qgc2l6ZSA9IHNpemVzW3BhbmVJbmRleF0gPyBzaXplc1twYW5lSW5kZXhdIDogMDtcbiAgICAgIGxldCBwYW5lO1xuICAgICAgY29uc3QgaXNQYW5lID0gY2hpbGQudHlwZSA9PT0gUGFuZTtcbiAgICAgIGNvbnN0IHBhbmVQcm9wcyA9IHtcbiAgICAgICAgaW5kZXg6IHBhbmVJbmRleCxcbiAgICAgICAgJ2RhdGEtdHlwZSc6ICdQYW5lJyxcbiAgICAgICAgLy8gc2l6ZTogc2l6ZSxcbiAgICAgICAgc3BsaXQ6IHNwbGl0LFxuICAgICAgICBrZXk6IGBQYW5lLSR7cGFuZUluZGV4fWAsXG4gICAgICAgIHJlZjogdGhpcy5zZXRQYW5lUmVmLmJpbmQobnVsbCwgcGFuZUluZGV4KVxuICAgICAgfTtcbiAgICAgIGlmIChpc1BhbmUpIHtcbiAgICAgICAgcGFuZSA9IGNsb25lRWxlbWVudChjaGlsZCwgcGFuZVByb3BzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhbmUgPSA8UGFuZSB7Li4ucGFuZVByb3BzfT57Y2hpbGR9PC9QYW5lPjtcbiAgICAgIH1cbiAgICAgIHBhbmVJbmRleCsrO1xuICAgICAgaWYgKGFjYy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFsuLi5hY2MsIHBhbmVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzaXplciA9IChcbiAgICAgICAgICA8UmVzaXplclxuICAgICAgICAgICAgaW5kZXg9e3Jlc2l6ZXJJbmRleH1cbiAgICAgICAgICAgIGtleT17YFJlc2l6ZXItJHtyZXNpemVySW5kZXh9YH1cbiAgICAgICAgICAgIHJlZj17dGhpcy5zZXRSZXNpemVyUmVmLmJpbmQobnVsbCwgcmVzaXplckluZGV4KX1cbiAgICAgICAgICAgIHNwbGl0PXtzcGxpdH1cbiAgICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLm9uTW91c2VEb3dufVxuICAgICAgICAgICAgb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgICByZXNpemVySW5kZXgrKztcbiAgICAgICAgcmV0dXJuIFsuLi5hY2MsIHJlc2l6ZXIsIHBhbmVdO1xuICAgICAgfVxuICAgIH0sIFtdKTtcblxuICAgIGlmIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFJvd1N0eWxlXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgICAgZGF0YS10eXBlPVwiU3BsaXRQYW5lXCJcbiAgICAgICAgICBkYXRhLXNwbGl0PXtzcGxpdH1cbiAgICAgICAgICByZWY9e3NwbGl0UGFuZSA9PiAodGhpcy5zcGxpdFBhbmUgPSBzcGxpdFBhbmUpfVxuICAgICAgICA+XG4gICAgICAgICAge2VsZW1lbnRzfVxuICAgICAgICA8L1Jvd1N0eWxlPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbHVtblN0eWxlXG4gICAgICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgICAgZGF0YS10eXBlPVwiU3BsaXRQYW5lXCJcbiAgICAgICAgICBkYXRhLXNwbGl0PXtzcGxpdH1cbiAgICAgICAgICByZWY9e3NwbGl0UGFuZSA9PiAodGhpcy5zcGxpdFBhbmUgPSBzcGxpdFBhbmUpfVxuICAgICAgICA+XG4gICAgICAgICAge2VsZW1lbnRzfVxuICAgICAgICA8L0NvbHVtblN0eWxlPlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuU3BsaXRQYW5lLnByb3BUeXBlcyA9IHtcbiAgY2hpbGRyZW46IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5ub2RlKS5pc1JlcXVpcmVkLFxuICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gIHNwbGl0OiBQcm9wVHlwZXMub25lT2YoWyd2ZXJ0aWNhbCcsICdob3Jpem9udGFsJ10pLFxuICByZXNpemVyU2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuICBvblJlc2l6ZVN0YXJ0OiBQcm9wVHlwZXMuZnVuYyxcbiAgb25SZXNpemVFbmQ6IFByb3BUeXBlcy5mdW5jLFxufTtcblxuU3BsaXRQYW5lLmRlZmF1bHRQcm9wcyA9IHtcbiAgc3BsaXQ6ICd2ZXJ0aWNhbCcsXG4gIHJlc2l6ZXJTaXplOiAxLFxuICBhbGxvd1Jlc2l6ZTogdHJ1ZVxufTtcblxuZXhwb3J0IGRlZmF1bHQgU3BsaXRQYW5lO1xuIl19