(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Save the previous value of the device variable.
var previousDevice = window.device;

var device = {};

var changeOrientationList = [];

// Add device as a global object.
window.device = device;

// The <html> element.
var documentElement = window.document.documentElement;

// The client user agent string.
// Lowercase, so we can use the more efficient indexOf(), instead of Regex
var userAgent = window.navigator.userAgent.toLowerCase();

// Detectable television devices.
var television = ['googletv', 'viera', 'smarttv', 'internet.tv', 'netcast', 'nettv', 'appletv', 'boxee', 'kylo', 'roku', 'dlnadoc', 'roku', 'pov_tv', 'hbbtv', 'ce-html'];

// Main functions
// --------------

device.macos = function () {
  return find('mac');
};

device.ios = function () {
  return device.iphone() || device.ipod() || device.ipad();
};

device.iphone = function () {
  return !device.windows() && find('iphone');
};

device.ipod = function () {
  return find('ipod');
};

device.ipad = function () {
  return find('ipad');
};

device.android = function () {
  return !device.windows() && find('android');
};

device.androidPhone = function () {
  return device.android() && find('mobile');
};

device.androidTablet = function () {
  return device.android() && !find('mobile');
};

device.blackberry = function () {
  return find('blackberry') || find('bb10') || find('rim');
};

device.blackberryPhone = function () {
  return device.blackberry() && !find('tablet');
};

device.blackberryTablet = function () {
  return device.blackberry() && find('tablet');
};

device.windows = function () {
  return find('windows');
};

device.windowsPhone = function () {
  return device.windows() && find('phone');
};

device.windowsTablet = function () {
  return device.windows() && find('touch') && !device.windowsPhone();
};

device.fxos = function () {
  return (find('(mobile') || find('(tablet')) && find(' rv:');
};

device.fxosPhone = function () {
  return device.fxos() && find('mobile');
};

device.fxosTablet = function () {
  return device.fxos() && find('tablet');
};

device.meego = function () {
  return find('meego');
};

device.cordova = function () {
  return window.cordova && location.protocol === 'file:';
};

device.nodeWebkit = function () {
  return _typeof(window.process) === 'object';
};

device.mobile = function () {
  return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone() || device.fxosPhone() || device.meego();
};

device.tablet = function () {
  return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet() || device.fxosTablet();
};

device.desktop = function () {
  return !device.tablet() && !device.mobile();
};

device.television = function () {
  var i = 0;
  while (i < television.length) {
    if (find(television[i])) {
      return true;
    }
    i++;
  }
  return false;
};

device.portrait = function () {
  return window.innerHeight / window.innerWidth > 1;
};

device.landscape = function () {
  return window.innerHeight / window.innerWidth < 1;
};

// Public Utility Functions
// ------------------------

// Run device.js in noConflict mode,
// returning the device variable to its previous owner.
device.noConflict = function () {
  window.device = previousDevice;
  return this;
};

// Private Utility Functions
// -------------------------

// Simple UA string search
function find(needle) {
  return userAgent.indexOf(needle) !== -1;
}

// Check if documentElement already has a given class.
function hasClass(className) {
  return documentElement.className.match(new RegExp(className, 'i'));
}

// Add one or more CSS classes to the <html> element.
function addClass(className) {
  var currentClassNames = null;
  if (!hasClass(className)) {
    currentClassNames = documentElement.className.replace(/^\s+|\s+$/g, '');
    documentElement.className = currentClassNames + ' ' + className;
  }
}

// Remove single CSS class from the <html> element.
function removeClass(className) {
  if (hasClass(className)) {
    documentElement.className = documentElement.className.replace(' ' + className, '');
  }
}

// HTML Element Handling
// ---------------------

// Insert the appropriate CSS class based on the _user_agent.

if (device.ios()) {
  if (device.ipad()) {
    addClass('ios ipad tablet');
  } else if (device.iphone()) {
    addClass('ios iphone mobile');
  } else if (device.ipod()) {
    addClass('ios ipod mobile');
  }
} else if (device.macos()) {
  addClass('macos desktop');
} else if (device.android()) {
  if (device.androidTablet()) {
    addClass('android tablet');
  } else {
    addClass('android mobile');
  }
} else if (device.blackberry()) {
  if (device.blackberryTablet()) {
    addClass('blackberry tablet');
  } else {
    addClass('blackberry mobile');
  }
} else if (device.windows()) {
  if (device.windowsTablet()) {
    addClass('windows tablet');
  } else if (device.windowsPhone()) {
    addClass('windows mobile');
  } else {
    addClass('windows desktop');
  }
} else if (device.fxos()) {
  if (device.fxosTablet()) {
    addClass('fxos tablet');
  } else {
    addClass('fxos mobile');
  }
} else if (device.meego()) {
  addClass('meego mobile');
} else if (device.nodeWebkit()) {
  addClass('node-webkit');
} else if (device.television()) {
  addClass('television');
} else if (device.desktop()) {
  addClass('desktop');
}

if (device.cordova()) {
  addClass('cordova');
}

// Orientation Handling
// --------------------

// Handle device orientation changes.
function handleOrientation() {
  if (device.landscape()) {
    removeClass('portrait');
    addClass('landscape');
    walkOnChangeOrientationList('landscape');
  } else {
    removeClass('landscape');
    addClass('portrait');
    walkOnChangeOrientationList('portrait');
  }
  setOrientationCache();
}

function walkOnChangeOrientationList(newOrientation) {
  for (var index in changeOrientationList) {
    changeOrientationList[index](newOrientation);
  }
}

device.onChangeOrientation = function (cb) {
  if (typeof cb == 'function') {
    changeOrientationList.push(cb);
  }
};

// Detect whether device supports orientationchange event,
// otherwise fall back to the resize event.
var orientationEvent = 'resize';
if (Object.prototype.hasOwnProperty.call(window, 'onorientationchange')) {
  orientationEvent = 'onorientationchange';
}

// Listen for changes in orientation.
if (window.addEventListener) {
  window.addEventListener(orientationEvent, handleOrientation, false);
} else if (window.attachEvent) {
  window.attachEvent(orientationEvent, handleOrientation);
} else {
  window[orientationEvent] = handleOrientation;
}

handleOrientation();

// Public functions to get the current value of type, os, or orientation
// ---------------------------------------------------------------------

function findMatch(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (device[arr[i]]()) {
      return arr[i];
    }
  }
  return 'unknown';
}

device.type = findMatch(['mobile', 'tablet', 'desktop']);
device.os = findMatch(['ios', 'iphone', 'ipad', 'ipod', 'android', 'blackberry', 'windows', 'fxos', 'meego', 'television']);

function setOrientationCache() {
  device.orientation = findMatch(['portrait', 'landscape']);
}

setOrientationCache();

exports.default = device;
module.exports = exports['default'];
},{}],2:[function(require,module,exports){
'use strict'
/*eslint-env browser */

module.exports = {
  /**
   * Create a <style>...</style> tag and add it to the document head
   * @param {string} cssText
   * @param {object?} options
   * @return {Element}
   */
  createStyle: function (cssText, options) {
    var container = document.head || document.getElementsByTagName('head')[0]
    var style = document.createElement('style')
    options = options || {}
    style.type = 'text/css'
    if (options.href) {
      style.setAttribute('data-href', options.href)
    }
    if (style.sheet) { // for jsdom and IE9+
      style.innerHTML = cssText
      style.sheet.cssText = cssText
    }
    else if (style.styleSheet) { // for IE8 and below
      style.styleSheet.cssText = cssText
    }
    else { // for Chrome, Firefox, and Safari
      style.appendChild(document.createTextNode(cssText))
    }
    if (options.prepend) {
      container.insertBefore(style, container.childNodes[0]);
    } else {
      container.appendChild(style);
    }
    return style
  }
}

},{}],3:[function(require,module,exports){
var styles = require('./styles.scss');

(function (window) {
  var _config = window._InSalesSnowFlakes || {
    count: 20,
    speed: 5,
    color: '#63cdff',
    size: 20,
    hideOnMobile: true,
  };
  var count = _config.count;
  var flakesCount = 1;
  var insFlakeSnow = [];
  var Y = new Array();
  var X = new Array();
  var Speed = new Array();
  var Step = new Array();
  var Xstep = new Array();
  var height = window.innerHeight;
  var width = window.innerWidth;
  var hscroll = window.pageYOffset;
  var wscroll = window.pageXOffset;
  var device = require('current-device');
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.5 149.05"><g id="OBJECT"><path d="M130.12,104.49l-15.77-9.1,13.09-3.51a5.24,5.24,0,1,0-2.71-10.11L101.53,88,78.22,74.52l23.31-13.46,23.21,6.22a5.24,5.24,0,0,0,2.71-10.11l-13.09-3.51,15.77-9.1a5.24,5.24,0,0,0-5.24-9.07l-15.77,9.1,3.51-13.09a5.24,5.24,0,1,0-10.11-2.71L96.3,52,73,65.46V38.54l17-17a5.24,5.24,0,0,0-7.4-7.4L73,23.73V5.53a5.24,5.24,0,1,0-10.47,0V23.73l-9.59-9.59a5.24,5.24,0,1,0-7.4,7.4l17,17V65.46L39.2,52,33,28.79A5.24,5.24,0,0,0,22.87,31.5l3.51,13.09-15.77-9.1a5.24,5.24,0,1,0-5.24,9.07l15.77,9.1L8,57.17a5.24,5.24,0,0,0,2.71,10.11L34,61.07,57.28,74.52,34,88,10.76,81.76A5.24,5.24,0,1,0,8,91.88l13.09,3.51-15.77,9.1a5.24,5.24,0,1,0,5.24,9.07l15.77-9.1-3.51,13.09A5.24,5.24,0,0,0,33,120.26L39.2,97.05,62.51,83.59v26.92l-17,17a5.24,5.24,0,1,0,7.4,7.4l9.59-9.59v18.21a5.24,5.24,0,0,0,10.47,0v-18.2l9.59,9.59a5.24,5.24,0,1,0,7.4-7.4l-17-17V83.59L96.3,97.05l6.22,23.21a5.24,5.24,0,0,0,10.11-2.71l-3.51-13.09,15.77,9.1a5.24,5.24,0,0,0,5.24-9.07Z"/></g></svg>';

  if (_config.hideOnMobile && !device.desktop()) {
    return;
  }

  function createSvg() {
    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', "svg");
    var _g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    var _path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    _path.setAttribute('d', 'M130.12,104.49l-15.77-9.1,13.09-3.51a5.24,5.24,0,1,0-2.71-10.11L101.53,88,78.22,74.52l23.31-13.46,23.21,6.22a5.24,5.24,0,0,0,2.71-10.11l-13.09-3.51,15.77-9.1a5.24,5.24,0,0,0-5.24-9.07l-15.77,9.1,3.51-13.09a5.24,5.24,0,1,0-10.11-2.71L96.3,52,73,65.46V38.54l17-17a5.24,5.24,0,0,0-7.4-7.4L73,23.73V5.53a5.24,5.24,0,1,0-10.47,0V23.73l-9.59-9.59a5.24,5.24,0,1,0-7.4,7.4l17,17V65.46L39.2,52,33,28.79A5.24,5.24,0,0,0,22.87,31.5l3.51,13.09-15.77-9.1a5.24,5.24,0,1,0-5.24,9.07l15.77,9.1L8,57.17a5.24,5.24,0,0,0,2.71,10.11L34,61.07,57.28,74.52,34,88,10.76,81.76A5.24,5.24,0,1,0,8,91.88l13.09,3.51-15.77,9.1a5.24,5.24,0,1,0,5.24,9.07l15.77-9.1-3.51,13.09A5.24,5.24,0,0,0,33,120.26L39.2,97.05,62.51,83.59v26.92l-17,17a5.24,5.24,0,1,0,7.4,7.4l9.59-9.59v18.21a5.24,5.24,0,0,0,10.47,0v-18.2l9.59,9.59a5.24,5.24,0,1,0,7.4-7.4l-17-17V83.59L96.3,97.05l6.22,23.21a5.24,5.24,0,0,0,10.11-2.71l-3.51-13.09,15.77,9.1a5.24,5.24,0,0,0,5.24-9.07Z')

    _g.id = 'OBJECT';
    _g.appendChild(_path);

    svgElement.setAttribute('viewBox', '0 0 135.5 149.05');
    svgElement.appendChild(_g);

    return svgElement;
  }

  function makeFlake (i) {
    var _imageId = 0;
    var _node = document.createElement('div');

    _node.style.fill = _config.color;
    _node.style.width = _config.size + 'px';
    _node.style.height = _config.size + 'px';

    _node.className = 'ins-flake ins-flake_' + _imageId;
    _node.id = 'insFlakeSnow' + i;
    _node.appendChild(createSvg());
    console.log(_node);

    return _node;
  }

  function moveFlake(i) {
    var sy = Speed[i] * Math.sin(Math.PI / 2);
    var sx = Speed[i] * Math.cos(Xstep[i]);

    if (X[i] + sx > width - 99) {
      X[i] -= sx;
    }

    X[i] += sx;
    Y[i] += sy;

    if (Y[i] > height - 50) {
      Y[i] = 0;
      X[i] = Math.round(Math.random() * width) - 99;
      Speed[i] = Math.random() * _config.speed + 1;
    }

    insFlakeSnow[i].style.left = (X[i] + wscroll) + 'px';
    insFlakeSnow[i].style.top = (Y[i] + hscroll) + 'px';

    Xstep[i] += Step[i];

    return;
  }

  function create () {
    for (i = 0; i < count; i++) {
      var _node = makeFlake(i);
      document.body.appendChild(_node);
      insFlakeSnow[i] = _node;
    }

    for (i = 0; i < count; i++) {
      Y[i] = Math.round(Math.random() * height);
      X[i] = Math.round(Math.random() * width) - 99;
      Speed[i] = Math.random() * 5 + 2;
      Xstep[i] = 0;
      Step[i] = Math.random() * 0.1 + 0.05;
    };
  }

  function fall () {
    height = window.innerHeight;
    width = window.innerWidth;
    hscroll = window.pageYOffset;
    wscroll = window.pageXOffset;

    for (i = 0; i < count; i++) {
      moveFlake(i);
    }
  };

  function startFall() {
    create();
    setInterval(fall, 20);
  }

  if (document.querySelector('body')) {
    startFall();
  }
  else {
    document.addEventListener('DOMContentLoaded', function () {
      startFall();
    })
  }
})(window);
},{"./styles.scss":4,"current-device":1}],4:[function(require,module,exports){
var css = ".ins-flake {\n  width: 20px;\n  height: 20px;\n  position: absolute;\n  z-index: 1000; }\n\n/*# sourceMappingURL=styles.scss.map */"
module.exports = require('scssify').createStyle(css, {"href":false,"prepend":false})
},{"scssify":2}]},{},[3]);
