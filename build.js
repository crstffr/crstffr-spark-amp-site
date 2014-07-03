var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var builddate = require('metalsmith-build-date');
var templates = require('metalsmith-templates');
var beautify = require('metalsmith-beautify');
var markdown = require('metalsmith-markdown');
var excerpts = require('metalsmith-excerpts');
var branch = require('metalsmith-branch');
var ignore = require('metalsmith-ignore');
var watch = require('metalsmith-watch');
var less = require('metalsmith-less');

Metalsmith(__dirname)
    .source('source/content/')
    .destination('./public')
    .clean(false)
    .use(builddate())
    .use(markdown())

    .use(permalinks({
        pattern: ':date/:title',
        date: 'YYYY',
        relative: false
    }))
    .use(excerpts())
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

    .build(function(err) {
        if (err) throw err;
    });


function filterImages(filename, properties, index) {
    var extension = filename.split('.').pop().toLowerCase();
    var imageExtensions = [ 'jpg', 'jpeg', 'png' ];
    var notAnImage = imageExtensions.indexOf(extension) == -1;
    return notAnImage;
}