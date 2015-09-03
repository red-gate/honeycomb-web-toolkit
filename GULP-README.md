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
TODO

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
