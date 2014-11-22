var path = require("path");
var fs = require("fs");

var __confs = {};

var __inject = function(key, value){
    return __confs[key]=value;
};
var __load = function (conf_path, alias) {
    var conf;
    var full_path;

    if (fs.existsSync(conf_path))
        full_path = conf_path;
    else
        full_path = path.join(process.cwd(), 'src', conf_path);

    try {
        conf = require(full_path);
        if(alias) {
            __inject(alias, conf);
        }
    } catch (e) {
        console.error("Can't load configuration file " + conf_path);
    }
    return conf;
};
module.exports = {
        load: __load,
        get:function(key){
            return __confs[key];
        },
        inject:__inject,
        has:function(key){
        return __confs.hasOwnProperty(key);
    }
};