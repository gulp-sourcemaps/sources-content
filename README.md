# @gulp-sourcemaps/sources-content

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![AppVeyor Build Status][appveyor-image]][appveyor-url] [![Coveralls Status][coveralls-image]][coveralls-url]

Gulp plugin for loading or clearing sources content of a sourcemap.

## Example

Sources content is loaded by default during `sourcemaps.write()` but this may
be too late.  This module allows sources content to be loaded before using
`@gulp-sourcemaps/map-sources` to rewrite using URL's that might not be valid
on the filesystem.

```js
var mapSources = require('@gulp-sourcemaps/map-sources');
var sourcesContent = require('@gulp-sourcemaps/sources-content');

gulp.src(...)
  .pipe(sourcemaps.init())
  .pipe(sourcesContent())
  .pipe(mapSources(function(sourcePath, file) {
    return '../' + sourcePath;
  }))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(...))
```

## API

### `sourcesContent(options)`

Takes a object containing options for this plugin.

#### `options.clear`

Seting this option `true` will cause the sources content to be deleted instead
of initialized.

## License

MIT

[downloads-image]: http://img.shields.io/npm/dm/@gulp-sourcemaps/sources-content.svg
[npm-url]: https://npmjs.org/package/@gulp-sourcemaps/sources-content
[npm-image]: http://img.shields.io/npm/v/@gulp-sourcemaps/sources-content.svg

[travis-url]: https://travis-ci.org/gulp-sourcemaps/sources-content
[travis-image]: http://img.shields.io/travis/gulp-sourcemaps/sources-content.svg?label=travis-ci

[appveyor-url]: https://ci.appveyor.com/project/phated/sources-content
[appveyor-image]: https://img.shields.io/appveyor/ci/phated/sources-content.svg?label=appveyor

[coveralls-url]: https://coveralls.io/r/gulp-sourcemaps/sources-content
[coveralls-image]: http://img.shields.io/coveralls/gulp-sourcemaps/sources-content.svg
