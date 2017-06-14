import h from 'virtual-dom/h'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import createElement from 'virtual-dom/create-element'
import defineProt from './defineProt'

export default class MarqueeZoom {
    constructor (config) {
        this.id = config.id || ''
        this.global = {}
        defineProt.def(this, 'pos' ,150 , () => {
            this.init()
        })

        defineProt.def(this, 'data' ,config.data , () => {
            this.init()
        })
    }
    init () {
        let tree = this.render(this.o.data);
        let rootNode = createElement(tree);
        document.getElementById(this.o.id).appendChild(rootNode);
        return tree
    }
    render (children) {
        return h('div', {
            className: 'marquee-inner',
            style: {
                transform: 'translateY('+this.pos+'px)'
            }
        }, this.renderList(children));
    }
    renderList (data) {
        let list = [];
        data.forEach( (c, i) => {
            let _vdom = h('dl', {
                    className: c.isCurrent?'current':''
                }, [
                    h('dt',{}, [
                        h('img', {
                            className:'img',
                            src: String(c.image),
                            width: 118,
                            height: 118
                            },[])
                    ]),
                    h('dd', {}, [
                        h('div', {
                            className: 'user_info'
                        },[
                            h('strong', {}, [String(c.name)])
                        ]),
                        h('blockquote', {
                            className: 'arrow-box'
                        },[String(c.content)])
                    ])
                ])
            list.push(_vdom)
        });
        return list
    }
}



// 3: Wire up the update logic
// setInterval(function () {
//       count++;

//       var newTree = render(count);
//       var patches = diff(tree, newTree);
//       rootNode = patch(rootNode, patches);
//       tree = newTree;
// }, 1000);