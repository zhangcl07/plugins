;(function ($) {
    $.fn.marqueeZoom = function(options) {
        return this.each(function() {
            // Extend the options
            var o = $.extend({}, $.fn.marqueeZoom.defaults, options),
                perHeight = o.height/o.perPage, // 每条数据的高度
                contHtml = '<div class="'+o.innerClass+'" style="transform: translateY({{{pos}}}px)">{{{listStr}}}</div>',// 内部列表容器
                mainData = {
                    direction: -1,
                    pos: o.height/2, // 当前scrolltop值
                    listStr: '' // 列表字符串
                },
                innerHtmlHeight = 0,
                timer = NaN, // 全局setInterval的timer
                $this = $(this), // 当前区域元素
                currentIndex = 0;

            var methods = {
                init: function () {
                    // 渲染数据列表
                    $this.html(this.render())
                    // 将模板写入容器
                    this.setPos();
                    // 获取列表元素
                    // $lists = $('.'+o.innerClass).children();
                    // console.log($lists)
                    // methods.getCurrent();
                    innerHtmlHeight = $('.'+o.innerClass).height();
                },
                /**
                 * 根据当前index 确定当前文案的长度，计算出需要停留的时间
                 */
                textDuration: function (index) {
                    return o.duration * o.data[index]['content'].length;
                },
                /**
                 * 设置描述符
                 * params: val: 当前key的值, fn: setter后的执行函数
                 */
                propFn: function (val,fn) {
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
                },
                /**
                 * 针对高版本浏览器做definProperty设置，方便渲染
                 * params: obj: 目标对象, key: 添加的key, val: key的值, fn: setter后的操作
                 */
                def: function (obj, key, val, fn) {
                    Object.defineProperty(obj, key, this.propFn(val,fn))
                },
                /**
                 * 自定义模板key值替换
                 * params: template: 模板, obj: 数据, loc: 正则范围
                 * return: 替换后的模板
                 */
                tempReplace: function (template, obj, loc) {
                    var _loc = (loc == 'i' || loc == 'g') ? loc : 'g',
                        _temp = template;
                    for (var _key in obj) {
                        var _ex = new RegExp('{{{' + _key + '}}}', _loc);
                        _temp = _temp.replace(_ex, obj[_key])
                    }
                    return _temp;
                },
                /**
                 * 设置
                 */
                setPos: function () {
                    var self = this;
                    // 支持Object.defineProperty的浏览器
                    if(typeof Object.defineProperty === 'function'){
                        this.def(mainData, 'pos', o.height/2, function(val){
                            $this.html(self.render())
                        })
                    } else {
                        // todo 兼容低版本浏览器
                        console.log(typeof Object.defineProperty)
                    }
                    
                },
                render: function(){
                    mainData.listStr = this.renderList();
                    return this.tempReplace(contHtml, mainData)
                },
                /**
                 * 生成列表
                 */
                renderList: function () {
                    var self = this,
                        listDom = '';
                        o.data.length = 5
                    if(o.data && o.data.length>0){
                        o.data.forEach(function(c, i) {
                            // console.log(i, _index)
                            if(i === currentIndex){
                                c.isCurrent = o.currentClass
                            }else{
                                c.isCurrent = ''
                            }
                            listDom += self.tempReplace(o.repeatHtml, c)
                        });
                    }
                    return listDom
                },
                toScroll: function (e) {
                    // clearTimeout(timer);
                    // timer = setTimeout(methods.getCurrent, 100);
                    /**
                     * 1. 设置滚动基数
                     * 2. 每滚动根据delta在基数上相加
                     */
                    // 判断浏览器是否支持e.wheelDelta，火狐下鼠标滚轮获得的event.detail值的正负和其他浏览器是相反的。所以，在event.detail前加负号
                    var __delta = e.originalEvent.wheelDelta 
                                    ? e.originalEvent.wheelDelta/*非火狐*/ 
                                    : -e.originalEvent.detail;/*火狐*/
                    // if(mainData.pos < 0 && (innerHtmlHeight - Math.abs(mainData.pos) <= o.height/2)){
                    //     if(mainData.direction === __delta)return;
                    //     mainData.pos = o.height - innerHtmlHeight;
                    // }
                    // if(mainData.pos > 0 && (mainData.pos > o.height)){
                    //     if(mainData.direction === __delta)return;
                    //     mainData.pos = o.height;
                    // }
                    if( (Math.abs(mainData.pos-perHeight)>=(o.data.length-1)*perHeight || (mainData.pos+perHeight) >= o.height) && ( (mainData.direction>0 && __delta>0) || (mainData.direction<0 && __delta<0)) ) return;
                    mainData.direction = __delta;
                    // 根据鼠标滚动方向 设置transformY的值
                    if (__delta < 0) {
                        currentIndex++
                        mainData.pos -= o.gap;
                    } else {
                        currentIndex--
                        mainData.pos += o.gap;
                    }

                    clearTimeout(timer);
                    timer = setTimeout(this.getCurrent, 1);
                },
                // transform: function (index, prevIndex) {
                //     o.data[index]['isCurrent'] = o.currentClass;
                //     if(o.data[prevIndex]){
                //         o.data[prevIndex]['isCurrent'] = '';
                //     }
                //     prevIndex = index;
                //     // this.render()
                // },
                getCurrent: function (e) {
                    // 处于 展示区域在1/4到3/4之间 的所有元素的第一个
                    // currentIndex = Math.ceil( (Math.abs(mainData.pos) + o.height/2) / perHeight ); // 向上取整 减去paddingTop所占的n个位置
                    // console.log(currentIndex)
                    methods.render() // 传参为当前索引和前一个索引
                    // clearTimeout(timer)
                    // console.log(currindex)
                    // timer = setTimeout(this.toScroll, this.textDuration(currentIndex))
                }
            };

            // 初始化
            methods.init();

            // 鼠标滚动事件
            $this.on('mousewheel DOMMouseScroll', function(e) {
                methods.toScroll(e)
            })
            .on('mouseover', function(e){
                clearTimeout(timer)
            })
            .on('mouseleave', function(e){
                /**
                 * 根据当前滚动后的位置，判断current的dl是否在正确的位置，即能够整除(一条数据高度)，
                 * 如果不能，则向上取整除(一条数据高度)值赋给$this的scrollTop，使其处于正确的位置
                 */
                var scrollTop = mainData.pos,
                    perHeight = o.height/o.perPage;
                // console.log(scrollTop)
                if(scrollTop % perHeight !== 0){
                    scrollTop = Math.ceil(scrollTop/perHeight)*perHeight;
                    mainData.pos = scrollTop;
                }else if(scrollTop === perHeight){
                    mainData.pos = perHeight;
                }
            })
        })
    };
    $.fn.marqueeZoom.defaults = {
        id: 'marqueeZoom', // 容器ID
        data: [], // 列表数据
        height: 300, // 容器高度
        perPage: 2, // 每屏显示多少条数据
        // direction: 'top', // 滚动方向
        duration: 100, // 单字阅读时间ms，根据字数判断每条切换到下一条的时间
        gap: 150, // 滚动一次累加到translateY的值 px
        innerClass: 'marquee-inner', // 列表容器的classname
        currentClass: 'current', // 单个列表激活样式
        /**
         * 列表模板
         * params: type: 类型，image: 用户头像，name: 用户名，content: 用户发表的文案
         */
        repeatHtml: '\
        <dl data-type="{{{type}}}" class="{{{isCurrent}}}">\
            <dt><img class="img" src="{{{image}}}" width="118" height="118" alt="" /></dt>\
            <dd>\
                <div class="user_info"><strong>{{{name}}}</strong></div>\
                <blockquote class="arrow-box">{{{content}}}</blockquote>\
            </dd>\
        </dl>'
    }
})(jQuery);