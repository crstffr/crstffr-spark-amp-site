module.exports = function (grunt) {


    /**
     * *************************************
     *
     * Load the Plugins
     *
     * *************************************
     */
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-lineending');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-shell');

    /**
     * *************************************
     *
     * Define all of our Grunt Tasks
     *
     * *************************************
     */

    /**
     * Task: grunt scrub
     * Iterates over all source files and converts any CRLF to LF
     */
    grunt.registerTask('scrub', [
        'lineending:source'
    ]);

    /**
     * Task: grunt rebuild
     * Compile the LESS into CSS, copy over other site assets into
     * the public directory, and then bake the templates into HTML.
     * Rebuilds the entire site from scratch
     */
    grunt.registerTask('rebuild', [
        'clean:blog'
        ,'shell:build'
        ,'shell:pictures'
        ,'less:public'
        ,'copy:js'
        ,'copy:img'
        ,'copy:vendor'
    ]);

    grunt.registerTask('default', 'watch');

    /**
     * *************************************
     *
     * Configure GRUNT to do our bidding.
     *
     * *************************************
     */
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            watchserver: ['watch', 'shell:server']
        }

        /**
         * Contrib-watch: file system watcher that triggers an event
         * on file changes, also triggers the livereload server.
         */
        ,watch: {
            options: {
                spawn: false,
                livereload: true
            },
            blog: {
                files: [
                    'build-blog.js',
                    'source/**/*.html',
                    'source/content/articles/**/*.md'
                ],
                tasks: ['shell:build']
            },
            less: {
                files: ['source/assets/less/*.less'],
                tasks: ['less:public']
            },
            js: {
                files: ['source/assets/js/**/*.js'],
                tasks: ['copy:js']
            },
            img: {
                files: ['source/assets/img/**/*'],
                tasks: ['copy:img']
            },
            img: {
                files: ['source/assets/vendor/**/*'],
                tasks: ['copy:vendor']
            },
            pictures: {
                files: [
                    'source/templates/pictures.html',
                    'source/content/pictures/**/*'
                ],
                tasks: ['shell:pictures']
            }
        }

        /**
         * Contrib-clean: Deletes directories.
         */
        ,clean: {
            options: { force: true },
            all: {
                src: [
                    'public/**/*'
                ]
            }
            ,pictures: {
                src: ['public/pictures']
            }
            ,blog: {
                src: [
                    'public/articles',
                    'public/posts',
                    'public/tag'
                ]
            }
        }

        /**
         * Contrib-less: Compiles LESS files into CSS files and puts
         * them in a specified destination directory.
         */
        ,less: {
            public: {
                files: [{
                    expand: true,
                    cwd: 'source/assets/less/',
                    src: ['*.less', '!_*.less'],
                    dest: 'public/assets/css/',
                    ext: '.css'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'source/assets/less/',
                    src: ['*.less', '!_*.less'],
                    dest: 'dist/assets/css/',
                    ext: '.css'
                }]
            }
        }

        /**
         * Contrib-copy: Copies files to and from directories.
         */
        ,copy: {

            js: {
                files: [
                {
                    expand: true,
                    cwd: 'source/assets/js/',
                    src: ['**/*'],
                    dest: 'public/assets/js/'
                }
            ]},
            img: {
                files: [
                {
                    expand: true,
                    cwd: 'source/assets/img/',
                    src: ['**'],
                    dest: 'public/assets/img/'
                }
            ]},
            vendor: {
                files: [
                {
                    expand: true,
                    cwd: 'source/assets/vendor/',
                    src: ['**'],
                    dest: 'public/assets/vendor/'
                }
            ]}

        }

        ,shell: {
            build: {
                options: {
                    stderr: true
                },
                command: 'node build-blog.js'
            },
            pictures: {
                options: {
                    stderr: true
                },
                command: 'node build-pictures.js'
            },
            server: {
                options: {
                    stdout: true,
                    stderr: true
                },
                command: 'cd public && ws'
            }
        }

        /**
         * LineEnding: Converts line ending characters from CRLF to LF.
         */
        ,lineending: {
            source: {
                files: [{
                        expand: true,
                        cwd: 'source/',
                        src: ['**/*.html', '**/*.less', '**/*.js'],
                        dest: 'source/'
                }]
            },
            public: {
                files: [{
                        expand: true,
                        cwd: 'public/',
                        src: ['**/*.html', '**/*.css', '**/*.js'],
                        dest: 'public/'
                }]
            }
        }

        /**
         * Contrib-concat: Combines files into a single file.
         * @TODO: Figure out how to get this to auto-include
         *        the CSS and JS files without needing to
         *        explicitly define them here.
         */
        ,concat: {
            dist: {
                src: [
                    'dist/css/normalize.css',
                    'dist/css/base.css',
                    'dist/css/type.css',
                    'dist/css/helpers.css',
                    'dist/css/columns.css',
                    'dist/css/layout.css',
                    'dist/css/themes.css',
                    'dist/css/modules.css'
                ],
                dest: 'dist/css/concat.css'
            }
        }

        /**
         * Contrib-cssmin:  Minify CSS files by removing whitespace.
         */
        ,cssmin: {
            dist: {
                src: 'dist/css/concat.css',
                dest: 'dist/css/concat.min.css'
            }
        }

        /**
         * ProcessHTML: Parses HTML files and looks for special comment
         * code blocks, replacing or removing the code as specified.
         */
        ,processhtml: {
            options: {
                process: true
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'dist/',
                        src: ['**/*.html'],
                        dest: 'dist/'
                    }
                ]
            }
        }

    });

};