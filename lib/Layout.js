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

var Layout = function (_Component) {
  _inherits(Layout, _Component);

  function Layout() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Layout);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Layout.__proto__ || Object.getPrototypeOf(Layout)).call.apply(_ref, [this].concat(args))), _this), _this.onChange = function (path, size) {
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

  _createClass(Layout, [{
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

  return Layout;
}(_react.Component);

Layout.propTypes = {
  renderTile: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  value: _propTypes2.default.object
};
exports.default = Layout;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9MYXlvdXQuanMiXSwibmFtZXMiOlsiTGF5b3V0Iiwib25DaGFuZ2UiLCJwYXRoIiwic2l6ZSIsInByb3BzIiwidmFsdWUiLCJuZXdWYWx1ZSIsImlkeCIsIm5vZGUiLCJsZW5ndGgiLCJwYW5lcyIsIm5ld1BhbmVzIiwibWFwIiwicGFuZSIsInNwbGl0IiwiZGlyZWN0aW9uIiwiY29uZmlnIiwibWF4U2l6ZSIsIm1pblNpemUiLCJwIiwiY29uY2F0IiwicmVuZGVyUmVjdXJzaXZlbHkiLCJiaW5kIiwicmVuZGVyVGlsZSIsImlkIiwicHJvcFR5cGVzIiwiZnVuYyIsIm9iamVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBLE07Ozs7Ozs7Ozs7Ozs7O3NMQU9uQkMsUSxHQUFXLFVBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFnQjtBQUFBLHdCQUNDLE1BQUtDLEtBRE47QUFBQSxVQUNsQkMsS0FEa0IsZUFDbEJBLEtBRGtCO0FBQUEsVUFDWEosUUFEVyxlQUNYQSxRQURXOztBQUV6QixVQUFNSyxXQUFXLFNBQWMsRUFBZCxFQUFrQkQsS0FBbEIsQ0FBakI7O0FBRUEsVUFBSUUsTUFBTSxDQUFWO0FBQ0EsVUFBSUMsT0FBT0YsUUFBWDtBQUNBLGFBQU1DLE1BQU1MLEtBQUtPLE1BQWpCLEVBQXlCO0FBQ3ZCRCxlQUFPQSxLQUFLRSxLQUFMLENBQVdSLEtBQUtLLEdBQUwsQ0FBWCxDQUFQO0FBQ0FBO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFNSSxXQUFXSCxLQUFLRSxLQUFMLENBQVdFLEdBQVgsQ0FBZSxVQUFDQyxJQUFELEVBQU9OLEdBQVAsRUFBZTtBQUM3QyxlQUFPLFNBQWMsRUFBZCxFQUFrQk0sSUFBbEIsRUFBd0I7QUFDN0JWLGdCQUFNQSxLQUFLSSxHQUFMO0FBRHVCLFNBQXhCLENBQVA7QUFHRCxPQUpnQixDQUFqQjtBQUtBQyxXQUFLRSxLQUFMLEdBQWFDLFFBQWI7O0FBRUFWLGtCQUFZQSxTQUFTSyxRQUFULENBQVo7QUFDRCxLOzs7OztzQ0FFaUJFLEksRUFBTU4sSSxFQUFNO0FBQUE7O0FBQzVCLFVBQUlNLEtBQUtFLEtBQVQsRUFBZ0I7QUFDZCxZQUFNSSxRQUFRTixLQUFLTyxTQUFMLEtBQW1CLFFBQW5CLEdBQThCLFVBQTlCLEdBQTJDLFlBQXpEO0FBQ0EsWUFBTUwsUUFBUUYsS0FBS0UsS0FBTCxDQUFXRSxHQUFYLENBQWUsVUFBQ0ksTUFBRCxFQUFTVCxHQUFULEVBQWlCO0FBQUEsY0FDcENKLElBRG9DLEdBQ1RhLE1BRFMsQ0FDcENiLElBRG9DO0FBQUEsY0FDOUJjLE9BRDhCLEdBQ1RELE1BRFMsQ0FDOUJDLE9BRDhCO0FBQUEsY0FDckJDLE9BRHFCLEdBQ1RGLE1BRFMsQ0FDckJFLE9BRHFCOzs7QUFHNUMsY0FBTUMsSUFBSWpCLEtBQUtrQixNQUFMLENBQVliLEdBQVosQ0FBVjs7QUFFQSxpQkFBTztBQUFBO0FBQUEsY0FBTSxLQUFLWSxDQUFYLEVBQWMsYUFBYWhCLElBQTNCLEVBQWlDLFNBQVNjLE9BQTFDLEVBQW1ELFNBQVNDLE9BQTVEO0FBQ0YsbUJBQUtHLGlCQUFMLENBQXVCTCxNQUF2QixFQUErQkcsQ0FBL0I7QUFERSxXQUFQO0FBR0QsU0FSYSxDQUFkOztBQVVBLGVBQU87QUFBQTtBQUFBLFlBQVcsT0FBT0wsS0FBbEIsRUFBeUIsVUFBVSxLQUFLYixRQUFMLENBQWNxQixJQUFkLENBQW1CLElBQW5CLEVBQXlCcEIsSUFBekIsQ0FBbkM7QUFBb0VRO0FBQXBFLFNBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQUtOLEtBQUwsQ0FBV21CLFVBQVgsQ0FBc0JmLEtBQUtnQixFQUEzQixFQUErQnRCLElBQS9CLENBQVA7QUFDRDs7OzZCQUVRO0FBQ1AsYUFBTyxLQUFLbUIsaUJBQUwsQ0FBdUIsS0FBS2pCLEtBQUwsQ0FBV0MsS0FBbEMsRUFBeUMsRUFBekMsQ0FBUDtBQUNEOzs7Ozs7QUFsRGtCTCxNLENBQ1p5QixTLEdBQVk7QUFDakJGLGNBQVksb0JBQVVHLElBREw7QUFFakJ6QixZQUFVLG9CQUFVeUIsSUFGSDtBQUdqQnJCLFNBQU8sb0JBQVVzQjtBQUhBLEM7a0JBREEzQixNIiwiZmlsZSI6IkxheW91dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIGNsb25lRWxlbWVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSBcInByb3AtdHlwZXNcIjtcblxuaW1wb3J0IFBhbmUgZnJvbSBcIi4vUGFuZVwiO1xuaW1wb3J0IFNwbGl0UGFuZSBmcm9tIFwiLi9TcGxpdFBhbmVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGF5b3V0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZW5kZXJUaWxlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdmFsdWU6IFByb3BUeXBlcy5vYmplY3RcbiAgfTtcblxuICBvbkNoYW5nZSA9IChwYXRoLCBzaXplKSA9PiB7XG4gICAgY29uc3Qge3ZhbHVlLCBvbkNoYW5nZX0gPSB0aGlzLnByb3BzO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gT2JqZWN0LmFzc2lnbih7fSwgdmFsdWUpO1xuXG4gICAgbGV0IGlkeCA9IDA7XG4gICAgbGV0IG5vZGUgPSBuZXdWYWx1ZTtcbiAgICB3aGlsZShpZHggPCBwYXRoLmxlbmd0aCkge1xuICAgICAgbm9kZSA9IG5vZGUucGFuZXNbcGF0aFtpZHhdXTtcbiAgICAgIGlkeCsrO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBzaXplc1xuICAgIGNvbnN0IG5ld1BhbmVzID0gbm9kZS5wYW5lcy5tYXAoKHBhbmUsIGlkeCkgPT4ge1xuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHBhbmUsIHtcbiAgICAgICAgc2l6ZTogc2l6ZVtpZHhdXG4gICAgICB9KVxuICAgIH0pO1xuICAgIG5vZGUucGFuZXMgPSBuZXdQYW5lcztcblxuICAgIG9uQ2hhbmdlICYmIG9uQ2hhbmdlKG5ld1ZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlclJlY3Vyc2l2ZWx5KG5vZGUsIHBhdGgpIHtcbiAgICBpZiAobm9kZS5wYW5lcykge1xuICAgICAgY29uc3Qgc3BsaXQgPSBub2RlLmRpcmVjdGlvbiA9PT0gXCJjb2x1bW5cIiA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuICAgICAgY29uc3QgcGFuZXMgPSBub2RlLnBhbmVzLm1hcCgoY29uZmlnLCBpZHgpID0+IHtcbiAgICAgICAgY29uc3QgeyBzaXplLCBtYXhTaXplLCBtaW5TaXplIH0gPSBjb25maWc7XG5cbiAgICAgICAgY29uc3QgcCA9IHBhdGguY29uY2F0KGlkeCk7XG5cbiAgICAgICAgcmV0dXJuIDxQYW5lIGtleT17cH0gaW5pdGlhbFNpemU9e3NpemV9IG1heFNpemU9e21heFNpemV9IG1pblNpemU9e21pblNpemV9PlxuICAgICAgICAgICAge3RoaXMucmVuZGVyUmVjdXJzaXZlbHkoY29uZmlnLCBwKX1cbiAgICAgICAgICA8L1BhbmU+O1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiA8U3BsaXRQYW5lIHNwbGl0PXtzcGxpdH0gb25DaGFuZ2U9e3RoaXMub25DaGFuZ2UuYmluZChudWxsLCBwYXRoKX0+e3BhbmVzfTwvU3BsaXRQYW5lPjtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5yZW5kZXJUaWxlKG5vZGUuaWQsIHBhdGgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiB0aGlzLnJlbmRlclJlY3Vyc2l2ZWx5KHRoaXMucHJvcHMudmFsdWUsIFtdKTtcbiAgfVxufSJdfQ==