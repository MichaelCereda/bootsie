var __build_page = require("./build_page");
var route_parser = require("./route");

var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');

var __debug = false;


flatten = function(arr) {
    return arr.reduce(function(prev, cur) {
        var more = [].concat(cur).some(Array.isArray);
        return prev.concat(more ? flatten(cur) : cur);
    },[]);
};

var write_file = function(file){
    var full_path = file.path;//path.join(file.base, file.path);
    mkdirp.sync(path.dirname(full_path));

    try{
        fs.writeFileSync(full_path, file.contents);
    } catch(err){
        console.log(err);

    }

    if(__debug) console.log("Saving:"+file.path);
    return file.path;
};
var main_conf, website_conf;
module.exports = function(load_conf){
    var build_page = __build_page(load_conf);

    return function (opts) {
        main_conf = load_conf.get('main_conf');
        website_conf = load_conf.get('website_conf');

        __debug= opts.verbose;
        if (!website_conf) return;


        var _compiled_pages = [];
        for(var route in website_conf.pages){
            var page_path = route_parser(route);

            _compiled_pages.push(
                build_page(route, page_path, website_conf.pages[route].content)
            );

        }
        //return flatten array
        _compiled_pages = flatten(_compiled_pages);
        if(opts.stream) return _compiled_pages;
        if(__debug){
            console.log("Bootsie generated "+_compiled_pages.length+" files");
        }
        for (var i=0;i<_compiled_pages.length;i++){
            write_file(_compiled_pages[i]);
            delete _compiled_pages[i].contents;
        }
        return _compiled_pages;
    }
};
