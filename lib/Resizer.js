'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n  background: #000;\n  opacity: 0.2;\n  z-index: 1;\n  box-sizing: border-box;\n  background-clip: padding-box;\n\n  :hover {\n    transition: all 2s ease;\n  }\n'], ['\n  background: #000;\n  opacity: 0.2;\n  z-index: 1;\n  box-sizing: border-box;\n  background-clip: padding-box;\n\n  :hover {\n    transition: all 2s ease;\n  }\n']),
    _templateObject2 = _taggedTemplateLiteral(['\n  height: 11px;\n  margin: -5px 0;\n  border-top: 5px solid rgba(255, 255, 255, 0);\n  border-bottom: 5px solid rgba(255, 255, 255, 0);\n  cursor: row-resize;\n  width: 100%;\n\n  :hover {\n    border-top: 5px solid rgba(0, 0, 0, 0.5);\n    border-bottom: 5px solid rgba(0, 0, 0, 0.5);\n  }\n\n  .disabled {\n    cursor: not-allowed;\n  }\n  .disabled:hover {\n    border-color: transparent;\n  }\n'], ['\n  height: 11px;\n  margin: -5px 0;\n  border-top: 5px solid rgba(255, 255, 255, 0);\n  border-bottom: 5px solid rgba(255, 255, 255, 0);\n  cursor: row-resize;\n  width: 100%;\n\n  :hover {\n    border-top: 5px solid rgba(0, 0, 0, 0.5);\n    border-bottom: 5px solid rgba(0, 0, 0, 0.5);\n  }\n\n  .disabled {\n    cursor: not-allowed;\n  }\n  .disabled:hover {\n    border-color: transparent;\n  }\n']),
    _templateObject3 = _taggedTemplateLiteral(['\n  width: 11px;\n  margin: 0 -5px;\n  border-left: 5px solid rgba(255, 255, 255, 0);\n  border-right: 5px solid rgba(255, 255, 255, 0);\n  cursor: col-resize;\n\n  :hover {\n    border-left: 5px solid rgba(0, 0, 0, 0.5);\n    border-right: 5px solid rgba(0, 0, 0, 0.5);\n  }\n  .disabled {\n    cursor: not-allowed;\n  }\n  .disabled:hover {\n    border-color: transparent;\n  }\n'], ['\n  width: 11px;\n  margin: 0 -5px;\n  border-left: 5px solid rgba(255, 255, 255, 0);\n  border-right: 5px solid rgba(255, 255, 255, 0);\n  cursor: col-resize;\n\n  :hover {\n    border-left: 5px solid rgba(0, 0, 0, 0.5);\n    border-right: 5px solid rgba(0, 0, 0, 0.5);\n  }\n  .disabled {\n    cursor: not-allowed;\n  }\n  .disabled:hover {\n    border-color: transparent;\n  }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var Wrapper = _styledComponents2.default.div(_templateObject);

var HorizontalWrapper = (0, _styledComponents2.default)(Wrapper)(_templateObject2);

var VerticalWrapper = (0, _styledComponents2.default)(Wrapper)(_templateObject3);

var Resizer = function (_Component) {
  _inherits(Resizer, _Component);

  function Resizer() {
    _classCallCheck(this, Resizer);

    return _possibleConstructorReturn(this, (Resizer.__proto__ || Object.getPrototypeOf(Resizer)).apply(this, arguments));
  }

  _createClass(Resizer, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          index = _props.index,
          _props$split = _props.split,
          split = _props$split === undefined ? 'vertical' : _props$split,
          _props$onClick = _props.onClick,
          _onClick = _props$onClick === undefined ? function () {} : _props$onClick,
          _props$onDoubleClick = _props.onDoubleClick,
          _onDoubleClick = _props$onDoubleClick === undefined ? function () {} : _props$onDoubleClick,
          _props$onMouseDown = _props.onMouseDown,
          _onMouseDown = _props$onMouseDown === undefined ? function () {} : _props$onMouseDown,
          _props$onTouchEnd = _props.onTouchEnd,
          _onTouchEnd = _props$onTouchEnd === undefined ? function () {} : _props$onTouchEnd,
          _props$onTouchStart = _props.onTouchStart,
          _onTouchStart = _props$onTouchStart === undefined ? function () {} : _props$onTouchStart;

      var props = {
        ref: function ref(_) {
          return _this2.resizer = _;
        },
        'data-attribute': split,
        'data-type': 'Resizer',
        onMouseDown: function onMouseDown(event) {
          return _onMouseDown(event, index);
        },
        onTouchStart: function onTouchStart(event) {
          event.preventDefault();
          _onTouchStart(event, index);
        },
        onTouchEnd: function onTouchEnd(event) {
          event.preventDefault();
          _onTouchEnd(event, index);
        },
        onClick: function onClick(event) {
          if (_onClick) {
            event.preventDefault();
            _onClick(event, index);
          }
        },
        onDoubleClick: function onDoubleClick(event) {
          if (_onDoubleClick) {
            event.preventDefault();
            _onDoubleClick(event, index);
          }
        }
      };

      return split === 'vertical' ? _react2.default.createElement(VerticalWrapper, props) : _react2.default.createElement(HorizontalWrapper, props);
    }
  }]);

  return Resizer;
}(_react.Component);

exports.default = Resizer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXNpemVyLmpzIl0sIm5hbWVzIjpbIldyYXBwZXIiLCJkaXYiLCJIb3Jpem9udGFsV3JhcHBlciIsIlZlcnRpY2FsV3JhcHBlciIsIlJlc2l6ZXIiLCJwcm9wcyIsImluZGV4Iiwic3BsaXQiLCJvbkNsaWNrIiwib25Eb3VibGVDbGljayIsIm9uTW91c2VEb3duIiwib25Ub3VjaEVuZCIsIm9uVG91Y2hTdGFydCIsInJlZiIsInJlc2l6ZXIiLCJfIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxVQUFVLDJCQUFPQyxHQUFqQixpQkFBTjs7QUFZQSxJQUFNQyxvQkFBb0IsZ0NBQU9GLE9BQVAsQ0FBcEIsa0JBQU47O0FBcUJBLElBQU1HLGtCQUFrQixnQ0FBT0gsT0FBUCxDQUFsQixrQkFBTjs7SUFtQk1JLE87Ozs7Ozs7Ozs7OzZCQUNLO0FBQUE7O0FBQUEsbUJBU0gsS0FBS0MsS0FURjtBQUFBLFVBRUxDLEtBRkssVUFFTEEsS0FGSztBQUFBLGdDQUdMQyxLQUhLO0FBQUEsVUFHTEEsS0FISyxnQ0FHRyxVQUhIO0FBQUEsa0NBSUxDLE9BSks7QUFBQSxVQUlMQSxRQUpLLGtDQUlLLFlBQU0sQ0FBRSxDQUpiO0FBQUEsd0NBS0xDLGFBTEs7QUFBQSxVQUtMQSxjQUxLLHdDQUtXLFlBQU0sQ0FBRSxDQUxuQjtBQUFBLHNDQU1MQyxXQU5LO0FBQUEsVUFNTEEsWUFOSyxzQ0FNUyxZQUFNLENBQUUsQ0FOakI7QUFBQSxxQ0FPTEMsVUFQSztBQUFBLFVBT0xBLFdBUEsscUNBT1EsWUFBTSxDQUFFLENBUGhCO0FBQUEsdUNBUUxDLFlBUks7QUFBQSxVQVFMQSxhQVJLLHVDQVFVLFlBQU0sQ0FBRSxDQVJsQjs7QUFXUCxVQUFNUCxRQUFRO0FBQ1pRLGFBQUs7QUFBQSxpQkFBTSxPQUFLQyxPQUFMLEdBQWVDLENBQXJCO0FBQUEsU0FETztBQUVaLDBCQUFrQlIsS0FGTjtBQUdaLHFCQUFhLFNBSEQ7QUFJWkcscUJBQWE7QUFBQSxpQkFBU0EsYUFBWU0sS0FBWixFQUFtQlYsS0FBbkIsQ0FBVDtBQUFBLFNBSkQ7QUFLWk0sc0JBQWMsNkJBQVM7QUFDckJJLGdCQUFNQyxjQUFOO0FBQ0FMLHdCQUFhSSxLQUFiLEVBQW9CVixLQUFwQjtBQUNELFNBUlc7QUFTWkssb0JBQVksMkJBQVM7QUFDbkJLLGdCQUFNQyxjQUFOO0FBQ0FOLHNCQUFXSyxLQUFYLEVBQWtCVixLQUFsQjtBQUNELFNBWlc7QUFhWkUsaUJBQVMsd0JBQVM7QUFDaEIsY0FBSUEsUUFBSixFQUFhO0FBQ1hRLGtCQUFNQyxjQUFOO0FBQ0FULHFCQUFRUSxLQUFSLEVBQWVWLEtBQWY7QUFDRDtBQUNGLFNBbEJXO0FBbUJaRyx1QkFBZSw4QkFBUztBQUN0QixjQUFJQSxjQUFKLEVBQW1CO0FBQ2pCTyxrQkFBTUMsY0FBTjtBQUNBUiwyQkFBY08sS0FBZCxFQUFxQlYsS0FBckI7QUFDRDtBQUNGO0FBeEJXLE9BQWQ7O0FBMkJBLGFBQU9DLFVBQVUsVUFBVixHQUNMLDhCQUFDLGVBQUQsRUFBcUJGLEtBQXJCLENBREssR0FHTCw4QkFBQyxpQkFBRCxFQUF1QkEsS0FBdkIsQ0FIRjtBQUtEOzs7Ozs7a0JBR1lELE8iLCJmaWxlIjoiUmVzaXplci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ3N0eWxlZC1jb21wb25lbnRzJztcblxuY29uc3QgV3JhcHBlciA9IHN0eWxlZC5kaXZgXG4gIGJhY2tncm91bmQ6ICMwMDA7XG4gIG9wYWNpdHk6IDAuMjtcbiAgei1pbmRleDogMTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgYmFja2dyb3VuZC1jbGlwOiBwYWRkaW5nLWJveDtcblxuICA6aG92ZXIge1xuICAgIHRyYW5zaXRpb246IGFsbCAycyBlYXNlO1xuICB9XG5gO1xuXG5jb25zdCBIb3Jpem9udGFsV3JhcHBlciA9IHN0eWxlZChXcmFwcGVyKWBcbiAgaGVpZ2h0OiAxMXB4O1xuICBtYXJnaW46IC01cHggMDtcbiAgYm9yZGVyLXRvcDogNXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMCk7XG4gIGJvcmRlci1ib3R0b206IDVweCBzb2xpZCByZ2JhKDI1NSwgMjU1LCAyNTUsIDApO1xuICBjdXJzb3I6IHJvdy1yZXNpemU7XG4gIHdpZHRoOiAxMDAlO1xuXG4gIDpob3ZlciB7XG4gICAgYm9yZGVyLXRvcDogNXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC41KTtcbiAgICBib3JkZXItYm90dG9tOiA1cHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjUpO1xuICB9XG5cbiAgLmRpc2FibGVkIHtcbiAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICB9XG4gIC5kaXNhYmxlZDpob3ZlciB7XG4gICAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgfVxuYDtcblxuY29uc3QgVmVydGljYWxXcmFwcGVyID0gc3R5bGVkKFdyYXBwZXIpYFxuICB3aWR0aDogMTFweDtcbiAgbWFyZ2luOiAwIC01cHg7XG4gIGJvcmRlci1sZWZ0OiA1cHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKTtcbiAgYm9yZGVyLXJpZ2h0OiA1cHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwKTtcbiAgY3Vyc29yOiBjb2wtcmVzaXplO1xuXG4gIDpob3ZlciB7XG4gICAgYm9yZGVyLWxlZnQ6IDVweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuNSk7XG4gICAgYm9yZGVyLXJpZ2h0OiA1cHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjUpO1xuICB9XG4gIC5kaXNhYmxlZCB7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgfVxuICAuZGlzYWJsZWQ6aG92ZXIge1xuICAgIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIH1cbmA7XG5cbmNsYXNzIFJlc2l6ZXIgZXh0ZW5kcyBDb21wb25lbnQge1xuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgaW5kZXgsXG4gICAgICBzcGxpdCA9ICd2ZXJ0aWNhbCcsXG4gICAgICBvbkNsaWNrID0gKCkgPT4ge30sXG4gICAgICBvbkRvdWJsZUNsaWNrID0gKCkgPT4ge30sXG4gICAgICBvbk1vdXNlRG93biA9ICgpID0+IHt9LFxuICAgICAgb25Ub3VjaEVuZCA9ICgpID0+IHt9LFxuICAgICAgb25Ub3VjaFN0YXJ0ID0gKCkgPT4ge30sXG4gICAgfSA9IHRoaXMucHJvcHM7XG5cbiAgICBjb25zdCBwcm9wcyA9IHtcbiAgICAgIHJlZjogXyA9PiAodGhpcy5yZXNpemVyID0gXyksXG4gICAgICAnZGF0YS1hdHRyaWJ1dGUnOiBzcGxpdCxcbiAgICAgICdkYXRhLXR5cGUnOiAnUmVzaXplcicsXG4gICAgICBvbk1vdXNlRG93bjogZXZlbnQgPT4gb25Nb3VzZURvd24oZXZlbnQsIGluZGV4KSxcbiAgICAgIG9uVG91Y2hTdGFydDogZXZlbnQgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBvblRvdWNoU3RhcnQoZXZlbnQsIGluZGV4KTtcbiAgICAgIH0sXG4gICAgICBvblRvdWNoRW5kOiBldmVudCA9PiB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIG9uVG91Y2hFbmQoZXZlbnQsIGluZGV4KTtcbiAgICAgIH0sXG4gICAgICBvbkNsaWNrOiBldmVudCA9PiB7XG4gICAgICAgIGlmIChvbkNsaWNrKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBvbkNsaWNrKGV2ZW50LCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvbkRvdWJsZUNsaWNrOiBldmVudCA9PiB7XG4gICAgICAgIGlmIChvbkRvdWJsZUNsaWNrKSB7XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBvbkRvdWJsZUNsaWNrKGV2ZW50LCBpbmRleCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcblxuICAgIHJldHVybiBzcGxpdCA9PT0gJ3ZlcnRpY2FsJyA/IChcbiAgICAgIDxWZXJ0aWNhbFdyYXBwZXIgey4uLnByb3BzfSAvPlxuICAgICkgOiAoXG4gICAgICA8SG9yaXpvbnRhbFdyYXBwZXIgey4uLnByb3BzfSAvPlxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVzaXplcjtcbiJdfQ==