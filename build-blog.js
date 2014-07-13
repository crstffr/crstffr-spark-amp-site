var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var permalinks = require('metalsmith-permalinks');
var metaobject = require('metalsmith-metaobject');
var templates = require('metalsmith-templates');
var beautify = require('metalsmith-beautify');
var markdown = require('metalsmith-markdown');
var excerpts = require('metalsmith-excerpts');
var branch = require('metalsmith-branch');
var ignore = require('metalsmith-ignore');
var more = require('./modules/more-or-less');

var options = {
    perPage: 100
}

var data = {
    author: {
        name: "Christopher Mason",
        github: "http://github.com/crstffr",
        website: "http://work.quickcodr.com/"
    }
}

Metalsmith(__dirname)
    .clean(false)
    .source('source/content/')
    .destination('./public')
    .use(ignore('pictures/**/*'))
    .use(collections({
        posts: {
            pattern: 'articles/*',
            sortBy: 'date',
            reverse: true
        }
    }))
    .use(metaobject(data))
    .use(blogIndexList)
    .use(blogTagLists)
    .use(buildDate)
    .use(markdown())
    .use(more())
    .use(excerpts())
    .use(branch('articles/*')
        .use(permalinks({
            pattern: 'posts/:date/:title',
            date: 'YYYY',
            relative: false
        }))
    )
    .use(branch(filterImages)
        .use(templates({
            engine: 'handlebars',
            default: 'post.html',
            directory: './source/templates',
            partials: {
                tags: 'partials/tags',
                aside: 'partials/aside',
                about: 'partials/about',
                header: 'partials/header',
                footer: 'partials/footer'
            }
        }))
    )
    .build(function(err) {
        if (err) throw err;
    });



function buildDate(files, metalsmith, done) {
    var data = metalsmith.metadata();
    data.builddate = new Date();
    done();
}

function blogIndexList(files, metalsmith, done) {
    var index = files['index.md'],
        posts = metalsmith.data.posts,
        perPage = options.perPage;

    index.posts = posts.slice(0,perPage);
    index.currentPage = 1;
    index.numPages = Math.ceil(posts.length / perPage);
    index.pagination = [];

    for (var i = 1; i <= index.numPages; i++) {
        index.pagination.push({
            num: i,
            url: (1 == i) ? '/' : '/index/' + i
        });

        if (i > 1) {
            files['index/' + i + '/index.md'] = {
                template: 'list.html',
                mode: '0644',
                contents: '',
                title: 'Page ' + i + ' of ' + index.numPages,
                posts: posts.slice((i-1) * perPage, ((i-1) * perPage) + perPage),
                currentPage: i,
                numPages: index.numPages,
                pagination: index.pagination
            }
        }
    }

    done();
}


function blogTagLists(files, metalsmith, done) {
    var tags = {};

    for (p in metalsmith.data.posts) {
        for (t in metalsmith.data.posts[p].tags) {
            tag = metalsmith.data.posts[p].tags[t];
            if (! tags[tag]) {
                tags[tag] = [];
            }

            tags[tag].push(metalsmith.data.posts[p]);
        }
    }

    for (tag in tags) {
        files['tag/' + tag + '/index.md'] = {
            template: 'list-tag.html',
            tag: tag,
            mode: '0644',
            contents: '',
            title: "Posts tagged '" + tag + "'",
            posts: tags[tag]
        }
    }

    done();
}


function filterImages(filename, properties, index) {
    var extension = filename.split('.').pop().toLowerCase();
    var imageExtensions = [ 'jpg', 'jpeg', 'png' ];
    var notAnImage = imageExtensions.indexOf(extension) == -1;
    return notAnImage;
}



