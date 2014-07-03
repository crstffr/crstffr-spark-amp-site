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
    grunt.loadNpmTasks('grunt-contrib-connect');
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
     * Task: grunt preview
     * Compile the LESS into CSS, copy over other site assets into
     * the preview directory, and then bake the templates into HTML.
     * Used for previewing the source files during development.
     */
    grunt.registerTask('preview', [
        'clean:preview'
        ,'shell:build'
        ,'less:preview'
        ,'copy:preview'
        ,'concurrent:preview'

    ]);

    /**
     * Task: grunt dist
     * Compile the LESS into CSS, copy over other site assets into
     * the dist directory, bake the templates into HTML, convert CRLF
     * into LF, concatenate and minify all CSS, and then process the
     * final HTML files to remove any development only code.
     * Used for preparing the site files for distribution.
     */
    grunt.registerTask('dist', [
        'clean:dist'
        ,'less:dist'
        ,'copy:dist'
        ,'lineending:dist'
        ,'concat:dist'
        ,'cssmin:dist'
        ,'processhtml:dist'
    ]);

    /**
     * Task: grunt server:preview
     * Load a Node.js Connect server with the root folder pointed
     * at the preview directory.  This server is configured to
     * work with the LiveReload capabilities of Grunt Watch.
     * Used for previewing the source files during development.
     */
    grunt.registerTask('server:preview', ['preview', 'connect:preview']);

    /**
     * Task: grunt server:dist
     * Load a Node.js Connect server with the root folder pointed
     * at the dist directory.  LiveReload will not be enabled.
     * Used for reviewing the final dist files before delivery.
     */
    grunt.registerTask('server:dist', ['dist', 'connect:dist']);


    grunt.registerTask('default', 'preview');

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
            preview: ['watch', 'shell:server']
        }

        /**
         * Bower-task: copies Bower installed dependencies into the
         * target directory, in this case, our vendor source.
         */
        ,bower: {
            install: {
                options: {
                    targetDir: 'source/assets/vendor/',
                    install: false,
                    verbose: true,
                    cleanTargetDir: true,
                    cleanBowerDir: false
                }
            }
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
            buildjs: {
                files: ['build.js'],
                tasks: ['shell:build']
            },
            md: {
                files: ['source/**/*.md'],
                tasks: ['shell:build']
            },
            templates: {
                files: ['source/**/*.html'],
                tasks: ['shell:build']
            },
            less: {
                files: ['source/assets/less/*.less'],
                tasks: ['less:preview']
            },
            js: {
                files: ['source/assets/js/**/*.js'],
                tasks: ['copy:preview']
            },
            img: {
                files: ['source/assets/img/**/*'],
                tasks: ['copy:preview']
            }
        }

        /**
         * Contrib-connect: Node.js based web server, used for previewing
         * the frontend code in a simple server environment.  Allows file
         * paths to be declared as absolute if necessary.
         */
        ,connect: {
            preview: {
                options: {
                    port: 9090,
                    hostname: '*',
                    keepalive: true,
                    livereload: true,
                    base: 'public/',
                    open: true
                }
            }
            ,dist: {
                options: {
                    port: 9091,
                    hostname: '*',
                    keepalive: true,
                    base: 'dist/'
                }

            }
        }

        /**
         * Contrib-clean: Deletes directories.
         */
        ,clean: {
            preview: {
                src: ['preview']
            }
            ,dist: {
                src: ['dist']
            }
        }

        /**
         * Contrib-less: Compiles LESS files into CSS files and puts
         * them in a specified destination directory.
         */
        ,less: {
            preview: {
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
            preview: {
                files: [
                    {
                        expand: true,
                        cwd: 'source/assets/js/',
                        src: ['**'],
                        dest: 'public/assets/js/'
                    },{
                        expand: true,
                        cwd: 'source/assets/img/',
                        src: ['**'],
                        dest: 'public/assets/img/'
                    },{
                        expand: true,
                        cwd: 'source/assets/vendor/',
                        src: ['**'],
                        dest: 'public/assets/vendor/'
                    }
                ]
            }
            ,dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'source/assets/js/',
                        src: ['**'],
                        dest: 'dist/assets/js/'
                    },{
                        expand: true,
                        cwd: 'source/assets/img/',
                        src: ['**'],
                        dest: 'dist/assets/img/'
                    },{
                        expand: true,
                        cwd: 'source/assets/vendor/',
                        src: ['**'],
                        dest: 'dist/assets/vendor/'
                    }
                ]
            }
        }

        ,shell: {
            build: {
                options: {
                    stderr: true
                },
                command: 'node build.js'
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
            preview: {
                files: [{
                        expand: true,
                        cwd: 'public/',
                        src: ['**/*.html', '**/*.css', '**/*.js'],
                        dest: 'public/'
                }]
            },
            dist: {
                files: [{
                        expand: true,
                        cwd: 'dist/',
                        src: ['**/*.html', '**/*.css', '**/*.js'],
                        dest: 'dist/'
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