module.exports = function(arr){
    arr = arr.map(Function.prototype.call, String.prototype.trim);

    return arr;
};