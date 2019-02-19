'use strict';

var fs = require('fs');
var expect = require('expect');

var miss = require('mississippi');
var File = require('vinyl');

var sourcesContent = require('../');

var pipe = miss.pipe;
var from = miss.from;
var concat = miss.concat;

var helloWorld = fs.readFileSync('test/assets/helloworld.js', 'utf8');
var helloWorld2 = fs.readFileSync('test/assets/helloworld2.js', 'utf8');

function makeFile() {
  var file = new File({
    cwd: __dirname,
    base: __dirname + '/assets',
    path: __dirname + '/assets/helloworld.js',
    contents: null,
  });

  file.sourceMap = {
    version: 3,
    file: 'helloworld.js',
    names: [],
    mappings: '',
    sources: ['helloworld.js', 'helloworld2.js'],
  };

  return file;
}

function runTest(files, assert, done, opts) {
  pipe([
    from.obj(files),
    sourcesContent(opts),
    concat(assert),
  ], done);
}

function checkMap(sourceMap, src1) {
  if (!src1) {
    src1 = helloWorld;
  }
  expect(sourceMap.sourcesContent.length).toEqual(2);
  expect(sourceMap.sourcesContent[0]).toEqual(src1);
  expect(sourceMap.sourcesContent[1]).toEqual(helloWorld2);
}

describe('sourcesContent', function() {
  it('loads sourcesContent', function(done) {
    function assert(files) {
      expect(files.length).toEqual(1);
      checkMap(files[0].sourceMap);
    }

    runTest([makeFile()], assert, done);
  });

  it('ignores a file without sourceMap property', function(done) {
    var file = makeFile();
    delete file.sourceMap;

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(typeof files[0].sourceMap).toEqual('undefined');
    }

    runTest([file], assert, done);
  });

  it('ignores a file without sourceMap.sources property', function(done) {
    var file = makeFile();
    delete file.sourceMap.sources;

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(typeof files[0].sourceMap.sources).toEqual('undefined');
      expect(typeof files[0].sourceMap.sourcesContent).toEqual('undefined');
    }

    runTest([file], assert, done);
  });

  it('sets null sourcesContent for file not found', function(done) {
    var file = makeFile();
    file.sourceMap.sources = ['file-not-found.js'];

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(files[0].sourceMap.sourcesContent.length).toEqual(1);
      expect(files[0].sourceMap.sourcesContent[0]).toEqual(null);
    }

    runTest([file], assert, done);
  });

  it('doesn\'t overwrite existing sourcesContent entries', function(done) {
    var file = makeFile();
    var existingContent = '/**/';
    file.sourceMap.sourcesContent = [existingContent];

    function assert(files) {
      expect(files.length).toEqual(1);
      checkMap(files[0].sourceMap, existingContent);
    }

    runTest([file], assert, done);
  });

  it('clear deletes sourcesContent but not sources', function(done) {
    var file = makeFile();
    file.sourceMap.sourcesContent = ['/**/', '/**/'];

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(typeof files[0].sourceMap).toEqual('object');
      expect(files[0].sourceMap.sources.length).toEqual(2);
      expect(typeof files[0].sourceMap.sourcesContent).toEqual('undefined');
    }

    runTest([file], assert, done, { clear: true });
  });

  it('clear deletes sourcesContent even with no sources', function(done) {
    var file = makeFile();
    file.sourceMap.sourcesContent = ['/**/', '/**/'];
    delete file.sourceMap.sources;

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(typeof files[0].sourceMap).toEqual('object');
      expect(typeof files[0].sourceMap.sources).toEqual('undefined');
      expect(typeof files[0].sourceMap.sourcesContent).toEqual('undefined');
    }

    runTest([file], assert, done, { clear: true });
  });

  it('clear function sets sourcesContent elements null but not sources', function(done) {
    var file = makeFile();
    file.sourceMap.sourcesContent = [helloWorld, helloWorld2];

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(typeof files[0].sourceMap).toEqual('object');
      expect(files[0].sourceMap.sources.length).toEqual(2);
      expect(files[0].sourceMap.sourcesContent.length).toEqual(2);
      expect(files[0].sourceMap.sourcesContent[0]).toEqual(helloWorld);
      expect(files[0].sourceMap.sourcesContent[1]).toEqual(null);
    }

    function clear(filename, mainFile) {
      expect(mainFile).toEqual(file.sourceMap.file);
      return filename !== mainFile;
    }

    runTest([file], assert, done, { clear: clear });
  });

  it('always true clear function deletes sourcesContent but not sources', function(done) {
    var file = makeFile();
    file.sourceMap.sourcesContent = [helloWorld, helloWorld2];

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(typeof files[0].sourceMap).toEqual('object');
      expect(files[0].sourceMap.sources.length).toEqual(2);
      expect(typeof files[0].sourceMap.sourcesContent).toEqual('undefined');
    }

    function clear() {
      return true;
    }

    runTest([file], assert, done, { clear: clear });
  });

  it('clear deletes sourcesContent even with no sources', function(done) {
    var file = makeFile();
    file.sourceMap.sourcesContent = ['/**/', '/**/'];
    delete file.sourceMap.sources;

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(typeof files[0].sourceMap).toEqual('object');
      expect(typeof files[0].sourceMap.sources).toEqual('undefined');
      expect(typeof files[0].sourceMap.sourcesContent).toEqual('undefined');
    }

    runTest([file], assert, done, { clear: true });
  });

  it('clear ignores a file without sourceMap property', function(done) {
    var file = makeFile();
    delete file.sourceMap;

    function assert(files) {
      expect(files.length).toEqual(1);
      expect(typeof files[0].sourceMap).toEqual('undefined');
    }

    runTest([file], assert, done, { clear: true });
  });
});
