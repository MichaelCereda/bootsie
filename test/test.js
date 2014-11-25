var assert = require("assert");
var slugify = require("../lib/slugify");
var load_conf= require("../lib/load_conf");
var deepEqual = require('deep-equal');

describe('Bootsie', function(){
    describe('Route', function(){
        var route = require("../lib/route");

        var test_route = "/archive/$title";
        var test_params = {'title':"Demo Title"};
        it('should always return a function', function(){
            assert(typeof route(test_route)=='function',"OK");
        });
        it('should accept parameters named like its placeholders', function(){
            var fn = route(test_route);
            var res = fn(test_params);
            assert(res == "/archive/"+slugify(test_params.title), "");
        });
        it('also dotted', function(){
            var test_route_dotted = "/archive/$post.title";
            var test_params_dotted = {"post":{'title':"Demo Title"}};

            var fn = route(test_route_dotted);
            var res = fn(test_params_dotted);
            assert(res == "/archive/"+slugify(test_params_dotted.post.title), "OK");
        });
    });

    describe('Json Parser', function () {
        var json_parser = require('../lib/json_parser')(load_conf);
        var test_json = {
            "foo":{
                "bar":[
                    {"test":"test"},
                    {"post":"test"},
                    {"post":"test"}
                ],
                "bor":"foo"
            }
        };
        var test_json_2 = {
            "foo|fake":{
                "bar|fake":[
                    {"test |fake":"test"},
                    {"post | fake ":"test"},
                    {"post | fake":"test"}
                ],
                "bor|fake":"foo"
            }
        };
        it("should parse a json file looking the descendents", function () {
            var t_conf = json_parser(test_json);

            assert(deepEqual(test_json, t_conf), "Wrong");
        });
        it("should if a filter doesn't exist, skip and trigger error", function () {
            var t_conf = json_parser(test_json_2.slice());

            assert(deepEqual(test_json, t_conf), "Wrong");
        })
    });
    describe('Compiler', function(){
        var compiler = require("../lib/compiler");
        var fn = compiler(load_conf.load('conf.json'));

        it('Sould return a function', function(){
            assert(typeof fn == "function", "It retourned a "+(typeof fn));
        });
        it('Sould return a function', function(){
            assert(typeof fn == "function", "It retourned a "+(typeof fn));
        });

    })
});