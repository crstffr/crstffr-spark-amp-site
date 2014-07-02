var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var builddate = require('metalsmith-build-date');
var templates = require('metalsmith-templates');
var beautify = require('metalsmith-beautify');
var markdown = require('metalsmith-markdown');
var branch = require('metalsmith-branch');
var ignore = require('metalsmith-ignore');
var watch = require('metalsmith-watch');
var less = require('metalsmith-less');

Metalsmith(__dirname)
    .source('./source')
    .destination('./public')
    .use(less({
        pattern: ['**/*.less', '!**/_*.less'],
        parse: {
            paths: [__dirname + '/source/assets/less']
        }
    }))
    .use(builddate())
    .use(markdown())
    .use(beautify({
        "js": false,
        "html": {
            "wrap_line_length": 80
        }
    }))
    .use(permalinks({
        pattern: ':date/:title',
        date: 'YYYY',
        relative: false
    }))
    .use(collections({
        articles: {
            pattern: 'content/**/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(branch(filterImages)
        .use(templates({
            engine: 'handlebars',
            directory: './source/templates',
            partials: {
                aside: 'partials/aside',
                header: 'partials/header',
                footer: 'partials/footer'
            }
        }))
    )
    .use(ignore([
        'templates/*'
    ]))

//    .use(watch({
//        pattern : [
//            '**/*.md'
//        ],
//        livereload: true
//    }))

    .build(function(err) {
        if (err) throw err;
    });


function filterImages(filename, properties, index) {
    var extension = filename.split('.').pop().toLowerCase();
    var imageExtensions = [ 'jpg', 'jpeg', 'png' ];
    var notAnImage = imageExtensions.indexOf(extension) == -1;
    return notAnImage;
}