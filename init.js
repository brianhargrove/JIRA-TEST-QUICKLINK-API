#!/usr/bin/env node

'use strict';

var util = require('util');
var fs = require('fs');
var path = require('path');
var ch = require('change-case');
var program = require('commander');

var apiname;

program.version('0.1.0')
  .description('Initializes a new API based on the boilerplate')
  .option('-n, --name <name>', "New API's name", function(n) {
    apiname = n;
  })
  .parse(process.argv);


// This is a quick and dirty filter; a better approach would be to use the
// local .gitignore patterns to ignore files. ~Pdc
function possiblyFilterFile(fileName, fullName) {
  return fullName === __filename ||
    fullName.indexOf('node_modules') !== -1 ||
    fullName.indexOf('.git') !== -1;
}

function performTemplateReplacements(file) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var transformed = data.replace(/(\${boilerplate})/g, ch.snakeCase(apiname));
    transformed = transformed.replace(/(\${BOILERPLATE})/g, ch.constantCase(apiname));
    transformed = transformed.replace(/(\${Boilerplate})/g, ch.titleCase(apiname));
    fs.writeFile(file, transformed, 'utf8', function(err) {
      if (err) {
        throw err;
      }
      util.log('transformed: '+ file);
    });
  });
}

function handleFileStat(file, err, stat) {
  if (err) {
    throw err;
  }

  if (stat.isFile()) {
    performTemplateReplacements(file);
  } else {
    replaceInFiles(file);
  }
}

function replaceInFiles(dir) {
  fs.readdir(dir, function(err, files) {
    if (err) {
      throw err;
    }

    var len = files.length;
    var i = -1;
    var n, f;

    while (++i < len) {
      n = files[i];
      f = path.join(dir, n);
      if (!possiblyFilterFile(n, f)) {
        fs.stat(f, handleFileStat.bind(null, f));
      }
    }
  });
}

if (!apiname) {
  program.help();
} else {
  replaceInFiles(__dirname);
}
