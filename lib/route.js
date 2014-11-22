var slugify = require("./slugify");
function index(obj,i) {
    return obj[i];
}
//'a.b.etc'.split('.').reduce(index, obj)

module.exports = function(route){
    results = route.match(/\$[a-zA-Z.]+/g);

    var fn = function(params){
        if(!params) return route;
        if(!results) return route;
        for(var i=0;i<results.length;i++){
            var result = results[i];
            var accumulator = results[i].substring(1).split('.');
            var value = accumulator.reduce(index, params);
            result = result.replace(/([\$])/g,"\\$1");
            var rxp = new RegExp(result,"g");
            var slg = slugify(value);

            route = route.replace(rxp, slg);
        }

        return route;
    };
    return fn;
};