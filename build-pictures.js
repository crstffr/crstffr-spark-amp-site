var Metalsmith = require('metalsmith');
var image = require('easyimage');
var path = require('path');
var fs = require('fs');

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

Metalsmith(__dirname)
    .clean(false)
    .source(source)
    .destination(dest)
    .use(pathModifier)
    .build();


function resizeImages(files) {

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

            console.log("Resizing", size + 'px @', quality + '%', dir + '/' + variant + ext);

            image.resize({
                src: source,
                dst: copy,
                width: size,
                height: 10000,
                quality: quality
            }, function(){

            });


        }




    }
}



function pathModifier(files, metalsmith, done) {

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
            resizeImages(files);
        });
    } else {
        console.log("No new pictures to copy");
    }

    done();

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