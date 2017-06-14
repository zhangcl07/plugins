/**
 * 滚动变形组件，用于图书语戏模块
 * author: zhangchuanliang
 * Version: 1.0.0
 * Requires: jQuery V1.6.x
 * 1. getCurrent
 * 2. 计算持续时间 - 滚动
 * 3. 滚动- clear getCurrent
 * 4. 滚动end之后 - 执行getCurrent
 * 5. getCurrent - 计算持续时间
 * 6. 滚动
 */
;(function ($) {
    $.fn.scrollZoom = function(options) {
        return this.each(function() {
            // Extend the options
            var o = $.extend({}, $.fn.scrollZoom.defaults, options),
                perHeight = o.height/o.perPage, // 没跳数据的告诉
                prevIndex = NaN, // 上一个选中元素
                contHtml = '<div class="'+o.innerClass+'" style="padding-top:{{{paddingTop}}}px">{{{listStr}}}</div>',// 内部列表容器
                mainData = {
                    pos: 0, // 当前scrolltop值
                    listStr: '', // 列表字符串
                    paddingTop: o.height - perHeight// 默认显示一条数据
                },
                timer = NaN, // 全局setInterval的timer
                $this = $(this), // 当前区域元素
                $lists = null; // 当前所有列表元素

            var methods = {
                init: function () {
                    // 渲染数据列表
                    mainData.listStr = this.renderList();
                    // 将模板写入容器
                    $this.html(this.tempReplace(contHtml, mainData));
                    $lists = $('.'+o.innerClass).children();
                    // console.log($lists)
                    methods.getCurrent();
                    //timer = setTimeout(methods.scrolling, this.textDuration(0));
                },
                /**
                 * 根据当前index 确定当前文案的长度，计算出需要停留的时间
                 */
                textDuration: function (index) {
                    return o.duration * o.data[index]['content'].length;
                },
                /**
                 * 判断浏览器版本
                 * params: ver: 检测的版本, c: 可选，gt和lt
                 */
                browserVersionCheck: function (ver, c) {
                    var browser = {};
                    return function () {
                        var key = ver ?  ( c ? "is"+c+"IE"+ver : "isIE"+ver ) : "isIE";	
                        var v = browser[key];
                        if( typeof(v)  != "undefined"){
                            return v;
                        }
                        if( !ver){
                            v = (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) ;
                        }else {
                            var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:|Edge\/)(\d+)/);
                            if(match){
                                var v1 = parseInt(match[1]) ;
                                v = c ?  ( c == 'lt' ?  v1 < ver  :  ( c == 'gt' ?  v1 >  ver : undefined ) ) : v1== ver ;
                            }else	if(ver <= 9){
                                var b = document.createElement('b')
                                var s = '<!--[if '+(c ? c : '')+' IE '  + ver + ']><i></i><![endif]-->';
                                b.innerHTML =  s;
                                v =  b.getElementsByTagName('i').length === 1;
                            }else{
                                v=undefined;
                            }
                        }
                        browser[key] =v;
                        return v;
                    }
                },
                /**
                 * 自定义模板key值替换
                 * params: template: 模板, obj: 数据, loc: 正则范围
                 * return: 替换后的模板
                 */
                tempReplace: function (template, obj, loc) {
                    var _loc = (loc === 'i' || loc === 'g') ? loc : 'g',
                        _temp = template;
                    for (var _key in obj) {
                        var _ex = new RegExp('{{{' + _key + '}}}', _loc);
                        _temp = _temp.replace(_ex, obj[_key])
                    }
                    return _temp;
                },
                /**
                 * 兼容IE8及以下浏览器的class方案
                 * IE8及以下浏览器会自动加载兼容样式，classname=lteIE8
                 * 自己针对自己的兼容方案写样式
                 */
                ietest: function () {
                    var _className = '';
                    if( o.supportIE8 && (this.browserVersionCheck(8)() || this.browserVersionCheck(8,'lt')()) ){
                        _className = 'lteIE8'
                    }
                    return _className
                },
                /**
                 * 生成列表
                 */
                renderList: function () {
                    var self = this,
                        listDom = '',
                        ietest = this.ietest();
                    if(o.data && o.data.length>0){
                        for (var i=0,len=o.data.length; i<len; i++) {
                            o.data[i]['ietest'] = ietest;
                            listDom += this.tempReplace(o.repeatHtml, o.data[i])
                        }
                    }else{
                        listDom = '暂无数据';
                    }
                    return listDom
                },
                /**
                 * 滚动条滚动触发
                 */
                scrolling: function () {
                    var scrollTop = $this.scrollTop(),
                        scrollH = $this[0].scrollHeight,
                        self = this;
                    // console.log(scrollTop, scrollH)
                    // 判断scrollTop值 大于等于inner容器的高度时，停止自动滚动
                    if( scrollTop >= (scrollH - perHeight)) {
                        clearTimeout(timer)
                    };
                    $this.animate({scrollTop: scrollTop + o.speed}, 'slow');
                    // $this.scrollTop($this.scrollTop() + o.speed);
                },
                /**
                 * zoom函数
                 * params: index: 当前选中元素index, pIndex: 前一个选中元素index
                 */
                transform: function (index, pIndex) {
                    var $el = $lists.eq(index),
                        $prev = $lists.eq(pIndex);
                    $prev.removeClass(o.currentClass);
                    $el.addClass(o.currentClass);
                    // console.log(index)
                    prevIndex = index;
                },
                getCurrent: function () { // 处于 展示区域在1/4到3/4之间 的所有元素的第一个
                    var currindex = Math.ceil( ($this.scrollTop() + mainData.paddingTop-perHeight/2) / perHeight )-(o.perPage-1); // 向上取整 减去paddingTop所占的n个位置
                    methods.transform(currindex, prevIndex) // 传参为当前索引和前一个索引
                    // clearTimeout(timer)
                    timer = setTimeout(methods.scrolling, methods.textDuration(currindex))
                },
                 /**
                 * 节流函数
                 * params: fn, delay
                 */
                throttle: function (fn, delay) {
                    var _timer = null;
                    return function(){
                        var context = this, args = arguments;
                        clearTimeout(_timer);
                        _timer = setTimeout(function(){
                            fn.apply(context, args);
                        }, delay);
                    };
                }
            };

            // 初始化
            methods.init();

            // 滚动事件
            $this.bind('scroll', function (e) {
                // throttle
                clearTimeout(timer);
                timer = setTimeout(methods.getCurrent, 1)
                // methods.throttle(methods.getCurrent, 1)();
            })
            .bind('mouseover', function () {
                clearTimeout(timer)
            })
            .bind('mouseleave', function () {
                /**
                 * 根据当前滚动后的位置，判断current的dl是否在正确的位置，即能够整除(一条数据高度)，
                 * 如果不能，则向上取整除(一条数据高度)值赋给$this的scrollTop，使其处于正确的位置
                 */
                var scrollTop = $this.scrollTop(),
                    perHeight = o.height/o.perPage;
                // console.log(scrollTop)
                if(scrollTop % perHeight !== 0){
                    scrollTop = Math.ceil(scrollTop/perHeight)*perHeight
                    $this.animate({scrollTop: scrollTop}, 'slow');
                }else if(scrollTop === 0){
                    $this.animate({scrollTop: perHeight}, 'slow');
                }
                // 重新开始自动滚动
                // methods.scrolling()
            })

        })
    };
    $.fn.scrollZoom.defaults = {
        id: 'scrollZoom', // 容器ID
        data: [], // 列表数据
        height: 300, // 容器高度
        perPage: 2, // 每屏显示多少条数据
        // direction: 'top', // 滚动方向
        duration: 100, // 单字阅读时间，根据字数判断每条切换到下一条的时间
        speed: 150, // 滚动一次累加到scrollTop的值
        supportIE8: true, // 是否支持IE8，默认支持
        innerClass: 'marquee-inner', // 列表容器的classname
        currentClass: 'current', // 单个列表激活样式
        /**
         * 列表模板
         * params: type: 类型，image: 用户头像，name: 用户名，content: 用户发表的文案
         */
        repeatHtml: '\
        <dl data-type="{{{type}}}" class="{{{ietest}}}">\
            <dt><img class="img" src="{{{image}}}" width="118" height="118" alt="" /></dt>\
            <dd>\
                <div class="user_info"><strong>{{{name}}}</strong></div>\
                <blockquote class="arrow-box">{{{content}}}</blockquote>\
            </dd>\
        </dl>'
    }
})(window.jQuery);