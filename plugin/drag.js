/**
 * Created by zhangchuanliang on 2017/6/12.
 * - dragstart 获取位置
 * - 设置镜像文件，随鼠标移动，透明度0.5
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
    constructor (config) {
        this.position = {
            x: 0,
            y: 0
        }
        defineProt.def(this.position, 'x', 0, (v) => {
            this.moveMirror ()
        });
        defineProt.def(this.position, 'y', 0, (v) => {
            this.moveMirror ()
        });
    }

    moveMirror () {
        
    }

}