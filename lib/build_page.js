var merge = require('merge');
var __load_plugin = require("./load_plugin");

var path = require('path');


var __json_parser = require("./json_parser");
var load_conf;

var main_conf,website_conf;

/*
 var write_file = function(main_conf, file_path, content){
 var pretty_urls = main_conf['pretty_urls'];


 file_path = url_prettify(file_path, pretty_urls);

 var write_path = path.join(process.cwd(), main_conf['build_dir'], file_path);
 mkdirp.sync(path.dirname(write_path));

 fs.writeFileSync(write_path, content, function(err) {
 if(err) {
 console.log(err);
 } else {
 console.log("Saving:"+write_path);
 }
 });
 return write_path;
 };

 var __write_stream = function(main_conf, file_path, content){
 var pretty_urls = main_conf['pretty_urls'];
 file_path = url_prettify(file_path, pretty_urls);

 var write_path = path.join(process.cwd(), main_conf['build_dir'], file_path);
 };
 */

var url_prettify = function(url, pretty_urls){
    var index_file = "index.html";
    if(url=='/') return index_file;
    if(pretty_urls){

        return path.join(url, index_file);
    }
    return url+".html";

};

var render_file = function(file_path, content){
    var pretty_urls = main_conf.pretty_urls;
    file_path = url_prettify(file_path, pretty_urls);

    var write_path = path.join(process.cwd(),
        main_conf.directories.build,
        file_path
    );

    return {
        cwd: path.dirname(write_path),//path.dirname(path.relative(process.cwd(),write_path)),
        base: path.dirname(write_path),
        path: write_path,//write_path,
        contents: content
    }
};
//rendered.path.substring(rendered.path.lastIndexOf(main_conf.directories.build.substring(2)))
var resolve_file_paths = function(file){

    /**
     * link rel="stylesheet" href="../assets/bower_components/bootstrap/dist/css/bootstrap.css"/>
     <!-- build:css assets/css/combined.css -->
     <link rel="stylesheet" href="../assets/less/main.less"/>
     <!-- endbuild -->
     */

    var url_matcher = /(href|src)=["']([\w_/\.]+)["']/g;

    var match = url_matcher.exec(file.contents);

    var current_file_url = path.dirname(file.path);

    while (match != null) {
        if(match[2].charAt(0)!=="/"){
            var asset_file_url = match[2].replace("../assets","assets");
            //main_conf.directories.build
            asset_file_url = path.join(asset_file_url);

            var res_path = path.relative(current_file_url, asset_file_url);
            file.contents= file.contents.replace(new RegExp(match[2], "g"), res_path);
            /*console.log(current_file_url);
             console.log(asset_file_url);
             console.log(res_path);
             console.log(file.contents);*/

        }
        match = url_matcher.exec(file.contents);
    }

    // Base src root ./src
    // Assets : ./src/assets
    // Templates :
    return file;
};


module.exports = function(__load_conf){
    load_conf = __load_conf;

    var __build_page = function(route, path_cb, content){
        main_conf = load_conf.get('main_conf');
        website_conf = load_conf.get('website_conf');


        var _compiled_pages = [];
        if(!content) {
            console.log("Content %s for route %j",content,route);
        } else {
            if (content.constructor == Array) {
                for (var i = 0; i < content.length; i++) {
                    _compiled_pages.push(
                        __build_page(route, path_cb, content[i])
                    );
                }
            } else {
                var load_plugin = __load_plugin(load_conf);
                var json_parser = __json_parser(load_conf);

                var context = json_parser(merge(content, {}));
                context = merge(context, website_conf.global);

                var page = website_conf.pages[route];

                var template_renderer = load_plugin(main_conf['engine']);

                var rendered = template_renderer.render(page.template, context);


                var file = render_file(path_cb(context), rendered);
                // BUILDING FLAGS
                if(main_conf.resolve_file_paths){
                    file = resolve_file_paths(file)
                }
                _compiled_pages.push(file);
            }
        }
        return _compiled_pages;
    };

    return __build_page;
};
