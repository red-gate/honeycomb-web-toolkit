module.exports = function(grunt) {

    grunt.initConfig({

        /* Sass configuration */
        sass: {
            dist: {
                options: {
                    style: 'compressed',
                    sourcemap: 'auto'
                },
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['honeycomb.scss'],
                    dest: 'dist',
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
                src: ['dist/honeycomb.css']
            }
        },

        /* JSHint - Check JS syntax */
        jshint: {
            options: {
                loopfunc: true,
                esnext: true
            },
            scripts: ['src/**/*.js', '!src/*/vendor/**/*'],
        },

        /* Uglify - Minify JavaScript */
        uglify: {
            options: {
                mangle: true
            },
            scripts: {
                files: {
                    'dist/honeycomb.min.js' : 'dist/honeycomb.js'
                }
            }
        },

        /* Browserify - Require modules (Babel to transpile ES2015 to ES5) */
        browserify: {
            dist: {
                options: {
                    transform: [
                        ['babelify', {}]
                    ]
                },
                files: {
                    'dist/honeycomb.js': 'src/honeycomb.js'
                }
            }
        },

        clean: {
            fonts: ['dist']
        },

        copy: {
            fonts: {
                files: [{
                    expand: true,
                    cwd: "src/type",
                    dest: "dist/type",
                    src: ["**/*.eot", "**/*.ttf", "**/*.woff"]
                }, {
                    expand: true,
                    cwd: "src/icons",
                    dest: "dist/icons",
                    src: ["**/*.eot", "**/*.ttf", "**/*.woff"]
                }]
            },

            images: {
                files: [{
                    expand: true,
                    cwd: "src/lightbox",
                    dest: "dist/lightbox",
                    src: ["**/*.gif", "**/*.png", "**/*.svg"]
                }, {
                    expand: true,
                    cwd: "src/icons",
                    dest: "dist/icons",
                    src: ["**/*.gif", "**/*.png", "**/*.svg"]
                }, {
                    expand: true,
                    cwd: "src/navigation",
                    dest: "dist/navigation",
                    src: ["**/*.gif", "**/*.png", "**/*.svg"]
                }, {
                    expand: true,
                    cwd: "src/carousel",
                    dest: "dist/carousel",
                    src: ["**/*.gif", "**/*.png", "**/*.svg"]
                }, {
                    expand: true,
                    cwd: "src/sharing",
                    dest: "dist/sharing",
                    src: ["**/*.gif", "**/*.png", "**/*.svg"]
                }, {
                    expand: true,
                    cwd: "src/blockquote",
                    dest: "dist/blockquote",
                    src: ["**/*.gif", "**/*.png", "**/*.svg"]
                }, {
                    expand: true,
                    cwd: "src/base",
                    dest: "dist/base",
                    src: ["**/*.gif", "**/*.png", "**/*.svg"]
                }]
            }
        },

        /* Watch scss and js and process when they're updated */
        watch: {
            sass: {
                files: ['src/**/*.scss'],
                tasks: ['sass', 'autoprefixer']
            },
            js: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'browserify', 'uglify']
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
    grunt.loadNpmTasks('grunt-browserify');

    // Register the default task.
    grunt.registerTask('default', 'watch');

    // Build task
    grunt.registerTask('build', ['clean', 'sass', 'autoprefixer', 'copy', 'jshint', 'browserify', 'uglify']);
};
