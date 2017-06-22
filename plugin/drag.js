/**
 * Created by zhangchuanliang on 2017/6/12.
 */
Element.prototype.hasParent = function (node) {
  if(typeof node !== 'string'){
    return node
  }
  // let _attr = '';
  // if(node[0] === '#'){
  //   _attr = 'id'
  // }else if(node[0] === '.'){
  //   _attr = 'className'
  // }else{
  //   _attr = 'tagName'
  // }
  function parents (element) {
    return (element.parentElement && element.parentElement['id'] === node)
  }
  if (!parents (this)) {
    parents(this.parentElement)
  }else{
    return true
  }
}
export default class Drager {
  constructor(config) {
    Object.assign(this, config);
    // console.log(this)
    this.$el = document.getElementById(this.id);
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

    document.addEventListener("dragstart", ( event ) => {
      this.eleDrag = event.target;
    }, false);

    document.addEventListener("dragend", ( event ) => {
      this.eleDrag.classList.remove(this.dragClass);
    }, false);

    /* 鼠标移到drop元素上 */
    document.addEventListener("dragover", ( event ) => {
      event.preventDefault();
    }, false);

    document.addEventListener("dragenter", ( event ) => {

    }, false);

    document.addEventListener("dragleave", ( event ) => {

    }, false);

    document.addEventListener("drop", ( event ) => {
      /**
       * 1. 判断是否在this.id内
       * 2. 是否在itemClass上
       *    - 是：insertAdjacentHTML('beforebegin'|'afterend', html)
       *    - 否：根据鼠标所在this.id的位置，判断是prepend or append
       */
      event.preventDefault();
      // 如果元素是同一个，则不进行任何操作
      if(this.eleDrag.isEqualNode(event.target))return;
      // move dragged elem to the selected drop target
      if ( event.target.className === this.itemClass && event.target.hasParent(this.id)) {
        let directive = 'afterend';
        if(this.eleDrag.offsetTop > event.target.offsetTop){
          directive = 'beforebegin'
        }
        this.removeEleDrag();
        event.target.insertAdjacentHTML(directive, this.eleDrag.outerHTML);
      }else if(event.target.id === this.id){
        // console.log(event.offsetY)
        let filterEls = $items.filter((el, i) => {
          return el.offsetTop >= event.offsetY
        })

        if(filterEls.length === 1 && this.eleDrag.isEqualNode(filterEls[0]))return

        this.removeEleDrag();

        if(filterEls.length > 0){
          filterEls[0].insertAdjacentHTML('beforebegin', this.eleDrag.outerHTML)
        }else if(filterEls.length === 0){
          this.$el.appendChild(this.eleDrag)
        }
      } else {
        this.eleDrag.classList.remove(this.dragClass);
      }
      $items = this.getItems();
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