function get() {}
function has() {}

exports.default = { get, has };
exports.get = get;
exports.has = has;

module.exports = { get, has };
module.exports.get = module.exports["default"] = get;
