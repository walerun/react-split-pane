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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TcGxpdFBhbmUuanMiXSwibmFtZXMiOlsiQ29sdW1uU3R5bGUiLCJkaXYiLCJkaXNwbGF5IiwiaGVpZ2h0IiwiZmxleERpcmVjdGlvbiIsImZsZXgiLCJvdXRsaW5lIiwib3ZlcmZsb3ciLCJ1c2VyU2VsZWN0IiwibWluSGVpZ2h0Iiwid2lkdGgiLCJSb3dTdHlsZSIsImNvbnZlcnQiLCJzdHIiLCJzaXplIiwidG9rZW5zIiwibWF0Y2giLCJ2YWx1ZSIsInVuaXQiLCJ0b1B4IiwidG9GaXhlZCIsImdldFVuaXQiLCJlbmRzV2l0aCIsIlNwbGl0UGFuZSIsInByb3BzIiwib25Nb3VzZURvd24iLCJldmVudCIsInJlc2l6ZXJJbmRleCIsIm9uRG93biIsIm9uVG91Y2hTdGFydCIsImFsbG93UmVzaXplIiwib25SZXNpemVTdGFydCIsImRpbWVuc2lvbnMiLCJnZXRQYW5lRGltZW5zaW9ucyIsImRvY3VtZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uTW91c2VNb3ZlIiwib25Nb3VzZVVwIiwic2V0U3RhdGUiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJvbk1vdmUiLCJjbGllbnRYIiwiY2xpZW50WSIsIm9uVG91Y2hNb3ZlIiwidG91Y2hlcyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJvblJlc2l6ZUVuZCIsInNldFBhbmVSZWYiLCJpZHgiLCJlbCIsInBhbmVFbGVtZW50cyIsInNldFJlc2l6ZXJSZWYiLCJyZXNpemVyRWxlbWVudHMiLCJzaXplcyIsImdldFBhbmVQcm9wIiwic3RhdGUiLCJuZXh0UHJvcHMiLCJ3aW5kb3ciLCJyZXNpemUiLCJrZXkiLCJDaGlsZHJlbiIsIm1hcCIsImNoaWxkcmVuIiwiYyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInNwbGl0IiwicmVzaXplclNpemUiLCJvbkNoYW5nZSIsIm1pblNpemVzIiwibWF4U2l6ZXMiLCJzaXplc1B4IiwiZCIsInNwbGl0UGFuZURpbWVuc2lvbnMiLCJzcGxpdFBhbmUiLCJyZXNpemVyRGltZW5zaW9ucyIsImdldFJlc2l6ZXJEaW1lbnNpb25zIiwiY29uY2F0IiwicHJpbWFyeVVuaXQiLCJzZWNvbmRhcnlVbml0IiwicHJpbWFyeSIsInNlY29uZGFyeSIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsInByaW1hcnlTaXplIiwic2Vjb25kYXJ5U2l6ZSIsInNwbGl0UGFuZVNpemUiLCJyZXNpemVyTGVmdCIsInJlc2l6ZXJSaWdodCIsInJlc2l6ZXJUb3AiLCJyZXNpemVyQm90dG9tIiwicHJpbWFyeU1pblNpemUiLCJzZWNvbmRhcnlNaW5TaXplIiwicHJpbWFyeU1heFNpemUiLCJzZWNvbmRhcnlNYXhTaXplIiwidXBkYXRlUmF0aW8iLCJjb252ZXJ0VW5pdHMiLCJyYXRpb0lkeCIsInMiLCJmaWx0ZXIiLCJyYXRpbyIsImxlbmd0aCIsImkiLCJmb3JFYWNoIiwiY29udGFpbmVyU2l6ZSIsImNsYXNzTmFtZSIsInJhdGlvcyIsInBhbmVJbmRleCIsImVsZW1lbnRzIiwicmVkdWNlIiwiYWNjIiwiY2hpbGQiLCJwYW5lIiwiaXNQYW5lIiwidHlwZSIsInBhbmVQcm9wcyIsImluZGV4IiwicmVmIiwiYmluZCIsInJlc2l6ZXIiLCJwcm9wVHlwZXMiLCJhcnJheU9mIiwibm9kZSIsImlzUmVxdWlyZWQiLCJzdHJpbmciLCJvbmVPZiIsIm51bWJlciIsImZ1bmMiLCJkZWZhdWx0UHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxjQUFjLG9CQUFVQyxHQUFWLENBQWM7QUFDaENDLFdBQVMsTUFEdUI7QUFFaENDLFVBQVEsTUFGd0I7QUFHaENDLGlCQUFlLFFBSGlCO0FBSWhDQyxRQUFNLENBSjBCO0FBS2hDQyxXQUFTLE1BTHVCO0FBTWhDQyxZQUFVLFFBTnNCO0FBT2hDQyxjQUFZLE1BUG9COztBQVNoQ0MsYUFBVyxNQVRx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QUFEO0FBQUE7QUFDRSx1QkFBV3lDLFNBRGI7QUFFRSx5QkFBVSxXQUZaO0FBR0UsMEJBQVl6QyxLQUhkO0FBSUUsaUJBQUs7QUFBQSxxQkFBYyxPQUFLUSxTQUFMLEdBQWlCQSxTQUEvQjtBQUFBO0FBSlA7QUFNR29DO0FBTkgsU0FERjtBQVVELE9BWEQsTUFXTztBQUNMLGVBQ0U7QUFBQyxxQkFBRDtBQUFBO0FBQ0UsdUJBQVdILFNBRGI7QUFFRSx5QkFBVSxXQUZaO0FBR0UsMEJBQVl6QyxLQUhkO0FBSUUsaUJBQUs7QUFBQSxxQkFBYyxPQUFLUSxTQUFMLEdBQWlCQSxTQUEvQjtBQUFBO0FBSlA7QUFNR29DO0FBTkgsU0FERjtBQVVEO0FBQ0Y7Ozs7OztBQUdIeEYsVUFBVW9HLFNBQVYsR0FBc0I7QUFDcEIzRCxZQUFVLG9CQUFVNEQsT0FBVixDQUFrQixvQkFBVUMsSUFBNUIsRUFBa0NDLFVBRHhCO0FBRXBCbEIsYUFBVyxvQkFBVW1CLE1BRkQ7QUFHcEI1RCxTQUFPLG9CQUFVNkQsS0FBVixDQUFnQixDQUFDLFVBQUQsRUFBYSxZQUFiLENBQWhCLENBSGE7QUFJcEI1RCxlQUFhLG9CQUFVNkQsTUFKSDtBQUtwQjVELFlBQVUsb0JBQVU2RCxJQUxBO0FBTXBCbkcsaUJBQWUsb0JBQVVtRyxJQU5MO0FBT3BCbEYsZUFBYSxvQkFBVWtGO0FBUEgsQ0FBdEI7O0FBVUEzRyxVQUFVNEcsWUFBVixHQUF5QjtBQUN2QmhFLFNBQU8sVUFEZ0I7QUFFdkJDLGVBQWEsQ0FGVTtBQUd2QnRDLGVBQWE7QUFIVSxDQUF6Qjs7a0JBTWVQLFMiLCJmaWxlIjoiU3BsaXRQYW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY2xvbmVFbGVtZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZmluZERPTU5vZGUgfSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IGdsYW1vcm91cyBmcm9tICdnbGFtb3JvdXMnO1xuaW1wb3J0IFJlc2l6ZXIgZnJvbSAnLi9SZXNpemVyJztcbmltcG9ydCBQYW5lIGZyb20gJy4vUGFuZSc7XG5cbmNvbnN0IENvbHVtblN0eWxlID0gZ2xhbW9yb3VzLmRpdih7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICBmbGV4OiAxLFxuICBvdXRsaW5lOiAnbm9uZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdXNlclNlbGVjdDogJ3RleHQnLFxuXG4gIG1pbkhlaWdodDogJzEwMCUnLFxuICB3aWR0aDogJzEwMCUnLFxufSk7XG5cbmNvbnN0IFJvd1N0eWxlID0gZ2xhbW9yb3VzLmRpdih7XG4gIGRpc3BsYXk6ICdmbGV4JyxcbiAgaGVpZ2h0OiAnMTAwJScsXG4gIGZsZXhEaXJlY3Rpb246ICdyb3cnLFxuICBmbGV4OiAxLFxuICBvdXRsaW5lOiAnbm9uZScsXG4gIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgdXNlclNlbGVjdDogJ3RleHQnLFxuXG59KTtcblxuLy8gdG9kbzogbW92ZSB1dGlscyBmbiB0byBzZXBhcmF0ZSBmaWxlXG5mdW5jdGlvbiBjb252ZXJ0IChzdHIsIHNpemUpIHtcbiAgY29uc3QgdG9rZW5zID0gc3RyLm1hdGNoKC8oWzAtOV0rKShbcHh8JV0qKS8pO1xuICBjb25zdCB2YWx1ZSA9IHRva2Vuc1sxXTtcbiAgY29uc3QgdW5pdCA9IHRva2Vuc1syXTtcbiAgcmV0dXJuIHRvUHgodmFsdWUsIHVuaXQsIHNpemUpO1xufVxuXG5mdW5jdGlvbiB0b1B4KHZhbHVlLCB1bml0ID0gJ3B4Jywgc2l6ZSkge1xuICBzd2l0Y2ggKHVuaXQpIHtcbiAgICBjYXNlICclJzoge1xuICAgICAgcmV0dXJuIChzaXplICogdmFsdWUgLyAxMDApLnRvRml4ZWQoMik7XG4gICAgfVxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHJldHVybiArdmFsdWU7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFVuaXQoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgPT09IFwibnVtYmVyXCIpIHtcbiAgICByZXR1cm4gXCJyYXRpb1wiO1xuICB9XG5cbiAgaWYoc2l6ZS5lbmRzV2l0aChcInB4XCIpKSB7XG4gICAgcmV0dXJuIFwicHhcIjtcbiAgfVxuXG4gIGlmKHNpemUuZW5kc1dpdGgoXCIlXCIpKSB7XG4gICAgcmV0dXJuIFwiJVwiO1xuICB9XG5cbiAgcmV0dXJuIFwicmF0aW9cIjtcbn1cblxuY2xhc3MgU3BsaXRQYW5lIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICBjb25zdCBzaXplcyA9IHRoaXMuZ2V0UGFuZVByb3AoXCJpbml0aWFsU2l6ZVwiLCBwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgc2l6ZXNcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtzaXplczogdGhpcy5nZXRQYW5lUHJvcChcImluaXRpYWxTaXplXCIsIG5leHRQcm9wcyl9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5vbk1vdXNlTW92ZSk7XG4gICAgLy8gZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgdGhpcy5vblRvdWNoTW92ZSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplKTtcbiAgfVxuXG4gIG9uTW91c2VEb3duID0gKGV2ZW50LCByZXNpemVySW5kZXgpID0+IHtcbiAgICB0aGlzLm9uRG93bihyZXNpemVySW5kZXgpO1xuICB9XG5cbiAgb25Ub3VjaFN0YXJ0ID0gKGV2ZW50LCByZXNpemVySW5kZXgpID0+IHtcbiAgICB0aGlzLm9uRG93bihyZXNpemVySW5kZXgpO1xuICB9XG5cbiAgb25Eb3duID0gKHJlc2l6ZXJJbmRleCkgPT4ge1xuICAgIGNvbnN0IHthbGxvd1Jlc2l6ZSwgb25SZXNpemVTdGFydH0gPSB0aGlzLnByb3BzO1xuXG4gICAgaWYgKCFhbGxvd1Jlc2l6ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZGltZW5zaW9ucyA9IHRoaXMuZ2V0UGFuZURpbWVuc2lvbnMoKTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMub25Nb3VzZU1vdmUpO1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLm9uTW91c2VVcCk7XG5cbiAgICBpZiAob25SZXNpemVTdGFydCkge1xuICAgICAgb25SZXNpemVTdGFydChyZXNpemVySW5kZXgpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVzaXplckluZGV4LFxuICAgIH0pO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUgPSAoZSkgPT4ge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdGhpcy5vbk1vdmUoZS5jbGllbnRYLCBlLmNsaWVudFkpO1xuICB9XG5cbiAgb25Ub3VjaE1vdmUgPSAoZXZlbnQpID0+IHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLm9uTW92ZShldmVudC50b3VjaGVzWzBdLmNsaWVudFgsIGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSk7XG4gIH1cblxuICBvbk1vdXNlVXAgPSAoKSA9PiB7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwKTtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlKTtcblxuICAgIGlmICh0aGlzLnByb3BzLm9uUmVzaXplRW5kKSB7XG4gICAgICB0aGlzLnByb3BzLm9uUmVzaXplRW5kKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UGFuZVByb3Aoa2V5LCBwcm9wcykge1xuICAgIHJldHVybiBSZWFjdC5DaGlsZHJlbi5tYXAocHJvcHMuY2hpbGRyZW4sIGMgPT4gYy5wcm9wc1trZXldKTtcbiAgfVxuXG4gIGdldFBhbmVEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVFbGVtZW50cy5tYXAoZWwgPT4gZmluZERPTU5vZGUoZWwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcbiAgfVxuXG4gIGdldFJlc2l6ZXJEaW1lbnNpb25zKCkge1xuICAgIHJldHVybiB0aGlzLnJlc2l6ZXJFbGVtZW50cy5tYXAoZWwgPT4gZmluZERPTU5vZGUoZWwpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKVxuICB9XG5cbiAgb25Nb3ZlKGNsaWVudFgsIGNsaWVudFkpIHtcbiAgICBjb25zdCB7IHNwbGl0LCByZXNpemVyU2l6ZSwgb25DaGFuZ2UgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyByZXNpemVySW5kZXggfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3QgbWluU2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKCdtaW5TaXplJywgdGhpcy5wcm9wcyk7XG4gICAgY29uc3QgbWF4U2l6ZXMgPSB0aGlzLmdldFBhbmVQcm9wKCdtYXhTaXplJywgdGhpcy5wcm9wcyk7XG4gICAgY29uc3QgZGltZW5zaW9ucyA9IHRoaXMuZGltZW5zaW9ucztcbiAgICBcbiAgICBjb25zdCBzaXplc1B4ID0gZGltZW5zaW9ucy5tYXAoZCA9PiBzcGxpdCA9PT0gXCJ2ZXJ0aWNhbFwiID8gZC53aWR0aCA6IGQuaGVpZ2h0KTtcbiAgICBcbiAgICBjb25zdCBzcGxpdFBhbmVEaW1lbnNpb25zID0gZmluZERPTU5vZGUodGhpcy5zcGxpdFBhbmUpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHJlc2l6ZXJEaW1lbnNpb25zID0gdGhpcy5nZXRSZXNpemVyRGltZW5zaW9ucygpW3Jlc2l6ZXJJbmRleF07XG5cbiAgICBsZXQgc2l6ZXMgPSB0aGlzLnN0YXRlLnNpemVzLmNvbmNhdCgpO1xuICAgIFxuICAgIGNvbnN0IHByaW1hcnlVbml0ID0gZ2V0VW5pdChzaXplc1tyZXNpemVySW5kZXhdKTtcbiAgICBjb25zdCBzZWNvbmRhcnlVbml0ID0gZ2V0VW5pdChzaXplc1tyZXNpemVySW5kZXggKyAxXSk7XG4gICAgY29uc3QgcHJpbWFyeSA9IGRpbWVuc2lvbnNbcmVzaXplckluZGV4XTtcbiAgICBjb25zdCBzZWNvbmRhcnkgPSBkaW1lbnNpb25zW3Jlc2l6ZXJJbmRleCArIDFdO1xuXG4gICAgaWYgKFxuICAgICAgKHNwbGl0ID09PSAndmVydGljYWwnICYmXG4gICAgICAgIGNsaWVudFggPj0gcHJpbWFyeS5sZWZ0ICYmXG4gICAgICAgIGNsaWVudFggPD0gc2Vjb25kYXJ5LnJpZ2h0KSB8fFxuICAgICAgKHNwbGl0ICE9PSAndmVydGljYWwnICYmXG4gICAgICAgIGNsaWVudFkgPj0gcHJpbWFyeS50b3AgJiZcbiAgICAgICAgY2xpZW50WSA8PSBzZWNvbmRhcnkuYm90dG9tKVxuICAgICkge1xuICAgICAgbGV0IHByaW1hcnlTaXplO1xuICAgICAgbGV0IHNlY29uZGFyeVNpemU7XG4gICAgICBsZXQgc3BsaXRQYW5lU2l6ZTtcblxuICAgICAgaWYgKHNwbGl0ID09PSAndmVydGljYWwnKSB7XG4gICAgICAgIGNvbnN0IHJlc2l6ZXJMZWZ0ID0gY2xpZW50WCAtIChyZXNpemVyU2l6ZSAvIDIpO1xuICAgICAgICBjb25zdCByZXNpemVyUmlnaHQgPSBjbGllbnRYICsgKHJlc2l6ZXJTaXplIC8gMik7XG5cbiAgICAgICAgcHJpbWFyeVNpemUgPSByZXNpemVyTGVmdCAtIHByaW1hcnkubGVmdDtcbiAgICAgICAgc2Vjb25kYXJ5U2l6ZSA9IHNlY29uZGFyeS5yaWdodCAtIHJlc2l6ZXJSaWdodDtcbiAgICAgICAgc3BsaXRQYW5lU2l6ZSA9IHNwbGl0UGFuZURpbWVuc2lvbnMud2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCByZXNpemVyVG9wID0gY2xpZW50WSAtIChyZXNpemVyU2l6ZSAvIDIpO1xuICAgICAgICBjb25zdCByZXNpemVyQm90dG9tID0gY2xpZW50WSArIChyZXNpemVyU2l6ZSAvIDIpO1xuXG4gICAgICAgIHByaW1hcnlTaXplID0gcmVzaXplclRvcCAtIHByaW1hcnkudG9wO1xuICAgICAgICBzZWNvbmRhcnlTaXplID0gc2Vjb25kYXJ5LmJvdHRvbSAtIHJlc2l6ZXJCb3R0b207XG4gICAgICAgIHNwbGl0UGFuZVNpemUgPSBzcGxpdFBhbmVEaW1lbnNpb25zLmhlaWdodDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJpbWFyeU1pblNpemUgPSBjb252ZXJ0KG1pblNpemVzW3Jlc2l6ZXJJbmRleF0sIHNwbGl0UGFuZVNpemUpO1xuICAgICAgY29uc3Qgc2Vjb25kYXJ5TWluU2l6ZSA9IGNvbnZlcnQobWluU2l6ZXNbcmVzaXplckluZGV4ICsgMV0sIHNwbGl0UGFuZVNpemUpO1xuXG4gICAgICBjb25zdCBwcmltYXJ5TWF4U2l6ZSA9IGNvbnZlcnQobWF4U2l6ZXNbcmVzaXplckluZGV4XSwgc3BsaXRQYW5lU2l6ZSk7XG4gICAgICBjb25zdCBzZWNvbmRhcnlNYXhTaXplID0gY29udmVydChtYXhTaXplc1tyZXNpemVySW5kZXggKyAxXSwgc3BsaXRQYW5lU2l6ZSk7XG5cbiAgICAgIGlmIChcbiAgICAgICAgcHJpbWFyeU1pblNpemUgPD0gcHJpbWFyeVNpemUgJiZcbiAgICAgICAgcHJpbWFyeU1heFNpemUgPj0gcHJpbWFyeVNpemUgJiZcbiAgICAgICAgc2Vjb25kYXJ5TWluU2l6ZSA8PSBzZWNvbmRhcnlTaXplICYmXG4gICAgICAgIHNlY29uZGFyeU1heFNpemUgPj0gc2Vjb25kYXJ5U2l6ZVxuICAgICAgKSB7XG4gICAgICAgIHNpemVzUHhbcmVzaXplckluZGV4XSA9IHByaW1hcnlTaXplO1xuICAgICAgICBzaXplc1B4W3Jlc2l6ZXJJbmRleCArIDFdID0gc2Vjb25kYXJ5U2l6ZTtcblxuICAgICAgICBsZXQgdXBkYXRlUmF0aW87XG5cbiAgICAgICAgaWYgKHByaW1hcnlVbml0ICE9PSBcInJhdGlvXCIpIHtcbiAgICAgICAgICBzaXplc1tyZXNpemVySW5kZXhdID0gdGhpcy5jb252ZXJ0VW5pdHMocHJpbWFyeVNpemUsIHByaW1hcnlVbml0LCBzcGxpdFBhbmVTaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cGRhdGVSYXRpbyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2Vjb25kYXJ5VW5pdCAhPT0gXCJyYXRpb1wiKSB7XG4gICAgICAgICAgc2l6ZXNbcmVzaXplckluZGV4ICsgMV0gPSB0aGlzLmNvbnZlcnRVbml0cyhzZWNvbmRhcnlTaXplLCBzZWNvbmRhcnlVbml0LCBzcGxpdFBhbmVTaXplKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB1cGRhdGVSYXRpbyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodXBkYXRlUmF0aW8pIHtcbiAgICAgICAgICBjb25zdCByYXRpb0lkeCA9IHNpemVzLm1hcCgocywgaWR4KSA9PiBnZXRVbml0KHMpID09PSBcInJhdGlvXCIgPyBpZHggOiAtMSkuZmlsdGVyKGlkeCA9PiBpZHggPj0gMCk7XG4gICAgICAgICAgbGV0IHJhdGlvID0gcmF0aW9JZHgubGVuZ3RoID09PSAxID8gWzFdIDogcmF0aW9JZHgubWFwKGkgPT4gc2l6ZXNQeFtpXSk7XG5cbiAgICAgICAgICByYXRpb0lkeC5mb3JFYWNoKChpLCBpZHgpID0+IHNpemVzW2ldID0gcmF0aW9baWR4XSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtzaXplc30pO1xuXG4gICAgICAgIGlmIChvbkNoYW5nZSkge1xuICAgICAgICAgIG9uQ2hhbmdlKHNpemVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnZlcnRVbml0cyhzaXplLCB1bml0LCBjb250YWluZXJTaXplKSB7XG4gICAgc3dpdGNoKHVuaXQpIHtcbiAgICAgIGNhc2UgXCIlXCI6XG4gICAgICAgIHJldHVybiBgJHtzaXplL2NvbnRhaW5lclNpemUqMTAwfSVgO1xuICAgICAgY2FzZSBcInB4XCI6XG4gICAgICAgIHJldHVybiBgJHtzaXplfXB4YDtcbiAgICAgIGNhc2UgXCJyYXRpb1wiOlxuICAgICAgICByZXR1cm4gc2l6ZTtcbiAgICB9XG4gIH1cblxuICBzZXRQYW5lUmVmID0gKGlkeCwgZWwpID0+IHtcbiAgICBpZiAoIXRoaXMucGFuZUVsZW1lbnRzKSB7XG4gICAgICB0aGlzLnBhbmVFbGVtZW50cyA9IFtdO1xuICAgIH1cblxuICAgIHRoaXMucGFuZUVsZW1lbnRzW2lkeF0gPSBlbDtcbiAgfVxuXG4gIHNldFJlc2l6ZXJSZWYgPSAoaWR4LCBlbCkgPT4ge1xuICAgIGlmICghdGhpcy5yZXNpemVyRWxlbWVudHMpIHtcbiAgICAgIHRoaXMucmVzaXplckVsZW1lbnRzID0gW107XG4gICAgfVxuXG4gICAgdGhpcy5yZXNpemVyRWxlbWVudHNbaWR4XSA9IGVsO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHsgY2hpbGRyZW4sIGNsYXNzTmFtZSwgc3BsaXQgfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgeyByYXRpb3MsIHNpemVzIH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgbGV0IHBhbmVJbmRleCA9IDA7XG4gICAgbGV0IHJlc2l6ZXJJbmRleCA9IDA7XG5cbiAgICBjb25zdCBlbGVtZW50cyA9IGNoaWxkcmVuLnJlZHVjZSgoYWNjLCBjaGlsZCkgPT4ge1xuICAgICAgLy8gY29uc3Qgc2l6ZSA9IHNpemVzW3BhbmVJbmRleF0gPyBzaXplc1twYW5lSW5kZXhdIDogMDtcbiAgICAgIGxldCBwYW5lO1xuICAgICAgY29uc3QgaXNQYW5lID0gY2hpbGQudHlwZSA9PT0gUGFuZTtcbiAgICAgIGNvbnN0IHBhbmVQcm9wcyA9IHtcbiAgICAgICAgaW5kZXg6IHBhbmVJbmRleCxcbiAgICAgICAgJ2RhdGEtdHlwZSc6ICdQYW5lJyxcbiAgICAgICAgLy8gc2l6ZTogc2l6ZSxcbiAgICAgICAgc3BsaXQ6IHNwbGl0LFxuICAgICAgICBrZXk6IGBQYW5lLSR7cGFuZUluZGV4fWAsXG4gICAgICAgIHJlZjogdGhpcy5zZXRQYW5lUmVmLmJpbmQobnVsbCwgcGFuZUluZGV4KVxuICAgICAgfTtcbiAgICAgIGlmIChpc1BhbmUpIHtcbiAgICAgICAgcGFuZSA9IGNsb25lRWxlbWVudChjaGlsZCwgcGFuZVByb3BzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBhbmUgPSA8UGFuZSB7Li4ucGFuZVByb3BzfT57Y2hpbGR9PC9QYW5lPjtcbiAgICAgIH1cbiAgICAgIHBhbmVJbmRleCsrO1xuICAgICAgaWYgKGFjYy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIFsuLi5hY2MsIHBhbmVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcmVzaXplciA9IChcbiAgICAgICAgICA8UmVzaXplclxuICAgICAgICAgICAgaW5kZXg9e3Jlc2l6ZXJJbmRleH1cbiAgICAgICAgICAgIGtleT17YFJlc2l6ZXItJHtyZXNpemVySW5kZXh9YH1cbiAgICAgICAgICAgIHJlZj17dGhpcy5zZXRSZXNpemVyUmVmLmJpbmQobnVsbCwgcmVzaXplckluZGV4KX1cbiAgICAgICAgICAgIHNwbGl0PXtzcGxpdH1cbiAgICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLm9uTW91c2VEb3dufVxuICAgICAgICAgICAgLy8gb25Ub3VjaFN0YXJ0PXt0aGlzLm9uVG91Y2hTdGFydH1cbiAgICAgICAgICAgIC8vIG9uVG91Y2hFbmQ9e3RoaXMub25Nb3VzZVVwfVxuICAgICAgICAgIC8+XG4gICAgICAgICk7XG4gICAgICAgIHJlc2l6ZXJJbmRleCsrO1xuICAgICAgICByZXR1cm4gWy4uLmFjYywgcmVzaXplciwgcGFuZV07XG4gICAgICB9XG4gICAgfSwgW10pO1xuXG4gICAgaWYgKHNwbGl0ID09PSAndmVydGljYWwnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Um93U3R5bGVcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICAgICBkYXRhLXR5cGU9XCJTcGxpdFBhbmVcIlxuICAgICAgICAgIGRhdGEtc3BsaXQ9e3NwbGl0fVxuICAgICAgICAgIHJlZj17c3BsaXRQYW5lID0+ICh0aGlzLnNwbGl0UGFuZSA9IHNwbGl0UGFuZSl9XG4gICAgICAgID5cbiAgICAgICAgICB7ZWxlbWVudHN9XG4gICAgICAgIDwvUm93U3R5bGU+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8Q29sdW1uU3R5bGVcbiAgICAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICAgICBkYXRhLXR5cGU9XCJTcGxpdFBhbmVcIlxuICAgICAgICAgIGRhdGEtc3BsaXQ9e3NwbGl0fVxuICAgICAgICAgIHJlZj17c3BsaXRQYW5lID0+ICh0aGlzLnNwbGl0UGFuZSA9IHNwbGl0UGFuZSl9XG4gICAgICAgID5cbiAgICAgICAgICB7ZWxlbWVudHN9XG4gICAgICAgIDwvQ29sdW1uU3R5bGU+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5TcGxpdFBhbmUucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm5vZGUpLmlzUmVxdWlyZWQsXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgc3BsaXQ6IFByb3BUeXBlcy5vbmVPZihbJ3ZlcnRpY2FsJywgJ2hvcml6b250YWwnXSksXG4gIHJlc2l6ZXJTaXplOiBQcm9wVHlwZXMubnVtYmVyLFxuICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gIG9uUmVzaXplU3RhcnQ6IFByb3BUeXBlcy5mdW5jLFxuICBvblJlc2l6ZUVuZDogUHJvcFR5cGVzLmZ1bmMsXG59O1xuXG5TcGxpdFBhbmUuZGVmYXVsdFByb3BzID0ge1xuICBzcGxpdDogJ3ZlcnRpY2FsJyxcbiAgcmVzaXplclNpemU6IDEsXG4gIGFsbG93UmVzaXplOiB0cnVlXG59O1xuXG5leHBvcnQgZGVmYXVsdCBTcGxpdFBhbmU7XG4iXX0=