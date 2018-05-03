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