var path = require('path');

// Loads all required environment variables from default values.

// Load this trusted endpoint's key and the key used by the api.
//   These keys are intentionally local file system resources.

if (!process.env.BOILERPLATE_TRUSTED_ENDPOINT_KEY_ID) {
  process.env.BOILERPLATE_TRUSTED_ENDPOINT_KEY_ID = 'boilerplate/self';
}

if (!process.env.BOILERPLATE_TRUSTED_ENDPOINT_KEYFILE) {
  process.env.BOILERPLATE_TRUSTED_ENDPOINT_KEYFILE = path.join(__dirname, './boilerplate-dev.pem');
}

if (!process.env.BOILERPLATE_JWT_ISSUER) {
  process.env.BOILERPLATE_JWT_ISSUER = 'test';
}

if (!process.env.BOILERPLATE_JWT_AUDIENCE) {
  process.env.BOILERPLATE_JWT_AUDIENCE = 'test';
}

if (!process.env.BOILERPLATE_JWT_ISSUER_PUB) {
  process.env.BOILERPLATE_JWT_ISSUER_PUB = path.join(__dirname, './test/test-auth-key.pub');
}
