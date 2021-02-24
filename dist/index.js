function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var classNames = _interopDefault(require('classnames'));
var browserOrNode = require('browser-or-node');
var isPlainObject = _interopDefault(require('lodash/isPlainObject'));
var camelCase = _interopDefault(require('lodash/camelCase'));
var propTypes = require('prop-types');

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

var prefixObject = {
  css: '',
  js: ''
};

if (browserOrNode.isBrowser) {
  var styles = window.getComputedStyle(document.documentElement);
  var prefixString = Array.prototype.slice.call(styles).join('');
  var standardPrefixString = prefixString.match(/-(moz|webkit|ms)-/);
  var operaPrefixString = prefixString.match(styles.OLink === '' && ['', 'o']);
  var prefixMatch = standardPrefixString || operaPrefixString;
  var prefix = prefixMatch ? prefixMatch[1] : '';
  prefixObject = {
    css: "-" + prefix + "-",
    js: prefix
  };

  if (prefixObject.js !== 'ms') {
    prefixObject = _extends({}, prefixObject, {
      js: "" + prefixObject.js.charAt(0).toUpperCase() + prefixObject.js.slice(1)
    });
  }
}

var prefix$1 = prefixObject;

var isSupported = function isSupported(property, value) {
  if (browserOrNode.isBrowser) {
    if ('CSS' in window && 'supports' in window.CSS) {
      return window.CSS.supports(property, value);
    }

    if ('supportsCSS' in window) {
      return window.supportsCSS(property, value);
    }

    var camelCaseProperty = camelCase(property);
    var element = document.createElement('div');
    var support = (camelCaseProperty in element.style);
    element.style.cssText = property + ":" + value;
    return support && element.style[camelCaseProperty] !== '';
  }

  return false;
};

var ANIMATABLE_VALUES = ['columnCount', 'columnGap', 'columnRule', 'columnRuleColor', 'columnRuleWidth', 'columns', 'flex', 'flexBasis', 'flexGrow', 'flexShrink', 'order', 'perspective', 'perspectiveOrigin', 'perspectiveOriginX', 'perspectiveOriginY', 'scrollSnapCoordinate', 'scrollSnapDirection', 'textDecoration', 'textDecorationColor', 'transform', 'transformOrigin', 'transformOriginX', 'transformOriginY', 'transformOriginZ', 'transformStyle'];
var CSS_PROPERTIES = ['alignContent', 'alignItems', 'alignSelf', 'animation', 'animationDelay', 'animationDirection', 'animationDuration', 'animationFillMode', 'animationIterationCount', 'animationName', 'animationPlayState', 'animationTimingFunction', 'appearance', 'aspectRatio', 'backfaceVisibility', 'backgroundClip', 'borderImage', 'borderImageSlice', 'boxShadow', 'columnCount', 'columnFill', 'columnGap', 'columnRule', 'columnRuleColor', 'columnRuleStyle', 'columnRuleWidth', 'columnSpan', 'columnWidth', 'columns', 'flex', 'flexBasis', 'flexDirection', 'flexFlow', 'flexGrow', 'flexShrink', 'flexWrap', 'fontFeatureSettings', 'fontKearning', 'fontVariantLigatures', 'justifyContent', 'grid', 'gridArea', 'gridAutoColumns', 'gridAutoFlow', 'gridAutoRows', 'gridColumn', 'gridColumnEnd', 'gridColumnStart', 'gridRow', 'gridRowEnd', 'gridRowStart', 'gridTemplate', 'gridTemplateAreas', 'gridTemplateColumns', 'gridTemplateRows', 'hyphens', 'lineBreak', 'perspective', 'perspectiveOrigin', 'perspectiveOriginX', 'perspectiveOriginY', 'rubyPosition', 'scrollSnapCoordinate', 'scrollSnapDestination', 'scrollSnapPoints', 'scrollSnapPointsX', 'scrollSnapPointsY', 'scrollSnapType', 'tabSize', 'textDecoration', 'textDecorationColor', 'textDecorationLine', 'textDecorationStyle', 'textOrientation', 'textSizeAdjust', 'transform', 'transition', 'transformOrigin', 'transformOriginX', 'transformOriginY', 'transformOriginZ', 'transformStyle', 'transitionProperty', 'transitionDuration', 'transitionTimingFunction', 'transitionDelay', 'userModify', 'userSelect'];

var toKebabCase = function toKebabCase(string) {
  return string.replace(/([A-Z])/g, function ($1) {
    return "-" + $1.toLowerCase();
  });
};

var applyPrefixes = function applyPrefixes(object) {
  if (!isPlainObject(object)) {
    return object;
  }

  var value;
  return Object.keys(object).reduce(function (styleObject, originalKey) {
    var _extends5;

    var key = originalKey;
    value = object[key];

    if (isPlainObject(value)) {
      var _extends2;

      return _extends({}, styleObject, (_extends2 = {}, _extends2[key] = applyPrefixes(value), _extends2));
    }

    if (CSS_PROPERTIES.indexOf(key) !== -1 && !isSupported(toKebabCase(key), value)) {
      key = "" + prefix$1.js + key.charAt(0).toUpperCase() + key.slice(1);
    }

    if (originalKey === 'display' && object[originalKey] === 'flex' && !isSupported('display', 'flex')) {
      var _extends3;

      return _extends({}, styleObject, (_extends3 = {}, _extends3[key] = prefix$1.js === 'ms' ? '-ms-flexbox' : prefix$1.css + "flex", _extends3));
    }

    if (originalKey === 'transition') {
      var animatableValuesObject = ANIMATABLE_VALUES.reduce(function (animatableValues, animatableValue) {
        var kebabValue = toKebabCase(animatableValue);
        var re = new RegExp(kebabValue, 'g');

        if (re.test(object[originalKey]) && !isSupported(kebabValue)) {
          var _extends4;

          var cleanValue = object[originalKey].replace(re, "" + prefix$1.css + kebabValue);
          return _extends({}, animatableValues, (_extends4 = {}, _extends4[key] = cleanValue, _extends4));
        }

        return animatableValues;
      }, {});
      return _extends({}, styleObject, animatableValuesObject);
    }

    return _extends({}, styleObject, (_extends5 = {}, _extends5[key] = value, _extends5));
  }, {});
};

var isLteIE9 = function () {
  var ua = browserOrNode.isBrowser ? window.navigator.userAgent : "";
  var ie = ua.indexOf("MSIE ");
  return ie > -1 && parseInt(ua.substring(ie + 5, ua.indexOf(".", ie)), 10) <= 9;
}();

var Animated = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Animated, _React$Component);

  function Animated(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = props.animateOnMount ? _this.getNewState(props) : {};
    return _this;
  }

  Animated.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
    var nextIsVisible = nextProps.isVisible;
    var prevIsVisible = prevState.isVisible;

    if (nextIsVisible !== prevIsVisible) {
      return Animated.getNewState(_extends({}, prevState, nextProps));
    }

    return {};
  };

  var _proto = Animated.prototype;

  _proto.render = function render() {
    var _this$props = this.props,
        children = _this$props.children,
        style = _this$props.style,
        isVisible = _this$props.isVisible,
        innerRef = _this$props.innerRef,
        className = _this$props.className;
    var _this$state = this.state,
        animation = _this$state.animation,
        delay = _this$state.delay,
        duration = _this$state.duration;
    var classes = classNames("animated", animation, className);
    var backwardStyle = isLteIE9 || !animation ? {
      opacity: isVisible ? 1 : 0,
      transition: "opacity " + delay + "ms"
    } : {};
    return /*#__PURE__*/React.createElement("div", {
      className: classes,
      ref: innerRef,
      style: applyPrefixes(_extends({
        animationDelay: delay + "ms",
        animationDuration: duration + "ms",
        pointerEvents: isVisible ? "all" : "none"
      }, style, backwardStyle))
    }, children);
  };

  return Animated;
}(React.Component);

Animated.getNewState = function (_ref) {
  var isVisible = _ref.isVisible,
      animationIn = _ref.animationIn,
      animationOut = _ref.animationOut,
      animationInDuration = _ref.animationInDuration,
      animationOutDuration = _ref.animationOutDuration,
      animationInDelay = _ref.animationInDelay,
      animationOutDelay = _ref.animationOutDelay;
  return isVisible ? {
    animation: animationIn,
    duration: animationInDuration,
    delay: animationInDelay
  } : {
    animation: animationOut,
    duration: animationOutDuration,
    delay: animationOutDelay
  };
};

Animated.displayName = "Animated";
Animated.propTypes = {
  animateOnMount: propTypes.bool,
  isVisible: propTypes.bool,
  animationIn: propTypes.string,
  animationOut: propTypes.string,
  animationInDelay: propTypes.number,
  animationOutDelay: propTypes.number,
  animationInDuration: propTypes.number,
  animationOutDuration: propTypes.number,
  className: propTypes.string,
  style: propTypes.object,
  innerRef: propTypes.func
};
Animated.defaultProps = {
  animateOnMount: false,
  isVisible: true,
  animationInDelay: 0,
  animationOutDelay: 0,
  animationInDuration: 1000,
  animationOutDuration: 1000,
  className: "",
  style: {}
};

exports.Animated = Animated;
//# sourceMappingURL=index.js.map
