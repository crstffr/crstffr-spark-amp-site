var Metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');
var markdown = require('metalsmith-markdown');
var ignore = require('metalsmith-ignore');
var image = require('easyimage');
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
    large: '800@85',
    medium: '500@80',
    small: '200@75',
    tiny: '60@55'
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
        });
}


function appendPictureData(files, metalsmith, done) {

    if (!pictureData.length) {
        collectPictureData();
    }

    for (file in files) {
        files[file].pictures = pictureData;
    }

    // console.log(pictureData);
    // console.log(files);

    done();
}


function collectPictureData() {

    var pic,
        ext,
        dir,
        file,
        base,
        mdate,
        short;

    var pictures = getFiles('public/pictures');

    for (var i in pictures) {

        pic = pictures[i];
        ext = path.extname(pic);
        mdate = getModifiedDate(pic);
        short = pic.replace('public', '');
        base = path.basename(pic, ext);
        dir = path.dirname(short);

        if (!isImage(pic)) { continue; }

        pictureData.push({
            mdate: mdate,
            file: short,
            dir: dir,
            base: base,
            ext: ext
        });
    }

    return pictureData;

}



function copyAndResizeImages(files, metalsmith, done) {

    var copyfiles,
        newlocation,
        thisfile,
        basename,
        exists,
        mdate,
        dir,
        ext;

    for (file in files) {

        thisfile = files[file];

        ext = path.extname(file);
        dir = path.dirname(file);
        mdate = getModifiedDate(source + file);
        basename = path.basename(file, ext);
        newlocation = dir + '/' + basename + '/';
        exists = fs.existsSync(dest + newlocation);

        if (!exists || !data[file] || data[file].modified !== mdate) {

            copyfiles = true;
            var original = newlocation + 'original' + ext;
            files[original] = thisfile;

            data[file] = { modified: mdate };
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
        basename = path.basename(file, ext);

        for (variant in variants) {

            resize = variants[variant].split('@');
            quality = resize[1];
            size = resize[0];

            copy = dest + dir + '/' + variant + ext;
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
        image.resize(params).then(function(image) {
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