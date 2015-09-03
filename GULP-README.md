# Setting up Honeycomb with Gulp
## Overview
Each of the folders in [src](src) represent a Honeycomb module that can be imported.
In each module you will find a readme file that lists the dependencies of that module ([e.g.](src/base/README)).  Anything could happen if you import a module without it's dependencies.

Honeycomb provides unprocessed SASS files that need have some processing done to them as part of your build process.
Once this is done a module can be added by importing the _main.scss file in that module's css folder.

## Prerequistes
### Gulp
It will be assumed that you've set your project up to build with Gulp.

### Packages
These are the npm packages required to use Honeycomb with gulp: 
gulp-bower
gulp-css-globbing
gulp-debug
gulp-sass

```
npm install --save-dev gulp-bower gulp-css-globbing gulp-debug gulp-sass
```
will add the necessary packages to your project.

Alternative packages and approaches may exist.

## Bower
Make sure that you've added bower.json as described [here](README.md#getting-honeycomb-into-your-project).

You'll probably want to add a task to your gulp build to automatically pull down the latest bower components.  
This might look like this:
```JavaScript
var bower = require('gulp-bower');

...

gulp.task('bower', function () {
    return bower({ cmd: 'update' });
});
```

## Globbing Honeycomb
Each honeycomb module needs to be globbed before it can be used.  This is to avoid explicitly listing every .scss file in the modules _main.scss file.

First add a task to import the libraries we need and add a task to copy all the honeycomb css into bower_components/honeycomb/dist:
```JavaScript
var cssglobbing = require('gulp-css-globbing');
var debug = require('gulp-debug');

gulp.task('honeycomb-css', ['bower'], function () {
    return gulp.src(['bower_components/honeycomb/src/*/css/*/_*.scss', 'bower_components/honeycomb/src/*/vendor/**/*.scss'])
        .pipe(gulp.dest('bower_components/honeycomb/dist'));
});
```

Next add a task to glob all of the _main.scss in the honeycomb modules:
```JavaScript
gulp.task('honeycomb-glob', ['bower'], function () {
    return gulp.src('bower_components/honeycomb/src/*/css/_main.scss')
        .pipe(cssglobbing({
            extensions: ['.scss'],
            scssImportPath: {
                leading_underscore: false,
                filename_extension: false
            }
        }))
        .pipe(debug({ title: 'honeycomb-glob:' })) // HACK: this line is needed otherwise not all of the files get copied :@
        .pipe(gulp.dest('bower_components/honeycomb/dist'));
});
```
Notice that both these tasks need to depend on the bower task, otherwise the files wouldn't exist.

## SASS
Honeycomb components are written in SASS, and compilation is necessary.
To start using SASS in you project, change the file extension of your top level css file(eg main.css) to .scss.
TODO

## Referencing honeycomb modules
TODO
## Teamcity
TODO

##Local development
TODO
