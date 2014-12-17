var asyncFunction = function(callback) {
  process.nextTick(callback);
};

var functionHasReturned = false;
asyncFunction(function() {
  console.assert(functionHasReturned);
});
functionHasReturned = true;

