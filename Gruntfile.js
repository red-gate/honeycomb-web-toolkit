module.exports = function(grunt) {

    grunt.initConfig({

        /* Sass configuration */
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    sourcemap: 'auto',
                    require: 'sass-globbing'
                },
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['honeycomb.scss'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            }
        },

        /* Automatically add vendor-prefixes to CSS using the "Can I Use" database. */
        // Use '$ npm update caniuse-db' to update the prefixes database.
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie >= 8'],
                map: true
            },
            css: {
                src: ['dist/css/honeycomb.css']
            }
        },

        /* JSHint - Check JS syntax */
        jshint: {
            options: {
                /*
                 * ENVIRONMENTS
                 * =================
                 */
                
                // Define globals exposed by modern browsers.
                "browser": true,
                
                // Define globals exposed by jQuery.
                "jquery": true,
                
                // Define globals exposed by Node.js.
                "node": true,
                
                // Allow ES6.
                "esnext": true,
                
                /*
                 * ENFORCING OPTIONS
                 * =================
                 */
                
                // Force all variable names to use either camelCase style or UPPER_CASE
                // with underscores.
                "camelcase": true,
                
                // Prohibit use of == and != in favor of === and !==.
                "eqeqeq": true,
                
                // Enforce tab width of 2 spaces.
                "indent": 2,
                
                // Prohibit use of a variable before it is defined.
                "latedef": true,
                
                // Enforce line length to 80 characters
                "maxlen": 80,
                
                // Require capitalized names for constructor functions.
                "newcap": true,
                
                // Enforce use of single quotation marks for strings.
                "quotmark": "single",
                
                // Enforce placing 'use strict' at the top function scope
                "strict": true,
                
                // Prohibit use of explicitly undeclared variables.
                "undef": true,
                
                // Warn when variables are defined but never used.
                "unused": true,
                
                /*
                 * RELAXING OPTIONS
                 * =================
                 */
                
                // Suppress warnings about == null comparisons.
                "eqnull": true
            },
            scripts: ['src/**/*.js', '!src/*/vendor/**/*'],
        },

        /* Uglify - Concatenate and minify JavaScript */
        uglify: {
            options: {
                sourceMap: true,
                mangle: true
            },
            scripts: {
                files: {
                    'dist/js/honeycomb.min.js' : [
                        'src/*/vendor/**/*.js',
                        '!src/base/vendor/modernizr.min.js',
                        'src/*/js/**/*.js'
                    ]
                }
            }
        },

        clean: {
            fonts: ['dist/fonts']
        },

        copy: {
            redgateFonts: {
                files: [{
                    expand: true,
                    cwd: 'src/icons/vendor/redgate/',
                    src: '**',
                    dest: 'dist/fonts/redgate/'
                }]
            },
            slickFonts: {
                files: [{
                    expand: true,
                    cwd: 'src/carousel/vendor/slick/fonts/',
                    src: '**',
                    dest: 'dist/fonts/slick/'
                }]
            },
            robotoFonts: {
                files: [{
                    expand: true,
                    cwd: 'src/type/vendor/roboto/',
                    src: '**',
                    dest: 'dist/fonts/roboto/'
                }]
            }
        },

        /* Watch scss and js and process when they're updated */
        watch: {
            sass: {
                files: ['src/**/*.scss'],
                tasks: ['sass', 'autoprefixer', 'clean', 'copy']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'uglify']
            }
        }

    });

    // Load task plugins.
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Register the default task.
    grunt.registerTask('default', 'watch');
};
