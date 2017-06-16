/**
 * Created by zhangchuanliang on 2017/6/12.
 * - dragstart 获取位置
 * - 设置镜像文件，随鼠标移动，透明度0.5
 *  1. 拖动元素
 *  2. 原元素
 *  3. 占位元素
 * - move 获取鼠标位置，判断在哪个元素上方
 * - 更新数据，重新渲染列表
 * - drop后，执行上一步
 */
import h from 'virtual-dom/h'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import createElement from 'virtual-dom/create-element'
import defineProt from './../script/defineProt'

export default class Drager {
  constructor(config) {
    Object.assign(this, config);
    console.log(this)
    this.$el = document.getElementById(this.el)
    this.position = {
      x: 0,
      y: 0
    }
    defineProt.def(this.position, 'x', 0, v => {
      this.moveMirror()
    })
    defineProt.def(this.position, 'y', 0, v => {
      this.moveMirror()
    })

    this.init()
  }
  init() {
    let self = this
    let $items = $("#"+this.el).find("."+this.itemClass),
        eleDrag = null
    $items.attr("draggable", true)
    $items.each(function(i, el){
      el.onselectstart = function() {
          return false;
      };
      el.ondragstart = function(ev){
        ev.dataTransfer.effectAllowed = "move";
        ev.dataTransfer.setData("text", ev.target.innerHTML);
        // ev.dataTransfer.setDragImage(ev.target, 0, 0);
        eleDrag = ev.target;
        return true;
      }
    })
    // this.el.ondropstart =  function(e) {
      
    //   // todo 计算当前位置
    // }
    // $(document)
    //   .on('mousemove', e => {
    //     this.position.x = e.pageX
    //     this.position.y = e.pageY
    //     // todo 拖动时 根据e.target确定要插入的位置
    //     console.log(getElementViewTop(e.target))
    //   })
    //   .on('mouseup', () => {
    //     $('#dragAble').find('div.disabled').removeClass('disabled')
    //     $('.mirror').remove()
    //     // 更改数据 重绘列表
    //   })
  }
  moveMirror() {
    $('.mirror').css({
      top: this.position.y + 'px',
      left: this.position.x + 'px'
    })
  }
  /** todo
   * 根据e.pageXY计算当前拖动元素的真实位置
   * @param {*} obj {x,y}
   */
  calcPosition (obj) {
    self.position.x = getElementViewLeft($this[0])+'px'
    self.position.y = getElementViewTop($this[0])+'px'
  }
}
function getElementViewLeft(element) {
  var actualLeft = element.offsetLeft
  var current = element.offsetParent
  var elementScrollLeft = 0
  while (current !== null) {
    actualLeft += current.offsetLeft
    current = current.offsetParent
  }
  if (document.compatMode === 'BackCompat') {
    elementScrollLeft = document.body.scrollLeft
  } else {
    elementScrollLeft = document.documentElement.scrollLeft
  }
  return actualLeft - elementScrollLeft
}
function getElementViewTop(element) {
  var actualTop = element.offsetTop
  var current = element.offsetParent
  var elementScrollTop = 0
  while (current !== null) {
    actualTop += current.offsetTop
    current = current.offsetParent
  }
  if (document.compatMode === 'BackCompat') {
    elementScrollTop = document.body.scrollTop
  } else {
    elementScrollTop = document.documentElement.scrollTop
  }
  return actualTop - elementScrollTop
}