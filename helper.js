var Helpers = (function (){
  var createArray = function (nodes) {
    var data = [];
    for (var node in nodes) {
      data.push(node);
    }
    return data;
  };

  var sortNodesArray = function (array) {
    return array.sort(function (a, b) {
      a = a.substring(4);
      b = b.substring(4);
      return a - b
    });
  };

  var throttle = function (fn, wait, scope) {
    wait || (wait = 250);
    var prevTime,
    defer;
    return function () {
      var context = scope || this;

      var currTime = +new Date,
      args = arguments;

      if (prevTime && currTime < prevTime + wait) {
        clearTimeout(defer);
        defer = setTimeout(function () {
          prevTime = currTime;
          fn.apply(context, args);
        }, wait);
      } else {
        prevTime = currTime;
      }
    };
  }

  return {
    createArray: createArray,
    sortNodesArray: sortNodesArray,
    throttle: throttle
  }
})()
