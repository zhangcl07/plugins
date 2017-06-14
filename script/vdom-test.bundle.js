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
/******/ 	return __webpack_require__(__webpack_require__.s = 40);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(2)

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = "2"


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(2)

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = __webpack_require__(39);

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(8)
var isHook = __webpack_require__(4)

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(7)

var applyProperties = __webpack_require__(9)

var isVNode = __webpack_require__(1)
var isVText = __webpack_require__(5)
var isWidget = __webpack_require__(0)
var handleThunk = __webpack_require__(11)

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var isVNode = __webpack_require__(1)
var isVText = __webpack_require__(5)
var isWidget = __webpack_require__(0)
var isThunk = __webpack_require__(3)

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(2)

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"


/***/ }),
/* 13 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 14 */
/***/ (function(module, exports) {



/***/ }),
/* 15 */
/***/ (function(module, exports) {

sddfdgsfdg

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__marquee_zoom__ = __webpack_require__(38);


function callback (data) {
    return data.list
}
var data = callback({"result":"200","list":[{"type":0,"content":"今天给大家安利的是《非人哉》这部漫画","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"},{"type":0,"content":"本书讲述的是建国后与时俱进的欢脱妖怪们的日常","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"},{"type":0,"content":"无论是上古妖怪，还是两百年而已的九尾狐，作者都对其有着脑洞大开的解读","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"},{"type":0,"content":"非人哉简而言之就是不是人，下面有请不是人剧组的各位主演自我介绍一下吧","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"},{"type":0,"content":"我是九月，一只九尾狐，我化人形时，先长出的是手。嗯，当然是为了玩手机喽！","name":"九月","image":"http:\/\/img.yuxip.com\/81459331-e309-4ebd-85e1-b08d2355235c.png"},{"type":0,"content":"大家好，我是烈烈，西海龙王三太子，不是被抽龙筋的那只，是被唐僧骑了十几年的那只哦","name":"敖烈","image":"http:\/\/img.yuxip.com\/d48c96a2-ef25-4c32-91a6-d3904307eced.png"},{"type":0,"content":"【唱】是他，是他，就是他，我们的英雄……接!!!","name":"哪吒","image":"http:\/\/img.yuxip.com\/77bb1def-0329-4211-b389-e088bfcc690d.png"},{"type":0,"content":"小哪吒！我就是他的监护人观音，头上光圈自带各种buff。哎，你们想听大悲咒吗？","name":"观音","image":"http:\/\/img.yuxip.com\/0e0580cb-c6fc-4d8f-a089-9991116aa9d7.png"},{"type":0,"content":"小神乃二郎显圣真君，别问小神为啥有三叉戟和三只眼却不叫三郎神，我乐意二不成？","name":"杨戬","image":"http:\/\/img.yuxip.com\/dd87da9d-608e-40b2-9c64-a71a487bd7d8.png"},{"type":0,"content":"我叫哮天，现住在观音家天天看人秀恩爱，求大家行行好，买本《非人哉》给我凑点狗粮钱吧！","name":"哮天","image":"http:\/\/img.yuxip.com\/e9eb1ff7-f34a-4e31-b5a6-69c6d8feb2d1.png"},{"type":0,"content":"我是人称玉总的玉总，顺便提个事，我才是第一个登上月球的","name":"小玉","image":"http:\/\/img.yuxip.com\/c345b461-7dc2-40f5-a678-4b9ac72365f3.png"},{"type":0,"content":"大家好，我是精卫，我再次强调，那个往玻璃瓶里丢石子的不是我，我都是往大海里丢的！","name":"精卫","image":"http:\/\/img.yuxip.com\/8d7abe5f-c753-4c71-a41f-ff559672247f.png"},{"type":0,"content":"我的头呢？我的头去哪里了？哦哦哦，我忘了我没有头","name":"刑天","image":"http:\/\/img.yuxip.com\/eefbb407-3b33-4aab-a4a5-e836501d0bc1.png"},{"type":0,"content":"请看我真诚的眼睛【眼睛在胸前两点的位置闪闪发光】，我是刑天，我为自己带盐","name":"刑天","image":"http:\/\/img.yuxip.com\/eefbb407-3b33-4aab-a4a5-e836501d0bc1.png"},{"type":0,"content":"各位还真的是各有各的特色啊！下面朋友成仇第二题来了","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"},{"type":0,"content":"俗话说狗眼里面出西施，互爆一下黑料啊","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"},{"type":0,"content":"敖烈有一次给了我一大堆海产，后来我才知道那是他打喷嚏时从嘴里喷出来的","name":"九月","image":"http:\/\/img.yuxip.com\/81459331-e309-4ebd-85e1-b08d2355235c.png"},{"type":0,"content":"小月，你这样显得我很恶心哎。哪吒是一个……【小心打量】哪吒有一次在学校里尿了裤子","name":"敖烈","image":"http:\/\/img.yuxip.com\/d48c96a2-ef25-4c32-91a6-d3904307eced.png"},{"type":0,"content":"【拿出一条龙筋】烈烈，敖丙说他想你了","name":"哪吒","image":"http:\/\/img.yuxip.com\/77bb1def-0329-4211-b389-e088bfcc690d.png"},{"type":0,"content":"【吓得蹦起】你说你说，我不插嘴","name":"敖烈","image":"http:\/\/img.yuxip.com\/d48c96a2-ef25-4c32-91a6-d3904307eced.png"},{"type":0,"content":"我要爆观音，他特别啰嗦","name":"哪吒","image":"http:\/\/img.yuxip.com\/77bb1def-0329-4211-b389-e088bfcc690d.png"},{"type":0,"content":"【充满了慈爱的光辉】小孩子不懂事，大家见笑了。哮天和杨戬很像，经常会往姑娘的裙底看","name":"观音","image":"http:\/\/img.yuxip.com\/0e0580cb-c6fc-4d8f-a089-9991116aa9d7.png"},{"type":0,"content":"【对着杨戬开心大叫】哥！听到了么，他说我们像！！！小玉小玉你听到了么？这是不是主人像宠物？","name":"哮天","image":"http:\/\/img.yuxip.com\/e9eb1ff7-f34a-4e31-b5a6-69c6d8feb2d1.png"},{"type":0,"content":"炖狗肉要不要放葱花，在线等，挺急的……","name":"杨戬","image":"http:\/\/img.yuxip.com\/dd87da9d-608e-40b2-9c64-a71a487bd7d8.png"},{"type":0,"content":"【抬手给哮天一巴掌】能不能走过去一点，你这个蠢样，像什么话","name":"小玉","image":"http:\/\/img.yuxip.com\/c345b461-7dc2-40f5-a678-4b9ac72365f3.png"},{"type":0,"content":"【恢复温柔内向的样子】精卫会去工地里偷石子，还上了新闻","name":"小玉","image":"http:\/\/img.yuxip.com\/c345b461-7dc2-40f5-a678-4b9ac72365f3.png"},{"type":0,"content":"可是我后来改了，去杨戬家买了","name":"精卫","image":"http:\/\/img.yuxip.com\/8d7abe5f-c753-4c71-a41f-ff559672247f.png"},{"type":0,"content":"【干笑】我们家已经不敢再卖石子了。观音，我可以喷你吗？","name":"杨戬","image":"http:\/\/img.yuxip.com\/dd87da9d-608e-40b2-9c64-a71a487bd7d8.png"},{"type":0,"content":"不好意思，丑拒","name":"观音","image":"http:\/\/img.yuxip.com\/0e0580cb-c6fc-4d8f-a089-9991116aa9d7.png"},{"type":0,"content":"【摊摊手】啧，他就是这样，喜欢跟我耍小脾气","name":"杨戬","image":"http:\/\/img.yuxip.com\/dd87da9d-608e-40b2-9c64-a71a487bd7d8.png"},{"type":0,"content":"【眼刀嗖嗖嗖的】你能不能好好说话？","name":"观音","image":"http:\/\/img.yuxip.com\/0e0580cb-c6fc-4d8f-a089-9991116aa9d7.png"},{"type":0,"content":"【扣扣肚脐眼的位置】能让我说句话么？我也想露露脸，虽然我没有头，但是我是有脸的！我……","name":"刑天","image":"http:\/\/img.yuxip.com\/eefbb407-3b33-4aab-a4a5-e836501d0bc1.png"},{"type":0,"content":"【小声和主持人说】有次一起郊游，我讲无头鬼的鬼故事，刑天第一个被吓哭哦","name":"九月","image":"http:\/\/img.yuxip.com\/81459331-e309-4ebd-85e1-b08d2355235c.png"},{"type":0,"content":"看来你们的黑历史很多啊，节目组拦都拦不住","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"},{"type":0,"content":"下面进入第三题，你们对自己的人设有什么地方要吐槽的吗？","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"},{"type":0,"content":"屁股上长出九条尾巴简直丑爆，从后面看就像菊花绽开一样","name":"九月","image":"http:\/\/img.yuxip.com\/81459331-e309-4ebd-85e1-b08d2355235c.png"},{"type":0,"content":"玉净瓶化作咖啡杯之后，每集出场都喝咖啡，读者们总问我会不会咖啡喝太多，兴奋得睡不着","name":"观音","image":"http:\/\/img.yuxip.com\/0e0580cb-c6fc-4d8f-a089-9991116aa9d7.png"},{"type":0,"content":"我只觉得每次去内衣店买眼罩的时候有一丝丝尴尬","name":"刑天","image":"http:\/\/img.yuxip.com\/eefbb407-3b33-4aab-a4a5-e836501d0bc1.png"},{"type":0,"content":"我的脑袋遇水就开花是什么鬼啊，游泳时都要顶着一大片莲花","name":"哪吒","image":"http:\/\/img.yuxip.com\/77bb1def-0329-4211-b389-e088bfcc690d.png"},{"type":0,"content":"我看到水就想扔石子把它给填满，那我是怎么喝的水呢？","name":"精卫","image":"http:\/\/img.yuxip.com\/8d7abe5f-c753-4c71-a41f-ff559672247f.png"},{"type":0,"content":"漫画中，我的喉咙直通大海，打喷嚏还会喷出海鲜，你们敢想象我上厕所的样子吗？","name":"敖烈","image":"http:\/\/img.yuxip.com\/d48c96a2-ef25-4c32-91a6-d3904307eced.png"},{"type":0,"content":"论第三只眼近视了，怎么戴眼镜","name":"杨戬","image":"http:\/\/img.yuxip.com\/dd87da9d-608e-40b2-9c64-a71a487bd7d8.png"},{"type":0,"content":"下面再说一下，你们有哪些吸引读者的地方呢？","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"},{"type":0,"content":"想看我带着九条尾巴是怎么上厕所的吗？","name":"九月","image":"http:\/\/img.yuxip.com\/81459331-e309-4ebd-85e1-b08d2355235c.png"},{"type":0,"content":"我可以给你们做莲藕汤","name":"哪吒","image":"http:\/\/img.yuxip.com\/77bb1def-0329-4211-b389-e088bfcc690d.png"},{"type":0,"content":"我会花式刻萝卜，刻完送你一个呀","name":"小玉","image":"http:\/\/img.yuxip.com\/c345b461-7dc2-40f5-a678-4b9ac72365f3.png"},{"type":0,"content":"【自带孵蛋技能】还在担心鸡蛋吃不完而坏掉么？把我带回去，还你一窝鸡！","name":"精卫","image":"http:\/\/img.yuxip.com\/8d7abe5f-c753-4c71-a41f-ff559672247f.png"},{"type":0,"content":"今天吃蛋明天吃鸡，想吃哪个吃哪个，So easy！","name":"精卫","image":"http:\/\/img.yuxip.com\/8d7abe5f-c753-4c71-a41f-ff559672247f.png"},{"type":0,"content":"书内有本座亲自开光镇宅符，驱邪保平安","name":"观音","image":"http:\/\/img.yuxip.com\/0e0580cb-c6fc-4d8f-a089-9991116aa9d7.png"},{"type":0,"content":"对了，对了，我给你们表演个高难度的动作【把身子放进敖烈嘴里】","name":"九月","image":"http:\/\/img.yuxip.com\/81459331-e309-4ebd-85e1-b08d2355235c.png"},{"type":0,"content":"哥！我们也玩，我们也玩！！！【张大嘴，示意杨戬】","name":"哮天","image":"http:\/\/img.yuxip.com\/e9eb1ff7-f34a-4e31-b5a6-69c6d8feb2d1.png"},{"type":0,"content":"最近正好没洗澡【脱了衣服准备跳到敖烈嘴里】","name":"哪吒","image":"http:\/\/img.yuxip.com\/77bb1def-0329-4211-b389-e088bfcc690d.png"},{"type":0,"content":"【一把按住哪吒】你一个小孩子家脱什么衣服，这个习惯不好","name":"观音","image":"http:\/\/img.yuxip.com\/0e0580cb-c6fc-4d8f-a089-9991116aa9d7.png"},{"type":0,"content":"【莞尔一笑】你昨天晚上在床上可不是这么说的","name":"杨戬","image":"http:\/\/img.yuxip.com\/dd87da9d-608e-40b2-9c64-a71a487bd7d8.png"},{"type":0,"content":"等等，等等，你们怎么开始卖腐了，还这么大尺度，你们好歹也是有头有脸的人物","name":"刑天","image":"http:\/\/img.yuxip.com\/eefbb407-3b33-4aab-a4a5-e836501d0bc1.png"},{"type":0,"content":"我跟你们说话的时候，嘴边的腹肌都在颤抖","name":"刑天","image":"http:\/\/img.yuxip.com\/eefbb407-3b33-4aab-a4a5-e836501d0bc1.png"},{"type":0,"content":"本期节目就要结束啦，最后让从头到尾都没漏过头的刑天来说结束语吧","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"},{"type":0,"content":"【抖抖腹肌，面向摄影机】想看九月吸霾么？想看敖烈肚子里的海底世界么？想看哪吒一秒变萌妹么？","name":"刑天","image":"http:\/\/img.yuxip.com\/eefbb407-3b33-4aab-a4a5-e836501d0bc1.png"},{"type":0,"content":"想更近一步观看精卫填海，狗兔赛跑，以及观音和二郎神不得不说的故事么？","name":"刑天","image":"http:\/\/img.yuxip.com\/eefbb407-3b33-4aab-a4a5-e836501d0bc1.png"},{"type":0,"content":"那你还在犹豫什么？动动你的手指，点击购买《非人哉》，我们都在这里等你呦！","name":"刑天","image":"http:\/\/img.yuxip.com\/eefbb407-3b33-4aab-a4a5-e836501d0bc1.png"},{"type":0,"content":"这本是京东专供哦，书里还会送神秘小礼物！","name":"刑天","image":"http:\/\/img.yuxip.com\/eefbb407-3b33-4aab-a4a5-e836501d0bc1.png"},{"type":0,"content":"以上就是采访的全部内容，谢谢大家的参与，那么也请大家多多关注《非人哉》，我们下期节目再见！","name":"主持人","image":"http:\/\/img.yuxip.com\/8995baed-591c-408a-a178-77992c34b032.png"}],"info":{"textDuration":"100","image":"http:\/\/img.yuxip.com\/ed9ae0ba-4a4a-494e-b11d-dafbc829f9cf.png","name":"非人哉（京东专供）","mb_image":null}})

var thisMarquee = new __WEBPACK_IMPORTED_MODULE_0__marquee_zoom__["a" /* default */]({
    id: 'marqueeZoom',
    data: data
});
let tree = thisMarquee.init();

document.getElementById("btn").addEventListener('click', () => {
    thisMarquee.o.data[0].content = "dasdfadsfa"
    let newTree = thisMarquee.render(thisMarquee.o.data);
    let patches = diff(tree, newTree);
    rootNode = patch(rootNode, patches);
    tree = newTree;
})

/***/ }),
/* 17 */
/***/ (function(module, exports) {

/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var OneVersionConstraint = __webpack_require__(20);

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Individual = __webpack_require__(19);

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var createElement = __webpack_require__(10)

module.exports = createElement


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var diff = __webpack_require__(36)

module.exports = diff


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var h = __webpack_require__(31)

module.exports = h


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var patch = __webpack_require__(27)

module.exports = patch


/***/ }),
/* 25 */
/***/ (function(module, exports) {

// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var applyProperties = __webpack_require__(9)

var isWidget = __webpack_require__(0)
var VPatch = __webpack_require__(12)

var updateWidget = __webpack_require__(28)

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(7)
var isArray = __webpack_require__(6)

var render = __webpack_require__(10)
var domIndex = __webpack_require__(25)
var patchOp = __webpack_require__(26)
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var isWidget = __webpack_require__(0)

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var EvStore = __webpack_require__(18);

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(6);

var VNode = __webpack_require__(33);
var VText = __webpack_require__(34);
var isVNode = __webpack_require__(1);
var isVText = __webpack_require__(5);
var isWidget = __webpack_require__(0);
var isHook = __webpack_require__(4);
var isVThunk = __webpack_require__(3);

var parseTag = __webpack_require__(32);
var softSetHook = __webpack_require__(30);
var evHook = __webpack_require__(29);

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var split = __webpack_require__(17);

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(2)
var isVNode = __webpack_require__(1)
var isWidget = __webpack_require__(0)
var isThunk = __webpack_require__(3)
var isVHook = __webpack_require__(4)

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var version = __webpack_require__(2)

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(8)
var isHook = __webpack_require__(4)

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(6)

var VPatch = __webpack_require__(12)
var isVNode = __webpack_require__(1)
var isVText = __webpack_require__(5)
var isWidget = __webpack_require__(0)
var isThunk = __webpack_require__(3)
var handleThunk = __webpack_require__(11)

var diffProps = __webpack_require__(35)

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function propFn (val,fn) {
    return {
        get: function(){return val},
        set: function(v){
            if(val === v)return;
            val = v;
            fn && fn(v)
        },
        enumerable: true,
        configurable : true
    }
}

function def (obj, key, val, fn) {
    Object.defineProperty(obj, key, propFn(val,fn))
}

function deepSetter(target, source){
    var self = this;
    // console.log(this);
    for (var key in source) {
        if (isPlainObject(source[key]) || isArray(source[key])) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                target[key] = {};
            if (isArray(source[key]) && !isArray(target[key]))
                target[key] = extend([], ArrayProxy);
            this.deepSetter(target[key], source[key])
        }
        else if (source[key] !== undefined) {
            (function(key){
                var _value = source[key];
                Object.defineProperty(target, key, {
                    enumerable: true,
                    configurable: true,
                    get: function(){
                        return _value
                    },
                    set: function(v){
                        if(v === _value)return;
                        _value = v;
                        // self.init(); todo 性能问题
                    }
                })
            })(key);

        }
    }
    return target
}

/* harmony default export */ __webpack_exports__["a"] = ({ def, deepSetter });

/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_virtual_dom_h__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_virtual_dom_h___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_virtual_dom_h__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_virtual_dom_diff__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_virtual_dom_diff___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_virtual_dom_diff__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_virtual_dom_patch__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_virtual_dom_patch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_virtual_dom_patch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_virtual_dom_create_element__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_virtual_dom_create_element___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_virtual_dom_create_element__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__defineProt__ = __webpack_require__(37);






class MarqueeZoom {
    constructor (config) {
        this.id = config.id || ''
        this.global = {}
        __WEBPACK_IMPORTED_MODULE_4__defineProt__["a" /* default */].def(this, 'pos' ,150 , () => {
            this.init()
        })

        __WEBPACK_IMPORTED_MODULE_4__defineProt__["a" /* default */].def(this, 'data' ,config.data , () => {
            this.init()
        })
    }
    init () {
        let tree = this.render(this.o.data);
        let rootNode = __WEBPACK_IMPORTED_MODULE_3_virtual_dom_create_element___default()(tree);
        document.getElementById(this.o.id).appendChild(rootNode);
        return tree
    }
    render (children) {
        return __WEBPACK_IMPORTED_MODULE_0_virtual_dom_h___default()('div', {
            className: 'marquee-inner',
            style: {
                transform: 'translateY('+this.pos+'px)'
            }
        }, this.renderList(children));
    }
    renderList (data) {
        let list = [];
        data.forEach( (c, i) => {
            let _vdom = __WEBPACK_IMPORTED_MODULE_0_virtual_dom_h___default()('dl', {
                    className: c.isCurrent?'current':''
                }, [
                    __WEBPACK_IMPORTED_MODULE_0_virtual_dom_h___default()('dt',{}, [
                        __WEBPACK_IMPORTED_MODULE_0_virtual_dom_h___default()('img', {
                            className:'img',
                            src: String(c.image),
                            width: 118,
                            height: 118
                            },[])
                    ]),
                    __WEBPACK_IMPORTED_MODULE_0_virtual_dom_h___default()('dd', {}, [
                        __WEBPACK_IMPORTED_MODULE_0_virtual_dom_h___default()('div', {
                            className: 'user_info'
                        },[
                            __WEBPACK_IMPORTED_MODULE_0_virtual_dom_h___default()('strong', {}, [String(c.name)])
                        ]),
                        __WEBPACK_IMPORTED_MODULE_0_virtual_dom_h___default()('blockquote', {
                            className: 'arrow-box'
                        },[String(c.content)])
                    ])
                ])
            list.push(_vdom)
        });
        return list
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MarqueeZoom;




// 3: Wire up the update logic
// setInterval(function () {
//       count++;

//       var newTree = render(count);
//       var patches = diff(tree, newTree);
//       rootNode = patch(rootNode, patches);
//       tree = newTree;
// }, 1000);

/***/ }),
/* 39 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(16);
__webpack_require__(15);
module.exports = __webpack_require__(14);


/***/ })
/******/ ]);