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

function deepSetter(target, source){
    var self = this;
    // console.log(this);
    for (var key in source) {
        if (isPlainObject(source[key]) || isArray(source[key])) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                target[key] = {};
            if (isArray(source[key]) && !isArray(target[key]))
                target[key] = extend([], ArrayProxy);
            this.deepSetter(target[key], source[key])
        }
        else if (source[key] !== undefined) {
            (function(key){
                var _value = source[key];
                Object.defineProperty(target, key, {
                    enumerable: true,
                    configurable: true,
                    get: function(){
                        return _value
                    },
                    set: function(v){
                        if(v === _value)return;
                        _value = v;
                        // self.init(); todo 性能问题
                    }
                })
            })(key);

        }
    }
    return target
}

export default { def, deepSetter }