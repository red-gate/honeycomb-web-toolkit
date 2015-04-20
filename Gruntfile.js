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
                    cwd: 'src/css',
                    src: ['**/*.scss', '!vendor/**/*'],
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
                src: ['dist/css/isw.css']
            }
        },

        /* JSHint - Check JS syntax */
        jshint: {
            options: {
                loopfunc: true,
                expr: true
            },
            scripts: ['src/js/**/*.js', '!src/js/vendor/**/*'],
        },

        /* Uglify - Concatenate and minify JavaScript */
        uglify: {
            options: {
                sourceMap: true,
                mangle: true
            },
            scripts: {
                files: {
                    'dist/js/isw.min.js' : [
                        'src/js/vendor/**/*.js',
                        '!src/js/vendor/modernizr.min.js',
                        'src/js/isw/**/*.js'
                    ]
                }
            }
        },

        /* Watch scss and js and process when they're updated */
        watch: {
            sass: {
                files: ['src/css/**/*.scss'],
                tasks: ['sass', 'autoprefixer']
            },
            js: {
                files: ['src/js/**/*.js'],
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

    // Register the default task.
    grunt.registerTask('default', 'watch');
};
