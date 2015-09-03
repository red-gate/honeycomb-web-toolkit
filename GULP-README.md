# Setting up Honeycomb with Gulp
## Overview
Each of the folders in [src](src) represent a Honeycomb module that can be imported.
In each module you will find a readme file that lists the dependencies of that module ([e.g.](src/base/README)).  Anything could happen if you import a module without it's dependencies.

Honeycomb provides unprocessed SASS files that need have some processing done to them as part of your build process.
Once this is done a module can be added by importing the _main.scss file in that module's css folder.

For an example of this in action check out [DLM Dashboard](https://github.com/red-gate/sqllighthouse/blob/master/source/RedGate.SQLLighthouse.WebServer.StaticFiles/gulpfile.js)
## Prerequistes
### Gulp
It will be assumed that you've set your project up to build with Gulp, and have some familiarity with using gulp.  A list of helpful articles for getting started can be found [here](https://github.com/gulpjs/gulp/blob/master/docs/README.md#articles) 

### Packages
Run the following command in your project's directory to install the necessary packages to use Honeycomb with Gulp:

```
npm install --save-dev gulp-bower gulp-css-globbing gulp-debug gulp-sass
```

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
The easiest way to do this is to convert your css over to scss, as this will also allow you to use the functions and mixins that honeycomb provides
### Moving over to SASS.
To do this, simply change the file extension on all your css files to .scss.  
Then add an underscore to the front of any partial css file, where a partial css file is any css file that is imported by another css file. So 'not-found/index.css' would become 'not-found/_index.scss'
Finally make sure that any css import statements of scss files are of the form:
```css
@import 'not-found/index'
```
i.e. with no 'url', underscore or extension

See http://sass-lang.com/guide for more information on using SASS

### Compiling SASS with Gulp
The gulp-sass library provides a plugin that will do the SASS compiling.
If you already have a task that minifies css then gulp-sass can be added at the start of the pipeline, and the task should depend on the two globbing tasks that were added [previously](#globbing-honeycomb).
Otherwise add a new task:

```JavaScript
var sass = require('gulp-sass');

...

gulp.task('compile-css', ['honeycomb-css', 'honeycomb-glob'], function () {
    return gulp.src('assets/css/main.scss') //Or wherever your top level scss file is
               .pipe(sass())
               .pipe(gulp.dest(buildFolder));
}
```
This will compile your scss file, compiling and merging in any partial scss files that it references.
Don't forget to add your new task as a dependancy to the default task so that it gets run.

## Referencing honeycomb modules
To start using a honeycomb module in your project add an import of that modules main file to your top level scss file.
If you followed the instructions above then gulp will have installed the globbed honeycomb modules into "bower_components/honeycomb/dist".
For each module $module_name that you want to add to your project add an import statement to your main.scss file:
```css
@import '../../bower_components/honeycomb/dist/$module_name/css/main';
```
## Teamcity

Building a project with bower requires that Git installed and on PATH, so on Teamcity you should add this agent requirement: 
```
env.HAS_GIT exists
```
##Local development
It is possible to use bower to pull from a local repo.  This is useful if you are working on Honeycomb and want to see the changes in your product before pushing the changes.

Change your bower.json to look like this 
```json
{
    "name": "Your project name goes here",
    "dependencies": {
        "honeycomb": PATH_TO_LOCAL_REPO
    }
}
```
Now bower will pull HEAD of your local repo rather than from Github (changes still need to be commited locally).
