var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var templates = require('metalsmith-templates');
var markdown = require('metalsmith-markdown');
var ignore = require('metalsmith-ignore');
var watch = require('metalsmith-watch');

Metalsmith(__dirname)
    .source('./source')
    .destination('./public')
    .use(ignore([
        'less/*'
    ]))
    .use(markdown())
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
    .use(templates({
        engine: 'handlebars',
        directory: './source/templates'
    }))
    .use(watch({
        pattern : [
            '**/*.md'
        ],
        livereload: true
    }))
    .build();