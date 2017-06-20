/**
 * Created by zhangchuanliang on 2017/6/12.
 */

export default class Drager {
  constructor(config) {
    Object.assign(this, config);
    // console.log(this)
    this.$el = document.getElementById(this.el);
    this.items = this.getItems();
    this.eleDrag = null;
    this.init()
    this.bindEvent()
  }
  init() {
    // 添加draggable属性
    this.items.forEach((el, i) => {
      el.setAttribute("draggable", "true");
    })
  }
  getItems () {
    return [].map.call(this.$el.children, (c, i) => c);
  }
  // 删除drag元素的disabled样式
  removeEleDrag () {
    this.eleDrag.classList.remove(this.dragClass)
    this.eleDrag.parentNode.removeChild( this.eleDrag );
  }
  // 绑定事件
  bindEvent () {
    let self = this;
    let $items = this.getItems();
    /* events fired on the draggable target */
    document.addEventListener("drag", ( event ) => {
      event.target.classList.add(this.dragClass)
    }, false);

    document.addEventListener("dragstart", function( event ) {
      self.eleDrag = event.target;
    }, false);

    document.addEventListener("dragend", function( event ) {

    }, false);

    /* 鼠标移到drop元素上 */
    document.addEventListener("dragover", function( event ) {
      event.preventDefault();
    }, false);

    document.addEventListener("dragenter", function( event ) {

    }, false);

    document.addEventListener("dragleave", function( event ) {

    }, false);

    document.addEventListener("drop", function( event ) {
      /**
       * 1. 判断是否在this.el内
       * 2. 是否在itemClass上
       *    - 是：insertAdjacentHTML('beforebegin'|'afterend', html)
       *    - 否：根据鼠标所在this.el的位置，判断是prepend or append
       */
      event.preventDefault();
      // 如果元素是同一个，则不进行任何操作
      if(self.eleDrag.isEqualNode(event.target))return;
      // move dragged elem to the selected drop target
      if ( event.target.className === self.itemClass && $(event.target).parents(this.el).length>0) {
        let directive = 'afterend';
        if(self.eleDrag.offsetTop > event.target.offsetTop){
          directive = 'beforebegin'
        }
        self.removeEleDrag();
        event.target.insertAdjacentHTML(directive, self.eleDrag.outerHTML);
      }else if(event.target.id === self.el){
        // console.log(event.offsetY)
        let filterEls = $items.filter((el, i) => {
          return el.offsetTop >= event.offsetY
        })

        self.removeEleDrag();

        if(filterEls.length > 0){
          filterEls[0].insertAdjacentHTML('beforebegin', self.eleDrag.outerHTML);
        }else if(filterEls.length === 0){
          self.$el.appendChild(self.eleDrag)
        }
      }
      $items = self.getItems();
    }, false);
  }
}
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