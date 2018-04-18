'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _static = require('inline-style-prefixer/static');

var _static2 = _interopRequireDefault(_static);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RowPx = function RowPx(_ref) {
  var useInitial = _ref.useInitial,
      initialSize = _ref.initialSize,
      size = _ref.size,
      minSize = _ref.minSize,
      maxSize = _ref.maxSize;
  return {
    width: useInitial && initialSize ? initialSize : size + 'px',
    minWidth: minSize,
    maxWidth: maxSize,
    outline: 'none'
  };
};

var ColumnPx = function ColumnPx(_ref2) {
  var useInitial = _ref2.useInitial,
      initialSize = _ref2.initialSize,
      size = _ref2.size,
      minSize = _ref2.minSize,
      maxSize = _ref2.maxSize;
  return {
    height: useInitial && initialSize ? initialSize : size + 'px',
    minHeight: minSize,
    maxHeight: maxSize,
    outline: 'none'
  };
};

var RowFlex = function RowFlex(_ref3) {
  var initialSize = _ref3.initialSize,
      minSize = _ref3.minSize,
      maxSize = _ref3.maxSize;


  var style = {
    // flex: initialSize,
    minWidth: minSize,
    maxWidth: maxSize
    // display: 'flex',
    // outline: 'none'
  };

  if (typeof initialSize === "number") {
    style.flex = initialSize;
  } else {
    style.flexGrow = 0;
    style.width = initialSize;
  }

  return style;
};

var ColumnFlex = function ColumnFlex(_ref4) {
  var initialSize = _ref4.initialSize,
      minSize = _ref4.minSize,
      maxSize = _ref4.maxSize;

  var style = {
    minHeight: minSize,
    maxHeight: maxSize,
    // display: 'flex',
    // outline: 'none',
    flexShrink: 1
  };

  if (typeof initialSize === "number") {
    style.flex = initialSize;
  } else {
    style.flexGrow = 0;
    style.height = initialSize;
  }

  return style;
};

var Pane = function (_PureComponent) {
  _inherits(Pane, _PureComponent);

  function Pane() {
    _classCallCheck(this, Pane);

    return _possibleConstructorReturn(this, (Pane.__proto__ || Object.getPrototypeOf(Pane)).apply(this, arguments));
  }

  _createClass(Pane, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          className = _props.className,
          resized = _props.resized,
          split = _props.split,
          useInitial = _props.useInitial,
          initialSize = _props.initialSize;


      var prefixedStyle = void 0;

      if (split === 'vertical') {
        prefixedStyle = (0, _static2.default)(RowFlex(this.props));
      } else {
        prefixedStyle = (0, _static2.default)(ColumnFlex(this.props));
      }

      return _react2.default.createElement(
        'div',
        { className: className, style: prefixedStyle },
        children
      );
    }
  }]);

  return Pane;
}(_react.PureComponent);

Pane.propTypes = {
  children: _propTypes2.default.node,
  className: _propTypes2.default.string,
  initialSize: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
  minSize: _propTypes2.default.string,
  maxSize: _propTypes2.default.string
};

Pane.defaultProps = {
  initialSize: 1,
  split: 'vertical',
  minSize: '0px',
  maxSize: '100%'
};

exports.default = Pane;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QYW5lLmpzIl0sIm5hbWVzIjpbIlJvd1B4IiwidXNlSW5pdGlhbCIsImluaXRpYWxTaXplIiwic2l6ZSIsIm1pblNpemUiLCJtYXhTaXplIiwid2lkdGgiLCJtaW5XaWR0aCIsIm1heFdpZHRoIiwib3V0bGluZSIsIkNvbHVtblB4IiwiaGVpZ2h0IiwibWluSGVpZ2h0IiwibWF4SGVpZ2h0IiwiUm93RmxleCIsInN0eWxlIiwiZmxleCIsImZsZXhHcm93IiwiQ29sdW1uRmxleCIsImZsZXhTaHJpbmsiLCJQYW5lIiwicHJvcHMiLCJjaGlsZHJlbiIsImNsYXNzTmFtZSIsInJlc2l6ZWQiLCJzcGxpdCIsInByZWZpeGVkU3R5bGUiLCJwcm9wVHlwZXMiLCJub2RlIiwic3RyaW5nIiwib25lT2ZUeXBlIiwibnVtYmVyIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxTQUFSQSxLQUFRO0FBQUEsTUFBR0MsVUFBSCxRQUFHQSxVQUFIO0FBQUEsTUFBZUMsV0FBZixRQUFlQSxXQUFmO0FBQUEsTUFBNEJDLElBQTVCLFFBQTRCQSxJQUE1QjtBQUFBLE1BQWtDQyxPQUFsQyxRQUFrQ0EsT0FBbEM7QUFBQSxNQUEyQ0MsT0FBM0MsUUFBMkNBLE9BQTNDO0FBQUEsU0FBMEQ7QUFDdEVDLFdBQU9MLGNBQWNDLFdBQWQsR0FBNEJBLFdBQTVCLEdBQTBDQyxPQUFPLElBRGM7QUFFdEVJLGNBQVVILE9BRjREO0FBR3RFSSxjQUFVSCxPQUg0RDtBQUl0RUksYUFBUztBQUo2RCxHQUExRDtBQUFBLENBQWQ7O0FBT0EsSUFBTUMsV0FBVyxTQUFYQSxRQUFXO0FBQUEsTUFBR1QsVUFBSCxTQUFHQSxVQUFIO0FBQUEsTUFBZUMsV0FBZixTQUFlQSxXQUFmO0FBQUEsTUFBNEJDLElBQTVCLFNBQTRCQSxJQUE1QjtBQUFBLE1BQWtDQyxPQUFsQyxTQUFrQ0EsT0FBbEM7QUFBQSxNQUEyQ0MsT0FBM0MsU0FBMkNBLE9BQTNDO0FBQUEsU0FBMEQ7QUFDekVNLFlBQVFWLGNBQWNDLFdBQWQsR0FBNEJBLFdBQTVCLEdBQTBDQyxPQUFPLElBRGdCO0FBRXpFUyxlQUFXUixPQUY4RDtBQUd6RVMsZUFBV1IsT0FIOEQ7QUFJekVJLGFBQVM7QUFKZ0UsR0FBMUQ7QUFBQSxDQUFqQjs7QUFPQSxJQUFNSyxVQUFVLFNBQVZBLE9BQVUsUUFBdUM7QUFBQSxNQUFwQ1osV0FBb0MsU0FBcENBLFdBQW9DO0FBQUEsTUFBdkJFLE9BQXVCLFNBQXZCQSxPQUF1QjtBQUFBLE1BQWRDLE9BQWMsU0FBZEEsT0FBYzs7O0FBRXJELE1BQU1VLFFBQVE7QUFDWjtBQUNBUixjQUFVSCxPQUZFO0FBR1pJLGNBQVVIO0FBQ1Y7QUFDQTtBQUxZLEdBQWQ7O0FBUUEsTUFBSSxPQUFPSCxXQUFQLEtBQXVCLFFBQTNCLEVBQXFDO0FBQ25DYSxVQUFNQyxJQUFOLEdBQWFkLFdBQWI7QUFDRCxHQUZELE1BRU87QUFDTGEsVUFBTUUsUUFBTixHQUFpQixDQUFqQjtBQUNBRixVQUFNVCxLQUFOLEdBQWNKLFdBQWQ7QUFDRDs7QUFFRCxTQUFPYSxLQUFQO0FBQ0QsQ0FsQkQ7O0FBb0JBLElBQU1HLGFBQWEsU0FBYkEsVUFBYSxRQUF1QztBQUFBLE1BQXBDaEIsV0FBb0MsU0FBcENBLFdBQW9DO0FBQUEsTUFBdkJFLE9BQXVCLFNBQXZCQSxPQUF1QjtBQUFBLE1BQWRDLE9BQWMsU0FBZEEsT0FBYzs7QUFDeEQsTUFBTVUsUUFBUTtBQUNaSCxlQUFXUixPQURDO0FBRVpTLGVBQVdSLE9BRkM7QUFHWjtBQUNBO0FBQ0FjLGdCQUFZO0FBTEEsR0FBZDs7QUFRQSxNQUFJLE9BQU9qQixXQUFQLEtBQXVCLFFBQTNCLEVBQXFDO0FBQ25DYSxVQUFNQyxJQUFOLEdBQWFkLFdBQWI7QUFDRCxHQUZELE1BRU87QUFDTGEsVUFBTUUsUUFBTixHQUFpQixDQUFqQjtBQUNBRixVQUFNSixNQUFOLEdBQWVULFdBQWY7QUFDRDs7QUFFRCxTQUFPYSxLQUFQO0FBQ0QsQ0FqQkQ7O0lBb0JNSyxJOzs7Ozs7Ozs7Ozs2QkFDSztBQUFBLG1CQVFILEtBQUtDLEtBUkY7QUFBQSxVQUVMQyxRQUZLLFVBRUxBLFFBRks7QUFBQSxVQUdMQyxTQUhLLFVBR0xBLFNBSEs7QUFBQSxVQUlMQyxPQUpLLFVBSUxBLE9BSks7QUFBQSxVQUtMQyxLQUxLLFVBS0xBLEtBTEs7QUFBQSxVQU1MeEIsVUFOSyxVQU1MQSxVQU5LO0FBQUEsVUFPTEMsV0FQSyxVQU9MQSxXQVBLOzs7QUFVUCxVQUFJd0Isc0JBQUo7O0FBRUEsVUFBSUQsVUFBVSxVQUFkLEVBQTBCO0FBQ3hCQyx3QkFBZ0Isc0JBQVVaLFFBQVEsS0FBS08sS0FBYixDQUFWLENBQWhCO0FBQ0QsT0FGRCxNQUVPO0FBQ0xLLHdCQUFnQixzQkFBVVIsV0FBVyxLQUFLRyxLQUFoQixDQUFWLENBQWhCO0FBQ0Q7O0FBRUQsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFXRSxTQUFoQixFQUEyQixPQUFPRyxhQUFsQztBQUNHSjtBQURILE9BREY7QUFLRDs7Ozs7O0FBR0hGLEtBQUtPLFNBQUwsR0FBaUI7QUFDZkwsWUFBVSxvQkFBVU0sSUFETDtBQUVmTCxhQUFXLG9CQUFVTSxNQUZOO0FBR2YzQixlQUFhLG9CQUFVNEIsU0FBVixDQUFvQixDQUFDLG9CQUFVRCxNQUFYLEVBQW1CLG9CQUFVRSxNQUE3QixDQUFwQixDQUhFO0FBSWYzQixXQUFTLG9CQUFVeUIsTUFKSjtBQUtmeEIsV0FBUyxvQkFBVXdCO0FBTEosQ0FBakI7O0FBUUFULEtBQUtZLFlBQUwsR0FBb0I7QUFDbEI5QixlQUFhLENBREs7QUFFbEJ1QixTQUFPLFVBRlc7QUFHbEJyQixXQUFTLEtBSFM7QUFJbEJDLFdBQVM7QUFKUyxDQUFwQjs7a0JBT2VlLEkiLCJmaWxlIjoiUGFuZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBQdXJlQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcblxuaW1wb3J0IHByZWZpeEFsbCBmcm9tICdpbmxpbmUtc3R5bGUtcHJlZml4ZXIvc3RhdGljJztcblxuY29uc3QgUm93UHggPSAoeyB1c2VJbml0aWFsLCBpbml0aWFsU2l6ZSwgc2l6ZSwgbWluU2l6ZSwgbWF4U2l6ZSB9KSA9PiAoe1xuICB3aWR0aDogdXNlSW5pdGlhbCAmJiBpbml0aWFsU2l6ZSA/IGluaXRpYWxTaXplIDogc2l6ZSArICdweCcsXG4gIG1pbldpZHRoOiBtaW5TaXplLFxuICBtYXhXaWR0aDogbWF4U2l6ZSxcbiAgb3V0bGluZTogJ25vbmUnLFxufSk7XG5cbmNvbnN0IENvbHVtblB4ID0gKHsgdXNlSW5pdGlhbCwgaW5pdGlhbFNpemUsIHNpemUsIG1pblNpemUsIG1heFNpemUgfSkgPT4gKHtcbiAgaGVpZ2h0OiB1c2VJbml0aWFsICYmIGluaXRpYWxTaXplID8gaW5pdGlhbFNpemUgOiBzaXplICsgJ3B4JyxcbiAgbWluSGVpZ2h0OiBtaW5TaXplLFxuICBtYXhIZWlnaHQ6IG1heFNpemUsXG4gIG91dGxpbmU6ICdub25lJyxcbn0pO1xuXG5jb25zdCBSb3dGbGV4ID0gKHsgaW5pdGlhbFNpemUsIG1pblNpemUsIG1heFNpemUgfSkgPT4ge1xuXG4gIGNvbnN0IHN0eWxlID0ge1xuICAgIC8vIGZsZXg6IGluaXRpYWxTaXplLFxuICAgIG1pbldpZHRoOiBtaW5TaXplLFxuICAgIG1heFdpZHRoOiBtYXhTaXplLFxuICAgIC8vIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAvLyBvdXRsaW5lOiAnbm9uZSdcbiAgfTtcblxuICBpZiAodHlwZW9mIGluaXRpYWxTaXplID09PSBcIm51bWJlclwiKSB7XG4gICAgc3R5bGUuZmxleCA9IGluaXRpYWxTaXplO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmZsZXhHcm93ID0gMDtcbiAgICBzdHlsZS53aWR0aCA9IGluaXRpYWxTaXplO1xuICB9XG5cbiAgcmV0dXJuIHN0eWxlO1xufTtcblxuY29uc3QgQ29sdW1uRmxleCA9ICh7IGluaXRpYWxTaXplLCBtaW5TaXplLCBtYXhTaXplIH0pID0+IHtcbiAgY29uc3Qgc3R5bGUgPSB7XG4gICAgbWluSGVpZ2h0OiBtaW5TaXplLFxuICAgIG1heEhlaWdodDogbWF4U2l6ZSxcbiAgICAvLyBkaXNwbGF5OiAnZmxleCcsXG4gICAgLy8gb3V0bGluZTogJ25vbmUnLFxuICAgIGZsZXhTaHJpbms6IDFcbiAgfTtcblxuICBpZiAodHlwZW9mIGluaXRpYWxTaXplID09PSBcIm51bWJlclwiKSB7XG4gICAgc3R5bGUuZmxleCA9IGluaXRpYWxTaXplO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmZsZXhHcm93ID0gMDtcbiAgICBzdHlsZS5oZWlnaHQgPSBpbml0aWFsU2l6ZTtcbiAgfVxuXG4gIHJldHVybiBzdHlsZTtcbn07XG5cblxuY2xhc3MgUGFuZSBleHRlbmRzIFB1cmVDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hpbGRyZW4sXG4gICAgICBjbGFzc05hbWUsXG4gICAgICByZXNpemVkLFxuICAgICAgc3BsaXQsXG4gICAgICB1c2VJbml0aWFsLFxuICAgICAgaW5pdGlhbFNpemUsXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBsZXQgcHJlZml4ZWRTdHlsZTtcblxuICAgIGlmIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgcHJlZml4ZWRTdHlsZSA9IHByZWZpeEFsbChSb3dGbGV4KHRoaXMucHJvcHMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZml4ZWRTdHlsZSA9IHByZWZpeEFsbChDb2x1bW5GbGV4KHRoaXMucHJvcHMpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gc3R5bGU9e3ByZWZpeGVkU3R5bGV9PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblBhbmUucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUsXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaW5pdGlhbFNpemU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5udW1iZXJdKSxcbiAgbWluU2l6ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWF4U2l6ZTogUHJvcFR5cGVzLnN0cmluZyxcbn07XG5cblBhbmUuZGVmYXVsdFByb3BzID0ge1xuICBpbml0aWFsU2l6ZTogMSxcbiAgc3BsaXQ6ICd2ZXJ0aWNhbCcsXG4gIG1pblNpemU6ICcwcHgnLFxuICBtYXhTaXplOiAnMTAwJScsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBQYW5lO1xuIl19