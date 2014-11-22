var path = require('path');

var __plugins = {};

module.exports = function(load_conf){
    return function(name) {
        var plugin_name;
        try {
            //tries to load plugin
            plugin_name = 'bootsie-' + name;

            //Plugin cache
            if (!__plugins.hasOwnProperty(plugin_name)) {
                __plugins[plugin_name] = require(plugin_name)(load_conf.get('main_conf'));
            }
        } catch (err) {
            console.log("Can't load plugin " + plugin_name);
            //console.error(err);
        }

        return __plugins[plugin_name];
    }
};