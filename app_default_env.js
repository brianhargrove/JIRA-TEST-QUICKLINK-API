var path = require('path');

// Loads all required environment variables from default values.

// Load this trusted endpoint's key and the key used by authentic.
//   These keys are intentionally local file system resources.

if (!process.env.AUTH_TRUSTED_ENDPOINT_KEY_ID) {
  process.env.AUTH_TRUSTED_ENDPOINT_KEY_ID = 'bootstrap/self';
}

if (!process.env.AUTH_JWT_ISSUER) {
  process.env.AUTH_JWT_ISSUER = 'test';
}

if (!process.env.AUTH_JWT_AUDIENCE) {
  process.env.AUTH_JWT_AUDIENCE = 'test';
}

if (!process.env.AUTH_JWT_ISSUER_PEM) {
  process.env.AUTH_JWT_ISSUER_PEM = path.join(__dirname, './test/test-key.pem');
}
