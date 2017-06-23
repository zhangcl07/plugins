/**
 * Created by zhangchuanliang on 2017/6/12.
 * ES5+
 */

/**
 * 查找是否存在符合条件的父元素
 * params: node为元素id
 */
Element.prototype.hasParent = function(node) {
  if (typeof node !== 'string')return
  let num = 0
  function Parents(element) {
    if(element.parentElement && element.parentElement['id'] === node){
      num++
    }else{
      try {
        Parents(element.parentElement)
      } catch (error) {}
    }
  }
  Parents(this)

  return function(){
    return num
  }

}

export default class Drager {
  constructor(config) {
    Object.assign(this, config);
    // console.log(this)
    this.$el = document.getElementById(this.id)
    this.items = this.getItems()
    this.eleDrag = null
    this.init()
    this.bindEvent()
  }
  init() {
    // 添加draggable属性
    this.items.forEach((el, i) => {
      el.setAttribute('draggable', 'true')
    })
  }
  getItems() {
    return [].map.call(this.$el.children, (c, i) => c)
  }
  // 删除drag元素的disabled样式
  removeEleDrag() {
    this.eleDrag.classList.remove(this.dragClass)
    this.eleDrag.parentNode.removeChild(this.eleDrag)
  }
  // 绑定事件
  bindEvent() {
    let self = this
    // let $items = this.getItems();
    /* events fired on the draggable target */
    document.addEventListener(
      'drag',
      event => {
        event.target.classList.add(this.dragClass)
      },
      false
    )

    document.addEventListener(
      'dragstart',
      event => {
        self.eleDrag = event.target
      },
      false
    )

    // document.addEventListener("dragend", ( event ) => {}, false);

    /* 鼠标移到drop元素上 */
    document.addEventListener(
      'dragover',
      event => {
        event.preventDefault()
      },
      false
    )

    // document.addEventListener("dragenter", ( event ) => {}, false);

    // document.addEventListener("dragleave", ( event ) => {}, false);

    document.addEventListener(
      'drop',
      event => {
        this.dropHandler(event)
      },
      false
    )
  }
  /**
   * 1. 判断拖动元素是否和drop的元素为同一个元素
   * 2. 判断是否在this.id内
   * 3. 是否在itemClass上
   *    - 是：insertAdjacentHTML('beforebegin'|'afterend', html)
   *    - 否：根据鼠标所在this.id的位置，判断是prepend or append
   */
  dropHandler(event) {
    event.preventDefault()
    // 如果元素是同一个，则不进行任何操作
    if (this.eleDrag.isEqualNode(event.target)) return
    // 如果drop时target为this.itemClass，并且父元素有this.id
    if (
      event.target.className === this.itemClass &&
      event.target.hasParent(this.id)()
    ) {
      this.insertHTML(event)
    } else if (event.target.id === this.id) {
      // 如果drop为父元素
      this.dropInParent(event)
    } else {
      // 其他不符合拖拽条件的 删除拖拽元素的样式变化
      this.eleDrag.classList.remove(this.dragClass)
    }
    // 重新获取items
    this.items = this.getItems()
  }

  insertHTML(event) {
    let directive = 'afterend' // 默认插入位置为元素后面
    // 如果drag元素在drop元素之前（文档流）
    if (this.eleDrag.offsetTop > event.target.offsetTop) {
      directive = 'beforebegin'
    }
    this.removeEleDrag()
    event.target.insertAdjacentHTML(directive, this.eleDrag.outerHTML)
  }

  dropInParent(event) {
    // 过滤元素的offsettop 大于 event.offsetY, 取符合条件的第一个元素
    let filterEls = this.items.filter((el, i) => {
      return el.offsetTop >= event.offsetY
    })
    // 如果之后一个符合条件的元素并且比元素就是drag元素，不做任何处理
    if (filterEls.length === 1 && this.eleDrag.isEqualNode(filterEls[0])) return

    this.removeEleDrag()
    // 符合条件有多个元素，在第一个元素前插入
    if (filterEls.length > 0) {
      filterEls[0].insertAdjacentHTML('beforebegin', this.eleDrag.outerHTML)
    } else if (filterEls.length === 0) {
      // 当只没有符合元素时，在父级append drag元素
      this.$el.appendChild(this.eleDrag)
    }
  }
}
