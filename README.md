Bootsie
=======

Static website generator simple and modular

<p align="center">
<!--<a href="http://cmyklove.com/bootsie">
<img height="257" width="114" src="https://bootsie-img-2x.png">
</a>-->
</p>

# Bootsie
> Your next static website generator

##Why you should choose bootsie?
* Simple and direct, stop wasting time with long configurations
* Extensible with Plugins!, do whatever you want!
* Supports GULP and streams, check [gulp-bootsie](https://github.com/MichaelCereda/gulp-bootsie)
* Start in seconds with an integrated build system (browser-sync and batteries included)! see [bootsie-start-kit](https://github.com/MichaelCereda/bootsie-start-kit)

## Usage

First, install `bootsie`:

```shell
npm install bootsie
```

##Want to use it in a script?

```javascript
var bootsie = require('bootsie')("conf.json");

//RENDER
bootsie.build("website.json")
```

##With GULP

```shell
npm install gulp-bootsie
```

in your gulpfile.js
```javascript
var bootsie = require('gulp-bootsie')("conf.json");

//RENDER
gulp.task("bootsie-build", function(){
    return gulp.src([src_dir+"/*.json"])  //get the configuration file in stream
    .pipe(bootsie.build())  //Generate html files
    .pipe(gulp.dest("."));  //Save
```

See plugin page for more details.


##Suggestion
Clone [bootsie-start-kit](https://github.com/MichaelCereda/bootsie-start-kit)

## How does bootsie works?

1. Bootsie reads 2 configuration files.
    * conf.json - contains overall parameters
    * website.json - contains your website tree
2. Parses the json files loading all the files.
3. Fills the respective templates.
4. Checks for errors in paths.


### Sample `conf.json`

```json
{
    "engine":"nunjucks",
    "bootstrap":"website.json",
    "languages": ["en","it"],
    "pretty_urls":true,
    "resolve_file_paths":true,
    "directories":{
        "templates": "./src/templates",
        "assets": "./src/assets",
        "database": "./src/db",
        "build": "./build",
        "source": "./src"
    }
}
```

### Sample `website.json`

```json
{
    "global":{
        "website":{
            "title":"Demo Website",
            "description":"Insert Astonishing description here"
        },
        "menu":{

        }
    },
    "pages":{
        "/":{                                   //Route /
            "template":"index.html",            //template name
            "content": {
                "home | file": "home.json",     //variable with filter(file)
                "bio | file":"bio.json"         //variable with filter(file)

            }
        },
        "archive/$post.title": {                //Route with parameter
            "template":"archive.html",
            "base_dir":"/archive",
            "content": [
                {"post | file": "archive/first_post.json"},
                {"post | file": "archive/second_post.json"}
            ]
        }
    }
}
```
And generates HTML, JSON or other formats (depending on the template engine used), parsing *website.json*.

## Filters
Filters are used simply intesting a pipe | in front of the filter name, like this.
```json
{
    "content": {
        "home | file": "home.json",
        "bio | file":"bio.json"
    }
}
```
in this case the plugin *bootsie-file* is called and the result will be saved in *home*

Result after filter
```json
{
    "content": {
        "home": {
            "title":"Content of home.json",
            "description": "if bootsie-file loads a .json file, it will be automatically parsed"
        },
        "bio":{
            "title":"Content of bio.json"
        }
    }
}
```
### Filters concatenation
```json
{
    "content": {
        "home | file | md ": "home.md"
    }
}
```
in this case the file will be loaded by *bootsie-file* and it's content will be parsed by *bootsie-md*. Simple and powerful!

## Create a Plugin

### Bootsie follows GULP guidelines
[Read Gulp guidelines](https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/guidelines.md)

Plugins are very simple

```json
{
    "content": {
        "home | file": "home.md"
    }
}
```
```javascript


function bootsie_file_filter (conf){
    /*
     target_name contains the string "home | file"
     contents contains the string "home.md"
    */
    function __render(target_name, content){
        return content;
    }
    return {
        render:__render
    }
}
module.exports = bootsie_file_filter;

```
