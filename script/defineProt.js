function isArray(obj){
    return Array.isArray(obj);
}
function isPlainObject(obj) {
    return Object.prototype.toString.call( obj ) === "[object Object]";
}

function propFn (val,fn) {
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
}

function def (obj, key, val, fn) {
    Object.defineProperty(obj, key, propFn(val,fn))
}

function deepSetter (target, fn) {
    for (let key in target) {
        if (isPlainObject(target[key]) || isArray(target[key])) {
            deepSetter(target[key], fn)
        }
        else if (target[key] !== undefined) {
            (function(key){
                var _value = target[key];
                Object.defineProperty(target, key, {
                    enumerable: true,
                    configurable: true,
                    get: function(){
                        return _value
                    },
                    set: function(v){
                        if(v === _value)return;
                        _value = v;
                        fn && fn(v)
                    }
                })
            })(key);
        }
    }
}

export default { def, deepSetter }