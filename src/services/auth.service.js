const { randomBytes, createHash } = require('crypto');

function hashPassword(rawPassword) {
  return createHash('SHA256').update(rawPassword).digest('hex');
}

module.exports = {
  hashPassword
};