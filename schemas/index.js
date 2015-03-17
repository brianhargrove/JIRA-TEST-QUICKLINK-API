// loads sibling files and folders recursively, as a javascript object.

// To add new schemas, place the schemas in subfolders.
module.exports = require('foldero')(
  './', {
    relative: __dirname,
    ignore: __filename
  });