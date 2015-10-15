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
                loopfunc: true,
                expr: true
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
            fonts: {
                files: [{
                    expand: true,
                    cwd: 'src/icons/vendor/redgate/',
                    src: '**',
                    dest: 'dist/fonts/redgate/'
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
