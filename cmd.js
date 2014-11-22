var program = require('commander');
var path = require('path');

var pkg = require( path.join(__dirname, 'package.json') );
var bootsie = require("./index");

program
    .version(pkg.version)
    .option('-c, --create [project_name]', 'create initial website structure')
    .option('-s, --serve [host:port]', 'Serve file')
    .option('-b, --build [website_conf_file] [main_conf_file]', 'Build ')
    .option('-v, --verbose', '')
    .parse(process.argv);

if (program.create){

}
if (program.build){
    var __website_conf = program.build[0];
    var __main_conf = program.build[1];
    var opts = {
        verbose : program.verbose !== undefined
    };

    
    var bootsie_compiler = bootsie(__main_conf);
    bootsie_compiler.build(__website_conf, opts);

}
