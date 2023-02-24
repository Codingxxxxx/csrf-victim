const { createHash, randomBytes } = require('crypto');

function generateCSRF() {
  return createHash('SHA1').update(randomBytes(32)).digest('hex');
}

module.exports = {
  generateCSRF
}