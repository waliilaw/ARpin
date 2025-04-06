const path = require('node:path');

const corejsVersion = require(
  path.join(path.dirname(require.resolve('core-js')), 'package.json')
).version;

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }]
  ]
};
