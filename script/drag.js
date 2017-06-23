import Drager from './../plugin/drag'

let drag = new Drager({
  id       : 'dragAble',
  itemClass: 'item',
  dragClass: 'disabled'
})

console.log(document.getElementById('dragItem').hasParent('dragAble')())