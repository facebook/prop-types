module.exports = function diffArr(base, target) {
  return base.filter(function(item){return target.indexOf(item) < 0});
}