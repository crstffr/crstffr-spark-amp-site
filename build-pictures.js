var Metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');
var markdown = require('metalsmith-markdown');
var ignore = require('metalsmith-ignore');
var easyimage = require('easyimage');
var rmdir = require('rimraf');
var async = require('async');
var path = require('path');
var fs = require('fs');

var resizeQueue = [];
var pictureData = [];
var dataFile = './public/pictures/pictures.json';
var source = 'source/content/pictures/';
var data = loadData(dataFile);
var dest = 'public/pictures/';

// Max width @ quality level (1-100)

var variants = {
    large: '1000@95',
    medium: '500@85',
    small: '200@75'
};

if (!fs.existsSync(dest)) { fs.mkdirSync(dest); }

/**
 * Copy and Resize all pictures
 */

Metalsmith(__dirname)
    .clean(false)
    .source(source)
    .destination(dest)
    .use(ignore('**/*.md'))
    .use(copyAndResizeImages)
    .build(function(err) {
        if (err) throw err;
        removeDeletedFiles();
        buildIndexPage();
    });


/**
 * Create an index.html for pictures
 */
function buildIndexPage() {

    Metalsmith(__dirname)
        .clean(false)
        .source(source)
        .destination(dest)
        .use(ignore(['**/*.jpg', '**/*.png', '**/*.gif']))
        .use(appendPictureData)
        .use(markdown())
        .use(templates({
            engine: 'handlebars',
            default: 'pictures.html',
            directory: './source/templates'
        }))
        .build(function(err) {
            if (err) throw err;
            console.log("Picture index built");
        });
}


function removeDeletedFiles() {

    var i, img, dir, file, changes;

    var publicFiles = getPublicPictureData();

    // Clean the JSON data from any files that are no longer in source

    for (img in data) {
        if (!fs.existsSync(img)) {
            console.log('DELETE', img, 'from JSON data');
            delete data[img];
            changes = true;
        }
    }

    // Remove folders from public that are no longer in the source

    for (i in publicFiles) {

        img = publicFiles[i];

        if (!fs.existsSync(img.src)) {
            dir = 'public' + img.dir;
            console.log('DELETE', dir, 'from public folder');
            rmdir(dir, function(){});
            changes = true;
        }

    }

    if (changes) {
        writeData(data, dataFile);
    } else {
        console.log('No old files to cleanup');
    }

}

function appendPictureData(files, metalsmith, done) {

    files['index.md'].pictures = getPublicPictureData();
    done();

}

function getPublicPictureData() {

    if (pictureData.length) {
        return pictureData;
    }

    var pic, ext, dir, url, file, base,
        mdate, short, size, tags, src,
        data = {}, output = [],
        pictures = getFiles(dest);

    for (var i in pictures) {

        pic = pictures[i];
        pic = pic.replace('//', '/');
        ext = path.extname(pic);
        mdate = getModifiedDate(pic);
        url = pic.replace('public', '');
        dir = path.dirname(url);
        base = dir.split('/').pop();
        file = path.basename(pic, ext);
        size = file.split('-').pop();
        tags = dir.split('/').slice(2,-1);

        src = source.replace('pictures/', '') + dir + ext;
        src = src.replace('//', '/');

        if (!isImage(pic)) { continue; }

        if (!data[dir]) {

            data[dir] = {
                mdate: mdate,
                src: src,
                pic: pic,
                dir: dir,
                base: base,
                sizes: [size],
                ext: ext,
                tags: tags
            }

        } else {

            data[dir].sizes.push(size);

        }

    }

    for (var i in data) {
        output.push(data[i]);
    }

    pictureData = output;
    return output;

}



function copyAndResizeImages(files, metalsmith, done) {

    var copyfiles, newlocation,
        thisfile, basename,
        exists, mdate,
        dir, src, ext;

    for (file in files) {

        thisfile = files[file];
        src = source + file;
        ext = path.extname(file);
        dir = path.dirname(file);
        mdate = getModifiedDate(source + file);
        basename = path.basename(file, ext);
        newlocation = dir + '/' + basename + '/';
        exists = fs.existsSync(dest + newlocation);

        if (!exists || !data[src] || data[src].modified !== mdate) {
            copyfiles = true;
            var original = newlocation + basename + '-full' + ext;
            files[original] = thisfile;
            data[src] = { modified: mdate };
            console.log("Copying: ", newlocation);
        }

        delete files[file];
    }

    if (copyfiles) {

        writeData(data, dataFile);

        metalsmith.write(files, function(){
            resizeImages(files, done);
        });

    } else {

        console.log("No new pictures to copy");

        done();

    }

}


function resizeImages(files, done) {

    var basename,
        quality,
        resize,
        source,
        copy,
        size,
        dir,
        ext;

    for (file in files) {

        ext = path.extname(file);
        dir = path.dirname(file);
        basename = dir.split('/').pop();

        for (variant in variants) {

            resize = variants[variant].split('@');
            quality = resize[1];
            size = resize[0];

            copy = dest + dir + '/' + basename + '-' + variant + ext;
            source = dest + file;

            queueResize({
                src: source,
                dst: copy,
                width: size,
                height: 10000,
                quality: quality
            });
        }
    }

    resizeQueue.push(function(callback){
        callback();
        done();
    });

    async.series(resizeQueue);

}

function queueResize(params) {
    resizeQueue.push(function(callback){
        easyimage.resize(params).then(function(image) {
            console.log('Resized', params.width + 'px @', params.quality + '%', params.dst);
            callback();
        });
    });
}


function getModifiedDate(file) {
    return fs.statSync(file).mtime.toString();
}

function loadData(file){
    var data = {};
    if (fs.existsSync(file)) {
        data = require(file);
    }
    return data;
}

function writeData(data, file) {
    fs.writeFile(file, JSON.stringify(data, null, 4), function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log("JSON saved to " + file);
        }
    });
}


function getFiles(dir,files_){
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_=[];
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name,files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}


function isImage(filename) {
    var extension = filename.split('.').pop().toLowerCase();
    var imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    return imageExtensions.indexOf(extension) > -1;
}