var array_trim = require("./array_trim");



var filter_module = function(load_conf){
    var load_plugin = require("./load_plugin")(load_conf);
    var __filter = function (filter_arr, content){
        var plugin;
        if(typeof filter_arr == 'string') {
            filter_arr = array_trim(filter_arr.split('|'));
        }
        if(filter_arr.length==1) {
            return content;
        }
        var current_filter = filter_arr.pop();
        plugin = load_plugin(current_filter);

        if(plugin){
            content= plugin.render(filter_arr[0], content);
        }
        return __filter(filter_arr, content);
    }
    return __filter;
};
module.exports = filter_module;