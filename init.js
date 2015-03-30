#!/usr/bin/env node

'use strict';

var util = require('util');
var fs = require('fs');
var path = require('path');
var ch = require('change-case');
var program = require('commander');
var ursa = require('ursa');

var apiname;

function ignore() {}

function rethrow(err) {
  if (err) throw err;
}

program.version('0.1.0')
  .description('Initializes a new API based on the boilerplate')
  .option('-n, --name <name>', "New API's name", function(n) {
    apiname = n;
  })
  .parse(process.argv);

function genPrivateKey(fileName, fullName) {
  var pk = ursa.generatePrivateKey(); // 2048, 65537
  var pemFileName = path.join(path.dirname(fullName),
    path.basename(fileName).replace(/boilerplate/g, apiname));
  var pubFileName = path.join(path.dirname(pemFileName),
    path.basename(pemFileName, '.pem')) + '.pub';
  fs.writeFile(pemFileName, pk.toPrivatePem('utf8'), rethrow);
  fs.writeFile(pubFileName, pk.toPublicPem('utf8'), rethrow);
  fs.unlink(fullName, ignore);
}

// This is a quick and dirty filter; a better approach would be to use the
// local .gitignore patterns to ignore files. ~Pdc
function possiblyFilterFile(fileName, fullName) {
  if (fileName === 'boilerplate-dev.pem') {
    genPrivateKey(fileName, fullName);
    return true;
  }
  return fullName === __filename ||
    fullName.indexOf('node_modules') !== -1 ||
    fullName.indexOf('.git') !== -1;
}

function performTemplateReplacements(file) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    var transformed = data.replace(/(\${boilerplate})/g, ch.lowerCase(apiname));
    transformed = transformed.replace(/(\${BOILERPLATE})/g, ch.constantCase(apiname));
    transformed = transformed.replace(/(\${Boilerplate})/g, ch.titleCase(apiname));
    fs.writeFile(file, transformed, 'utf8', rethrow);
  });
}

function handleFileStat(file, err, stat) {
  if (err) {
    throw err;
  }

  if (stat.isFile()) {
    if (path.basename(file).indexOf('boilerplate') !== -1) {
      var renamed = path.join(path.dirname(file),
        path.basename(file).replace(/boilerplate/g, apiname));
      fs.renameSync(file, renamed);
      file = renamed;
    }
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
