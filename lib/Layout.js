"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Pane = require("./Pane");

var _Pane2 = _interopRequireDefault(_Pane);

var _SplitPane = require("./SplitPane");

var _SplitPane2 = _interopRequireDefault(_SplitPane);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileLayout = function (_Component) {
  _inherits(TileLayout, _Component);

  function TileLayout() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, TileLayout);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TileLayout.__proto__ || Object.getPrototypeOf(TileLayout)).call.apply(_ref, [this].concat(args))), _this), _this.onChange = function (path, size) {
      var _this$props = _this.props,
          value = _this$props.value,
          onChange = _this$props.onChange;

      var newValue = _extends({}, value);

      var idx = 0;
      var node = newValue;
      while (idx < path.length) {
        node = node.panes[path[idx]];
        idx++;
      }

      // update sizes
      var newPanes = node.panes.map(function (pane, idx) {
        return _extends({}, pane, {
          size: size[idx]
        });
      });
      node.panes = newPanes;

      onChange && onChange(newValue);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(TileLayout, [{
    key: "renderRecursively",
    value: function renderRecursively(node, path) {
      var _this2 = this;

      if (node.panes) {
        var split = node.direction === "column" ? "vertical" : "horizontal";
        var panes = node.panes.map(function (config, idx) {
          var size = config.size,
              maxSize = config.maxSize,
              minSize = config.minSize;


          var p = path.concat(idx);

          return _react2.default.createElement(
            _Pane2.default,
            { key: p, initialSize: size, maxSize: maxSize, minSize: minSize },
            _this2.renderRecursively(config, p)
          );
        });

        return _react2.default.createElement(
          _SplitPane2.default,
          { split: split, onChange: this.onChange.bind(null, path) },
          panes
        );
      }

      return this.props.renderTile(node.id, path);
    }
  }, {
    key: "render",
    value: function render() {
      return this.renderRecursively(this.props.value, []);
    }
  }]);

  return TileLayout;
}(_react.Component);

TileLayout.propTypes = {
  renderTile: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  value: _propTypes2.default.object
};
exports.default = TileLayout;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9MYXlvdXQuanMiXSwibmFtZXMiOlsiVGlsZUxheW91dCIsIm9uQ2hhbmdlIiwicGF0aCIsInNpemUiLCJwcm9wcyIsInZhbHVlIiwibmV3VmFsdWUiLCJpZHgiLCJub2RlIiwibGVuZ3RoIiwicGFuZXMiLCJuZXdQYW5lcyIsIm1hcCIsInBhbmUiLCJzcGxpdCIsImRpcmVjdGlvbiIsImNvbmZpZyIsIm1heFNpemUiLCJtaW5TaXplIiwicCIsImNvbmNhdCIsInJlbmRlclJlY3Vyc2l2ZWx5IiwiYmluZCIsInJlbmRlclRpbGUiLCJpZCIsInByb3BUeXBlcyIsImZ1bmMiLCJvYmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0lBRXFCQSxVOzs7Ozs7Ozs7Ozs7Ozs4TEFPbkJDLFEsR0FBVyxVQUFDQyxJQUFELEVBQU9DLElBQVAsRUFBZ0I7QUFBQSx3QkFDQyxNQUFLQyxLQUROO0FBQUEsVUFDbEJDLEtBRGtCLGVBQ2xCQSxLQURrQjtBQUFBLFVBQ1hKLFFBRFcsZUFDWEEsUUFEVzs7QUFFekIsVUFBTUssV0FBVyxTQUFjLEVBQWQsRUFBa0JELEtBQWxCLENBQWpCOztBQUVBLFVBQUlFLE1BQU0sQ0FBVjtBQUNBLFVBQUlDLE9BQU9GLFFBQVg7QUFDQSxhQUFNQyxNQUFNTCxLQUFLTyxNQUFqQixFQUF5QjtBQUN2QkQsZUFBT0EsS0FBS0UsS0FBTCxDQUFXUixLQUFLSyxHQUFMLENBQVgsQ0FBUDtBQUNBQTtBQUNEOztBQUVEO0FBQ0EsVUFBTUksV0FBV0gsS0FBS0UsS0FBTCxDQUFXRSxHQUFYLENBQWUsVUFBQ0MsSUFBRCxFQUFPTixHQUFQLEVBQWU7QUFDN0MsZUFBTyxTQUFjLEVBQWQsRUFBa0JNLElBQWxCLEVBQXdCO0FBQzdCVixnQkFBTUEsS0FBS0ksR0FBTDtBQUR1QixTQUF4QixDQUFQO0FBR0QsT0FKZ0IsQ0FBakI7QUFLQUMsV0FBS0UsS0FBTCxHQUFhQyxRQUFiOztBQUVBVixrQkFBWUEsU0FBU0ssUUFBVCxDQUFaO0FBQ0QsSzs7Ozs7c0NBRWlCRSxJLEVBQU1OLEksRUFBTTtBQUFBOztBQUM1QixVQUFJTSxLQUFLRSxLQUFULEVBQWdCO0FBQ2QsWUFBTUksUUFBUU4sS0FBS08sU0FBTCxLQUFtQixRQUFuQixHQUE4QixVQUE5QixHQUEyQyxZQUF6RDtBQUNBLFlBQU1MLFFBQVFGLEtBQUtFLEtBQUwsQ0FBV0UsR0FBWCxDQUFlLFVBQUNJLE1BQUQsRUFBU1QsR0FBVCxFQUFpQjtBQUFBLGNBQ3BDSixJQURvQyxHQUNUYSxNQURTLENBQ3BDYixJQURvQztBQUFBLGNBQzlCYyxPQUQ4QixHQUNURCxNQURTLENBQzlCQyxPQUQ4QjtBQUFBLGNBQ3JCQyxPQURxQixHQUNURixNQURTLENBQ3JCRSxPQURxQjs7O0FBRzVDLGNBQU1DLElBQUlqQixLQUFLa0IsTUFBTCxDQUFZYixHQUFaLENBQVY7O0FBRUEsaUJBQU87QUFBQTtBQUFBLGNBQU0sS0FBS1ksQ0FBWCxFQUFjLGFBQWFoQixJQUEzQixFQUFpQyxTQUFTYyxPQUExQyxFQUFtRCxTQUFTQyxPQUE1RDtBQUNGLG1CQUFLRyxpQkFBTCxDQUF1QkwsTUFBdkIsRUFBK0JHLENBQS9CO0FBREUsV0FBUDtBQUdELFNBUmEsQ0FBZDs7QUFVQSxlQUFPO0FBQUE7QUFBQSxZQUFXLE9BQU9MLEtBQWxCLEVBQXlCLFVBQVUsS0FBS2IsUUFBTCxDQUFjcUIsSUFBZCxDQUFtQixJQUFuQixFQUF5QnBCLElBQXpCLENBQW5DO0FBQW9FUTtBQUFwRSxTQUFQO0FBQ0Q7O0FBRUQsYUFBTyxLQUFLTixLQUFMLENBQVdtQixVQUFYLENBQXNCZixLQUFLZ0IsRUFBM0IsRUFBK0J0QixJQUEvQixDQUFQO0FBQ0Q7Ozs2QkFFUTtBQUNQLGFBQU8sS0FBS21CLGlCQUFMLENBQXVCLEtBQUtqQixLQUFMLENBQVdDLEtBQWxDLEVBQXlDLEVBQXpDLENBQVA7QUFDRDs7Ozs7O0FBbERrQkwsVSxDQUNaeUIsUyxHQUFZO0FBQ2pCRixjQUFZLG9CQUFVRyxJQURMO0FBRWpCekIsWUFBVSxvQkFBVXlCLElBRkg7QUFHakJyQixTQUFPLG9CQUFVc0I7QUFIQSxDO2tCQURBM0IsVSIsImZpbGUiOiJMYXlvdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBjbG9uZUVsZW1lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gXCJwcm9wLXR5cGVzXCI7XG5cbmltcG9ydCBQYW5lIGZyb20gXCIuL1BhbmVcIjtcbmltcG9ydCBTcGxpdFBhbmUgZnJvbSBcIi4vU3BsaXRQYW5lXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbGVMYXlvdXQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHJlbmRlclRpbGU6IFByb3BUeXBlcy5mdW5jLFxuICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICB2YWx1ZTogUHJvcFR5cGVzLm9iamVjdFxuICB9O1xuXG4gIG9uQ2hhbmdlID0gKHBhdGgsIHNpemUpID0+IHtcbiAgICBjb25zdCB7dmFsdWUsIG9uQ2hhbmdlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBPYmplY3QuYXNzaWduKHt9LCB2YWx1ZSk7XG5cbiAgICBsZXQgaWR4ID0gMDtcbiAgICBsZXQgbm9kZSA9IG5ld1ZhbHVlO1xuICAgIHdoaWxlKGlkeCA8IHBhdGgubGVuZ3RoKSB7XG4gICAgICBub2RlID0gbm9kZS5wYW5lc1twYXRoW2lkeF1dO1xuICAgICAgaWR4Kys7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHNpemVzXG4gICAgY29uc3QgbmV3UGFuZXMgPSBub2RlLnBhbmVzLm1hcCgocGFuZSwgaWR4KSA9PiB7XG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgcGFuZSwge1xuICAgICAgICBzaXplOiBzaXplW2lkeF1cbiAgICAgIH0pXG4gICAgfSk7XG4gICAgbm9kZS5wYW5lcyA9IG5ld1BhbmVzO1xuXG4gICAgb25DaGFuZ2UgJiYgb25DaGFuZ2UobmV3VmFsdWUpO1xuICB9XG5cbiAgcmVuZGVyUmVjdXJzaXZlbHkobm9kZSwgcGF0aCkge1xuICAgIGlmIChub2RlLnBhbmVzKSB7XG4gICAgICBjb25zdCBzcGxpdCA9IG5vZGUuZGlyZWN0aW9uID09PSBcImNvbHVtblwiID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG4gICAgICBjb25zdCBwYW5lcyA9IG5vZGUucGFuZXMubWFwKChjb25maWcsIGlkeCkgPT4ge1xuICAgICAgICBjb25zdCB7IHNpemUsIG1heFNpemUsIG1pblNpemUgfSA9IGNvbmZpZztcblxuICAgICAgICBjb25zdCBwID0gcGF0aC5jb25jYXQoaWR4KTtcblxuICAgICAgICByZXR1cm4gPFBhbmUga2V5PXtwfSBpbml0aWFsU2l6ZT17c2l6ZX0gbWF4U2l6ZT17bWF4U2l6ZX0gbWluU2l6ZT17bWluU2l6ZX0+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJSZWN1cnNpdmVseShjb25maWcsIHApfVxuICAgICAgICAgIDwvUGFuZT47XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIDxTcGxpdFBhbmUgc3BsaXQ9e3NwbGl0fSBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZS5iaW5kKG51bGwsIHBhdGgpfT57cGFuZXN9PC9TcGxpdFBhbmU+O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlclRpbGUobm9kZS5pZCwgcGF0aCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyUmVjdXJzaXZlbHkodGhpcy5wcm9wcy52YWx1ZSwgW10pO1xuICB9XG59Il19