var Metalsmith = require('metalsmith');
var image = require('easyimage');
var path = require('path');
var fs = require('fs');

var dataFile = './public/pictures/pictures.json';
var source = 'source/content/pictures/';
var data = loadData(dataFile);
var dest = 'public/pictures/';

var variants = {
    large: '800',
    medium: '500',
    small: '200',
    tiny: '60'
}


if (!fs.existsSync(dest)) { fs.mkdirSync(dest); }

Metalsmith(__dirname)
    .clean(false)
    .source(source)
    .destination(dest)
    .use(pathModifier)
    .build();


function resizeImages(files) {

    var basename,
        source,
        copy,
        size,
        dir,
        ext;

    for (file in files) {

        ext = path.extname(file);
        dir = path.dirname(file);
        basename = path.basename(file, ext);

        /*
        image.info(dest + file, function(err, info) {
            if (err) throw err;
            console.log(info);
        });
        */

        for (variant in variants) {

            size = variants[variant];
            copy = dest + dir + '/' + variant + ext;
            source = dest + file;

            console.log("Resizing: ", copy);

            image.resize({
                src: source,
                dst: copy,
                width: size
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