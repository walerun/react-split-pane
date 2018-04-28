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

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = TileLayout.__proto__ || Object.getPrototypeOf(TileLayout)).call.apply(_ref, [this].concat(args))), _this), _this.onChange = function (path, sizes) {
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
          size: sizes[idx]
        });
      });
      node.panes = newPanes;

      onChange && onChange(newValue);
    }, _this.onResizeStart = function (path, index) {
      _this.props.onResizeStart && _this.props.onResizeStart(index, path);
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
            { key: p, size: size, maxSize: maxSize, minSize: minSize },
            _this2.renderRecursively(config, p)
          );
        });

        return _react2.default.createElement(
          _SplitPane2.default,
          {
            split: split,
            onChange: this.onChange.bind(null, path),
            onResizeStart: this.onResizeStart.bind(null, path),
            onResizeEnd: this.props.onResizeEnd,
            controlled: true
          },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9MYXlvdXQuanMiXSwibmFtZXMiOlsiVGlsZUxheW91dCIsIm9uQ2hhbmdlIiwicGF0aCIsInNpemVzIiwicHJvcHMiLCJ2YWx1ZSIsIm5ld1ZhbHVlIiwiaWR4Iiwibm9kZSIsImxlbmd0aCIsInBhbmVzIiwibmV3UGFuZXMiLCJtYXAiLCJwYW5lIiwic2l6ZSIsIm9uUmVzaXplU3RhcnQiLCJpbmRleCIsInNwbGl0IiwiZGlyZWN0aW9uIiwiY29uZmlnIiwibWF4U2l6ZSIsIm1pblNpemUiLCJwIiwiY29uY2F0IiwicmVuZGVyUmVjdXJzaXZlbHkiLCJiaW5kIiwib25SZXNpemVFbmQiLCJyZW5kZXJUaWxlIiwiaWQiLCJwcm9wVHlwZXMiLCJmdW5jIiwib2JqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztJQUVxQkEsVTs7Ozs7Ozs7Ozs7Ozs7OExBT25CQyxRLEdBQVcsVUFBQ0MsSUFBRCxFQUFPQyxLQUFQLEVBQWlCO0FBQUEsd0JBQ0EsTUFBS0MsS0FETDtBQUFBLFVBQ25CQyxLQURtQixlQUNuQkEsS0FEbUI7QUFBQSxVQUNaSixRQURZLGVBQ1pBLFFBRFk7O0FBRTFCLFVBQU1LLFdBQVcsU0FBYyxFQUFkLEVBQWtCRCxLQUFsQixDQUFqQjs7QUFFQSxVQUFJRSxNQUFNLENBQVY7QUFDQSxVQUFJQyxPQUFPRixRQUFYO0FBQ0EsYUFBTUMsTUFBTUwsS0FBS08sTUFBakIsRUFBeUI7QUFDdkJELGVBQU9BLEtBQUtFLEtBQUwsQ0FBV1IsS0FBS0ssR0FBTCxDQUFYLENBQVA7QUFDQUE7QUFDRDs7QUFFRDtBQUNBLFVBQU1JLFdBQVdILEtBQUtFLEtBQUwsQ0FBV0UsR0FBWCxDQUFlLFVBQUNDLElBQUQsRUFBT04sR0FBUCxFQUFlO0FBQzdDLGVBQU8sU0FBYyxFQUFkLEVBQWtCTSxJQUFsQixFQUF3QjtBQUM3QkMsZ0JBQU1YLE1BQU1JLEdBQU47QUFEdUIsU0FBeEIsQ0FBUDtBQUdELE9BSmdCLENBQWpCO0FBS0FDLFdBQUtFLEtBQUwsR0FBYUMsUUFBYjs7QUFFQVYsa0JBQVlBLFNBQVNLLFFBQVQsQ0FBWjtBQUNELEssUUFFRFMsYSxHQUFnQixVQUFDYixJQUFELEVBQU9jLEtBQVAsRUFBaUI7QUFDL0IsWUFBS1osS0FBTCxDQUFXVyxhQUFYLElBQTRCLE1BQUtYLEtBQUwsQ0FBV1csYUFBWCxDQUF5QkMsS0FBekIsRUFBZ0NkLElBQWhDLENBQTVCO0FBQ0QsSzs7Ozs7c0NBRWlCTSxJLEVBQU1OLEksRUFBTTtBQUFBOztBQUM1QixVQUFJTSxLQUFLRSxLQUFULEVBQWdCO0FBQ2QsWUFBTU8sUUFBUVQsS0FBS1UsU0FBTCxLQUFtQixRQUFuQixHQUE4QixVQUE5QixHQUEyQyxZQUF6RDtBQUNBLFlBQU1SLFFBQVFGLEtBQUtFLEtBQUwsQ0FBV0UsR0FBWCxDQUFlLFVBQUNPLE1BQUQsRUFBU1osR0FBVCxFQUFpQjtBQUFBLGNBQ3BDTyxJQURvQyxHQUNUSyxNQURTLENBQ3BDTCxJQURvQztBQUFBLGNBQzlCTSxPQUQ4QixHQUNURCxNQURTLENBQzlCQyxPQUQ4QjtBQUFBLGNBQ3JCQyxPQURxQixHQUNURixNQURTLENBQ3JCRSxPQURxQjs7O0FBRzVDLGNBQU1DLElBQUlwQixLQUFLcUIsTUFBTCxDQUFZaEIsR0FBWixDQUFWOztBQUVBLGlCQUFPO0FBQUE7QUFBQSxjQUFNLEtBQUtlLENBQVgsRUFBYyxNQUFNUixJQUFwQixFQUEwQixTQUFTTSxPQUFuQyxFQUE0QyxTQUFTQyxPQUFyRDtBQUNGLG1CQUFLRyxpQkFBTCxDQUF1QkwsTUFBdkIsRUFBK0JHLENBQS9CO0FBREUsV0FBUDtBQUdELFNBUmEsQ0FBZDs7QUFVQSxlQUNFO0FBQUE7QUFBQTtBQUNFLG1CQUFPTCxLQURUO0FBRUUsc0JBQVUsS0FBS2hCLFFBQUwsQ0FBY3dCLElBQWQsQ0FBbUIsSUFBbkIsRUFBeUJ2QixJQUF6QixDQUZaO0FBR0UsMkJBQWUsS0FBS2EsYUFBTCxDQUFtQlUsSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEJ2QixJQUE5QixDQUhqQjtBQUlFLHlCQUFhLEtBQUtFLEtBQUwsQ0FBV3NCLFdBSjFCO0FBS0Usd0JBQVk7QUFMZDtBQU9HaEI7QUFQSCxTQURGO0FBV0Q7O0FBRUQsYUFBTyxLQUFLTixLQUFMLENBQVd1QixVQUFYLENBQXNCbkIsS0FBS29CLEVBQTNCLEVBQStCMUIsSUFBL0IsQ0FBUDtBQUNEOzs7NkJBRVE7QUFDUCxhQUFPLEtBQUtzQixpQkFBTCxDQUF1QixLQUFLcEIsS0FBTCxDQUFXQyxLQUFsQyxFQUF5QyxFQUF6QyxDQUFQO0FBQ0Q7Ozs7OztBQWhFa0JMLFUsQ0FDWjZCLFMsR0FBWTtBQUNqQkYsY0FBWSxvQkFBVUcsSUFETDtBQUVqQjdCLFlBQVUsb0JBQVU2QixJQUZIO0FBR2pCekIsU0FBTyxvQkFBVTBCO0FBSEEsQztrQkFEQS9CLFUiLCJmaWxlIjoiTGF5b3V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IENvbXBvbmVudCwgY2xvbmVFbGVtZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tIFwicHJvcC10eXBlc1wiO1xuXG5pbXBvcnQgUGFuZSBmcm9tIFwiLi9QYW5lXCI7XG5pbXBvcnQgU3BsaXRQYW5lIGZyb20gXCIuL1NwbGl0UGFuZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaWxlTGF5b3V0IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICByZW5kZXJUaWxlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgdmFsdWU6IFByb3BUeXBlcy5vYmplY3RcbiAgfTtcblxuICBvbkNoYW5nZSA9IChwYXRoLCBzaXplcykgPT4ge1xuICAgIGNvbnN0IHt2YWx1ZSwgb25DaGFuZ2V9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBuZXdWYWx1ZSA9IE9iamVjdC5hc3NpZ24oe30sIHZhbHVlKTtcblxuICAgIGxldCBpZHggPSAwO1xuICAgIGxldCBub2RlID0gbmV3VmFsdWU7XG4gICAgd2hpbGUoaWR4IDwgcGF0aC5sZW5ndGgpIHtcbiAgICAgIG5vZGUgPSBub2RlLnBhbmVzW3BhdGhbaWR4XV07XG4gICAgICBpZHgrKztcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgc2l6ZXNcbiAgICBjb25zdCBuZXdQYW5lcyA9IG5vZGUucGFuZXMubWFwKChwYW5lLCBpZHgpID0+IHtcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBwYW5lLCB7XG4gICAgICAgIHNpemU6IHNpemVzW2lkeF1cbiAgICAgIH0pXG4gICAgfSk7XG4gICAgbm9kZS5wYW5lcyA9IG5ld1BhbmVzO1xuXG4gICAgb25DaGFuZ2UgJiYgb25DaGFuZ2UobmV3VmFsdWUpO1xuICB9XG5cbiAgb25SZXNpemVTdGFydCA9IChwYXRoLCBpbmRleCkgPT4ge1xuICAgIHRoaXMucHJvcHMub25SZXNpemVTdGFydCAmJiB0aGlzLnByb3BzLm9uUmVzaXplU3RhcnQoaW5kZXgsIHBhdGgpO1xuICB9XG5cbiAgcmVuZGVyUmVjdXJzaXZlbHkobm9kZSwgcGF0aCkge1xuICAgIGlmIChub2RlLnBhbmVzKSB7XG4gICAgICBjb25zdCBzcGxpdCA9IG5vZGUuZGlyZWN0aW9uID09PSBcImNvbHVtblwiID8gXCJ2ZXJ0aWNhbFwiIDogXCJob3Jpem9udGFsXCI7XG4gICAgICBjb25zdCBwYW5lcyA9IG5vZGUucGFuZXMubWFwKChjb25maWcsIGlkeCkgPT4ge1xuICAgICAgICBjb25zdCB7IHNpemUsIG1heFNpemUsIG1pblNpemUgfSA9IGNvbmZpZztcblxuICAgICAgICBjb25zdCBwID0gcGF0aC5jb25jYXQoaWR4KTtcblxuICAgICAgICByZXR1cm4gPFBhbmUga2V5PXtwfSBzaXplPXtzaXplfSBtYXhTaXplPXttYXhTaXplfSBtaW5TaXplPXttaW5TaXplfT5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlclJlY3Vyc2l2ZWx5KGNvbmZpZywgcCl9XG4gICAgICAgICAgPC9QYW5lPjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U3BsaXRQYW5lXG4gICAgICAgICAgc3BsaXQ9e3NwbGl0fVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlLmJpbmQobnVsbCwgcGF0aCl9XG4gICAgICAgICAgb25SZXNpemVTdGFydD17dGhpcy5vblJlc2l6ZVN0YXJ0LmJpbmQobnVsbCwgcGF0aCl9XG4gICAgICAgICAgb25SZXNpemVFbmQ9e3RoaXMucHJvcHMub25SZXNpemVFbmR9XG4gICAgICAgICAgY29udHJvbGxlZD17dHJ1ZX1cbiAgICAgICAgPlxuICAgICAgICAgIHtwYW5lc31cbiAgICAgICAgPC9TcGxpdFBhbmU+XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnByb3BzLnJlbmRlclRpbGUobm9kZS5pZCwgcGF0aCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVuZGVyUmVjdXJzaXZlbHkodGhpcy5wcm9wcy52YWx1ZSwgW10pO1xuICB9XG59Il19