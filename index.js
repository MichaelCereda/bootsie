var __load_conf = require("./lib/load_conf");
var __compiler = require("./lib/compiler")(__load_conf);

function bootsie_module(config_file){

    __load_conf.load(config_file, "main_conf");

    var __build = function(website_conf, opts){
        __load_conf.load(website_conf,"website_conf");

        return __compiler(opts);
    };
    //Reads a configuration file as buffer
    var __build_from_buffer = function(file_buffer, opts){
        var website_conf = JSON.parse(file_buffer);

        __load_conf.inject("website_conf", website_conf);
        return __compiler(opts);
    };
    var __serve = function(website_conf){
        website_conf = __load_conf(website_conf);
    };
    return {
        build : __build,
        serve : __serve,
        build_from_buffer : __build_from_buffer
    }
}

module.exports = bootsie_module;