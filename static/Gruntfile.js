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
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-bake');



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
        ,'less:preview'
        ,'copy:preview'
        ,'bake:preview'
        //,'connect:preview'
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
        ,'bake:dist'
        ,'lineending:dist'
        ,'concat:dist'
        ,'cssmin:dist'
        ,'processhtml:dist'
        //,'connect:dist'
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



    /**
     * *************************************
     *
     * Configure GRUNT to do our bidding.
     *
     * *************************************
     */
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json')

        /**
         * Bower-task: copies Bower installed dependencies into the
         * target directory, in this case, our vendor source.
         */
        ,bower: {
            install: {
                options: {
                    targetDir: 'source/vendor/',
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
            html: {
                files: ['source/*.html'],
                tasks: ['bake:preview']
            },
            less: {
                files: ['source/less/*.less'],
                tasks: ['less:preview']
            },
            css: {
                files: ['preview/css/*.css']
            },
            js: {
                files: ['source/js/**/*.js'],
                tasks: ['copy:preview']
            },
            img: {
                files: ['source/img/**/*'],
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
                    base: 'preview/',
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
                    cwd: 'source/less/',
                    src: ['*.less', '!_*.less'],
                    dest: 'preview/css/',
                    ext: '.css'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'source/less/',
                    src: ['*.less', '!_*.less'],
                    dest: 'dist/css/',
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
                        cwd: 'source/js/',
                        src: ['**'],
                        dest: 'preview/js/'
                    },{
                        expand: true,
                        cwd: 'source/img/',
                        src: ['**'],
                        dest: 'preview/img/'
                    },{
                        expand: true,
                        cwd: 'source/vendor/',
                        src: ['**'],
                        dest: 'preview/vendor/'
                    }
                ]
            }
            ,dist: {
                files: [
                    {
                        expand: true,
                        cwd: 'source/js/',
                        src: ['**'],
                        dest: 'dist/js/'
                    },{
                        expand: true,
                        cwd: 'source/img/',
                        src: ['**'],
                        dest: 'dist/img/'
                    },{
                        expand: true,
                        cwd: 'source/vendor/',
                        src: ['**'],
                        dest: 'dist/vendor/'
                    }
                ]
            }
        }

        /**
         * Bake: Templating engine that allows the declaration of
         * externally included files.  All HTML files in the root
         * of the source folder will be compiled, as long as they
         * don't start with an _underscore.  _Underscore files are
         * my nomenclature for a partial HTML file.
         */
        ,bake: {
            preview: {
                files: [{
                    expand: true,
                    cwd: 'source/',
                    src: ['*.html', '!_*.html'],
                    dest: 'preview/'
                    /*
                    rename: function(dest, src) {
                      return dest + src.substring(1);
                    }*/
                }]
            }
            ,dist: {
                files: [{
                    expand: true,
                    cwd: 'source/',
                    src: ['*.html', '!_*.html'],
                    dest: 'dist/'
                    /*
                    rename: function(dest, src) {
                      return dest + src.substring(1);
                    }*/
                }]
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
                        cwd: 'preview/',
                        src: ['**/*.html', '**/*.css', '**/*.js'],
                        dest: 'preview/'
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
                        src: ['*.html'],
                        dest: 'dist/'
                    }
                ]
            }
        }

    });

};