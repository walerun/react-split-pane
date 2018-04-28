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

var _SplitPane = require('./SplitPane');

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
      size = _ref3.size,
      minSize = _ref3.minSize,
      maxSize = _ref3.maxSize;

  var value = size ? size : initialSize;

  var style = {
    minWidth: minSize,
    maxWidth: maxSize,
    display: 'flex',
    outline: 'none',
    position: 'relative'
  };

  if ((0, _SplitPane.getUnit)(value) === "ratio") {
    style.flex = value;
  } else {
    style.flexGrow = 0;
    style.width = value;
  }

  return style;
};

var ColumnFlex = function ColumnFlex(_ref4) {
  var initialSize = _ref4.initialSize,
      size = _ref4.size,
      minSize = _ref4.minSize,
      maxSize = _ref4.maxSize;

  var value = size ? size : initialSize;

  var style = {
    minHeight: minSize,
    maxHeight: maxSize,
    display: 'flex',
    outline: 'none',
    flexShrink: 1,
    position: 'relative'
  };

  if ((0, _SplitPane.getUnit)(value) === "ratio") {
    style.flex = value;
  } else {
    style.flexGrow = 0;
    style.height = value;
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
          split = _props.split,
          useInitial = _props.useInitial;


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
  initialSize: "1",
  split: 'vertical',
  minSize: '0',
  maxSize: '100%'
};

exports.default = Pane;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9QYW5lLmpzIl0sIm5hbWVzIjpbIlJvd1B4IiwidXNlSW5pdGlhbCIsImluaXRpYWxTaXplIiwic2l6ZSIsIm1pblNpemUiLCJtYXhTaXplIiwid2lkdGgiLCJtaW5XaWR0aCIsIm1heFdpZHRoIiwib3V0bGluZSIsIkNvbHVtblB4IiwiaGVpZ2h0IiwibWluSGVpZ2h0IiwibWF4SGVpZ2h0IiwiUm93RmxleCIsInZhbHVlIiwic3R5bGUiLCJkaXNwbGF5IiwicG9zaXRpb24iLCJmbGV4IiwiZmxleEdyb3ciLCJDb2x1bW5GbGV4IiwiZmxleFNocmluayIsIlBhbmUiLCJwcm9wcyIsImNoaWxkcmVuIiwiY2xhc3NOYW1lIiwic3BsaXQiLCJwcmVmaXhlZFN0eWxlIiwicHJvcFR5cGVzIiwibm9kZSIsInN0cmluZyIsIm9uZU9mVHlwZSIsIm51bWJlciIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFFQTs7Ozs7Ozs7OztBQUVBLElBQU1BLFFBQVEsU0FBUkEsS0FBUTtBQUFBLE1BQUdDLFVBQUgsUUFBR0EsVUFBSDtBQUFBLE1BQWVDLFdBQWYsUUFBZUEsV0FBZjtBQUFBLE1BQTRCQyxJQUE1QixRQUE0QkEsSUFBNUI7QUFBQSxNQUFrQ0MsT0FBbEMsUUFBa0NBLE9BQWxDO0FBQUEsTUFBMkNDLE9BQTNDLFFBQTJDQSxPQUEzQztBQUFBLFNBQTBEO0FBQ3RFQyxXQUFPTCxjQUFjQyxXQUFkLEdBQTRCQSxXQUE1QixHQUEwQ0MsT0FBTyxJQURjO0FBRXRFSSxjQUFVSCxPQUY0RDtBQUd0RUksY0FBVUgsT0FINEQ7QUFJdEVJLGFBQVM7QUFKNkQsR0FBMUQ7QUFBQSxDQUFkOztBQU9BLElBQU1DLFdBQVcsU0FBWEEsUUFBVztBQUFBLE1BQUdULFVBQUgsU0FBR0EsVUFBSDtBQUFBLE1BQWVDLFdBQWYsU0FBZUEsV0FBZjtBQUFBLE1BQTRCQyxJQUE1QixTQUE0QkEsSUFBNUI7QUFB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bEJoQyxlQUFhLEdBREs7QUFFbEJ5QixTQUFPLFVBRlc7QUFHbEJ2QixXQUFTLEdBSFM7QUFJbEJDLFdBQVM7QUFKUyxDQUFwQjs7a0JBT2VrQixJIiwiZmlsZSI6IlBhbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgUHVyZUNvbXBvbmVudCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5cbmltcG9ydCBwcmVmaXhBbGwgZnJvbSAnaW5saW5lLXN0eWxlLXByZWZpeGVyL3N0YXRpYyc7XG5cbmltcG9ydCB7Z2V0VW5pdH0gZnJvbSBcIi4vU3BsaXRQYW5lXCI7XG5cbmNvbnN0IFJvd1B4ID0gKHsgdXNlSW5pdGlhbCwgaW5pdGlhbFNpemUsIHNpemUsIG1pblNpemUsIG1heFNpemUgfSkgPT4gKHtcbiAgd2lkdGg6IHVzZUluaXRpYWwgJiYgaW5pdGlhbFNpemUgPyBpbml0aWFsU2l6ZSA6IHNpemUgKyAncHgnLFxuICBtaW5XaWR0aDogbWluU2l6ZSxcbiAgbWF4V2lkdGg6IG1heFNpemUsXG4gIG91dGxpbmU6ICdub25lJyxcbn0pO1xuXG5jb25zdCBDb2x1bW5QeCA9ICh7IHVzZUluaXRpYWwsIGluaXRpYWxTaXplLCBzaXplLCBtaW5TaXplLCBtYXhTaXplIH0pID0+ICh7XG4gIGhlaWdodDogdXNlSW5pdGlhbCAmJiBpbml0aWFsU2l6ZSA/IGluaXRpYWxTaXplIDogc2l6ZSArICdweCcsXG4gIG1pbkhlaWdodDogbWluU2l6ZSxcbiAgbWF4SGVpZ2h0OiBtYXhTaXplLFxuICBvdXRsaW5lOiAnbm9uZScsXG59KTtcblxuY29uc3QgUm93RmxleCA9ICh7IGluaXRpYWxTaXplLCBzaXplLCBtaW5TaXplLCBtYXhTaXplIH0pID0+IHtcbiAgY29uc3QgdmFsdWUgPSBzaXplID8gc2l6ZSA6IGluaXRpYWxTaXplO1xuXG4gIGNvbnN0IHN0eWxlID0ge1xuICAgIG1pbldpZHRoOiBtaW5TaXplLFxuICAgIG1heFdpZHRoOiBtYXhTaXplLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBvdXRsaW5lOiAnbm9uZScsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgfTtcblxuICBpZiAoZ2V0VW5pdCh2YWx1ZSkgPT09IFwicmF0aW9cIikge1xuICAgIHN0eWxlLmZsZXggPSB2YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5mbGV4R3JvdyA9IDA7XG4gICAgc3R5bGUud2lkdGggPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBzdHlsZTtcbn07XG5cbmNvbnN0IENvbHVtbkZsZXggPSAoeyBpbml0aWFsU2l6ZSwgc2l6ZSwgbWluU2l6ZSwgbWF4U2l6ZSB9KSA9PiB7XG4gIGNvbnN0IHZhbHVlID0gc2l6ZSA/IHNpemUgOiBpbml0aWFsU2l6ZTtcblxuICBjb25zdCBzdHlsZSA9IHtcbiAgICBtaW5IZWlnaHQ6IG1pblNpemUsXG4gICAgbWF4SGVpZ2h0OiBtYXhTaXplLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBvdXRsaW5lOiAnbm9uZScsXG4gICAgZmxleFNocmluazogMSxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICB9O1xuXG4gIGlmIChnZXRVbml0KHZhbHVlKSA9PT0gXCJyYXRpb1wiKSB7XG4gICAgc3R5bGUuZmxleCA9IHZhbHVlO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmZsZXhHcm93ID0gMDtcbiAgICBzdHlsZS5oZWlnaHQgPSB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBzdHlsZTtcbn07XG5cblxuY2xhc3MgUGFuZSBleHRlbmRzIFB1cmVDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2hpbGRyZW4sXG4gICAgICBjbGFzc05hbWUsXG4gICAgICBzcGxpdCxcbiAgICAgIHVzZUluaXRpYWwsXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBsZXQgcHJlZml4ZWRTdHlsZTtcblxuICAgIGlmIChzcGxpdCA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgcHJlZml4ZWRTdHlsZSA9IHByZWZpeEFsbChSb3dGbGV4KHRoaXMucHJvcHMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJlZml4ZWRTdHlsZSA9IHByZWZpeEFsbChDb2x1bW5GbGV4KHRoaXMucHJvcHMpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gc3R5bGU9e3ByZWZpeGVkU3R5bGV9PlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cblBhbmUucHJvcFR5cGVzID0ge1xuICBjaGlsZHJlbjogUHJvcFR5cGVzLm5vZGUsXG4gIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgaW5pdGlhbFNpemU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1Byb3BUeXBlcy5zdHJpbmcsIFByb3BUeXBlcy5udW1iZXJdKSxcbiAgbWluU2l6ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgbWF4U2l6ZTogUHJvcFR5cGVzLnN0cmluZyxcbn07XG5cblBhbmUuZGVmYXVsdFByb3BzID0ge1xuICBpbml0aWFsU2l6ZTogXCIxXCIsXG4gIHNwbGl0OiAndmVydGljYWwnLFxuICBtaW5TaXplOiAnMCcsXG4gIG1heFNpemU6ICcxMDAlJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBhbmU7XG4iXX0=