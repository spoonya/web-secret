require('../../modules/es.json.stringify');
require('../../modules/es.json.to-string-tag');
var path = require('../../internals/path');

// eslint-disable-next-line es-x/no-json -- safe
module.exports = path.JSON || (path.JSON = { stringify: JSON.stringify });
