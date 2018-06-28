'use strict';

var fs = require('fs');
var path = require('path');

var through = require('through2');
var stripBom = require('strip-bom-string');

function sourcesContent(options) {
  if (!options) {
    options = {};
  }

  function transform(file, _, cb) {
    var sourceMap = file.sourceMap;
    if (!sourceMap) {
      return cb(null, file);
    }

    if (options.clear) {
      delete sourceMap.sourcesContent;

      return cb(null, file);
    }

    if (!sourceMap.sources) {
      return cb(null, file);
    }

    sourceMap.sourcesContent = sourceMap.sourcesContent || [];

    // Load missing source content
    var remaining = sourceMap.sources.length;
    function gotOne() {
      remaining--;

      if (remaining === 0) {
        cb(null, file);
      }
    }

    sourceMap.sources.forEach(function(_, idx) {
      if (sourceMap.sourcesContent[idx]) {
        gotOne();
        return;
      }

      var sourcePath = path.resolve(file.base, sourceMap.sources[idx]);

      fs.readFile(sourcePath, 'utf8', function(err, data) {
        sourceMap.sourcesContent[idx] = err ? null : stripBom(data);
        gotOne();
      });
    });
  }

  return through.obj(transform);
}

module.exports = sourcesContent;
