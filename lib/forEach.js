module.exports = function forEach(iterable, callback) {
  var iterator = iterable[Symbol.iterator]();

  while(true) {
    var step = iterator.next()
    if (step.done) break;
    callback(step.value);
  }
}
