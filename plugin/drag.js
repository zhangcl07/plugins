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

        this.init();
    }
    init () {
        $("#dragAble")
            .on("mousedown", "li", function(){
                let $this = $(this);
                $this.addClass("disabled");
                $this.clone().removeClass("disabled").addClass("current").appendTo($this.parent());
            })
        $(document)
            .on("mousemove", (e) => {
                this.position.x = e.pageX
                this.position.y = e.pageY
                // 拖动时 根据e.target确定要插入的位置
                console.log(getElementViewTop(e.target))
            })
            .on("mouseup", () => {
                $("#dragAble").find("li.current").removeClass("current")
            })
    }
    moveMirror () {
        $("#dragAble").find("li.current").css({
            position: "absolute",
            top: this.position.y+"px",
            left: this.position.x+"px"
        })
    }

}
    function getElementViewLeft(element){
　　　　var actualLeft = element.offsetLeft;
　　　　var current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
　　　　}
　　　　if (document.compatMode == "BackCompat"){
　　　　　　var elementScrollLeft=document.body.scrollLeft;
　　　　} else {
　　　　　　var elementScrollLeft=document.documentElement.scrollLeft; 
　　　　}
　　　　return actualLeft-elementScrollLeft;
    }
    function getElementViewTop(element){
　　　　var actualTop = element.offsetTop;
　　　　var current = element.offsetParent;
　　　　while (current !== null){
　　　　　　actualTop += current. offsetTop;
　　　　　　current = current.offsetParent;
　　　　}
　　　　 if (document.compatMode == "BackCompat"){
　　　　　　var elementScrollTop=document.body.scrollTop;
　　　　} else {
　　　　　　var elementScrollTop=document.documentElement.scrollTop; 
　　　　}
　　　　return actualTop-elementScrollTop;
　　}