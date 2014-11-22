
var array_trim = require("./array_trim");

var __obj_parser = function(target){
    for(var key in target){
        if(target.hasOwnProperty(key)){
            target[key] = __json_parser(target, key);
        }
    }
    return target;
};


var __array_parser = function(target){
    for(var i=0;i<target.length; i++){
        target[i] = __json_parser(target, i);
    }
    return target;
};


var __json_parser = function(load_conf){
    var filter = require("./filter")(load_conf);

    var json_parser = function (target){
        if(target.constructor === Array) {
            for(var i=0;i<target.length; i++){
                target[i] = json_parser(target[i]);
            }
        } else {
            if (typeof target == "object") {
                for (var obj_key in target) {
                    if (target.hasOwnProperty(obj_key)) {
                        var splitted_key = array_trim(obj_key.split("|"));
                        target[splitted_key[0]] = filter(splitted_key.slice(), json_parser(target[obj_key]));
                        if(splitted_key.length!==1)
                            delete target[obj_key];
                        if(typeof target[splitted_key[0]]=='object' && !Buffer.isBuffer(target[splitted_key[0]])) {
                            target[splitted_key[0]] = json_parser(target[splitted_key[0]])
                        }
                    }
                }
            }

            /*if (typeof root[key] == "object") {
             var splitted_key = array_trim(key.split("|"));
             root[splitted_key[0]] = filter(
             splitted_key,
             __obj_parser(root[key])
             );
             delete root[key];
             }*/
        }

        return target;
    };
    return json_parser;
};
module.exports = __json_parser;