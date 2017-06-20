/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ({

/***/ 14:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by zhangchuanliang on 2017/6/12.
 */

var Drager = function () {
  function Drager(config) {
    _classCallCheck(this, Drager);

    Object.assign(this, config);
    // console.log(this)
    this.$el = document.getElementById(this.el);
    this.items = this.getItems();
    this.eleDrag = null;
    this.init();
    this.bindEvent();
  }

  _createClass(Drager, [{
    key: "init",
    value: function init() {
      // 添加draggable属性
      this.items.forEach(function (el, i) {
        el.setAttribute("draggable", "true");
      });
    }
  }, {
    key: "getItems",
    value: function getItems() {
      return [].map.call(this.$el.children, function (c, i) {
        return c;
      });
    }
    // 删除drag元素的disabled样式

  }, {
    key: "removeEleDrag",
    value: function removeEleDrag() {
      this.eleDrag.classList.remove(this.dragClass);
      this.eleDrag.parentNode.removeChild(this.eleDrag);
    }
    // 绑定事件

  }, {
    key: "bindEvent",
    value: function bindEvent() {
      var _this = this;

      var self = this;
      var $items = this.getItems();
      /* events fired on the draggable target */
      document.addEventListener("drag", function (event) {
        event.target.classList.add(_this.dragClass);
      }, false);

      document.addEventListener("dragstart", function (event) {
        self.eleDrag = event.target;
      }, false);

      document.addEventListener("dragend", function (event) {}, false);

      /* 鼠标移到drop元素上 */
      document.addEventListener("dragover", function (event) {
        event.preventDefault();
      }, false);

      document.addEventListener("dragenter", function (event) {}, false);

      document.addEventListener("dragleave", function (event) {}, false);

      document.addEventListener("drop", function (event) {
        /**
         * 1. 判断是否在this.el内
         * 2. 是否在itemClass上
         *    - 是：insertAdjacentHTML('beforebegin'|'afterend', html)
         *    - 否：根据鼠标所在this.el的位置，判断是prepend or append
         */
        event.preventDefault();
        // 如果元素是同一个，则不进行任何操作
        if (self.eleDrag.isEqualNode(event.target)) return;
        // move dragged elem to the selected drop target
        if (event.target.className === self.itemClass && $(event.target).parents(this.el).length > 0) {
          var directive = 'afterend';
          if (self.eleDrag.offsetTop > event.target.offsetTop) {
            directive = 'beforebegin';
          }
          self.removeEleDrag();
          event.target.insertAdjacentHTML(directive, self.eleDrag.outerHTML);
        } else if (event.target.id === self.el) {
          // console.log(event.offsetY)
          var filterEls = $items.filter(function (el, i) {
            return el.offsetTop >= event.offsetY;
          });

          self.removeEleDrag();

          if (filterEls.length > 0) {
            filterEls[0].insertAdjacentHTML('beforebegin', self.eleDrag.outerHTML);
          } else if (filterEls.length === 0) {
            self.$el.appendChild(self.eleDrag);
          }
        }
        $items = self.getItems();
      }, false);
    }
  }]);

  return Drager;
}();
// function getElementViewLeft(element) {
//   var actualLeft = element.offsetLeft
//   var current = element.offsetParent
//   var elementScrollLeft = 0
//   while (current !== null) {
//     actualLeft += current.offsetLeft
//     current = current.offsetParent
//   }
//   if (document.compatMode === 'BackCompat') {
//     elementScrollLeft = document.body.scrollLeft
//   } else {
//     elementScrollLeft = document.documentElement.scrollLeft
//   }
//   return actualLeft - elementScrollLeft
// }
// function getElementViewTop(element) {
//   var actualTop = element.offsetTop
//   var current = element.offsetParent
//   var elementScrollTop = 0
//   while (current !== null) {
//     actualTop += current.offsetTop
//     current = current.offsetParent
//   }
//   if (document.compatMode === 'BackCompat') {
//     elementScrollTop = document.body.scrollTop
//   } else {
//     elementScrollTop = document.documentElement.scrollTop
//   }
//   return actualTop - elementScrollTop
// }


exports.default = Drager;

/***/ }),

/***/ 16:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _drag = __webpack_require__(14);

var _drag2 = _interopRequireDefault(_drag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var drag = new _drag2.default({
  el: 'dragAble',
  itemClass: 'item',
  dragClass: 'disabled'
});

/***/ })

/******/ });