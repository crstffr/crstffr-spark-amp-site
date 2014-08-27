var RSVP = require('rsvp');
var Firebase = require('firebase');
var recursive = require('recursive-readdir');
var easyimg = require('easyimage');
var rmdir = require('rimraf');
var async = require('async');
var path = require('path');
var gaze = require('gaze');
var fs = require('fs');

process.on('uncaughtException', function ( err ) {
    console.error('An uncaughtException was found, the program will end.');
    process.exit(1);
});

(function(){

    var _cfg = {
        paths: {
            src: 'source/content/pictures/',
            dst: 'temp/pictures/'
        },
        formats: [
            '.jpg', '.jpeg',
            '.png', '.gif'
        ],
        firebase: {
            root: 'https://brace-images.firebaseio.com/smartamp/'
        }
    };

    var _fb;
    var _data;
    var _pics;

    _init();

    /**
     *
     * @private
     */
    function _init() {

        _fb = new Firebase(_cfg.firebase.root);

        RSVP.hash({
            data: _getData(),
            srcPics: _getPics(_cfg.paths.src),
            dstPics: _getPics(_cfg.paths.dst)
        }).then(_syncLocations);

    }

    /**
     *
     * @param results
     * @private
     */
    function _syncLocations(results) {

        // If pictures exist in SRC but not in FB
            // copy & resize the images
            // collect all information on images
            // add image data to FB

        var srcToFB = new RSVP.Promise(function(resolve, reject) {

            var i = 0;
            var count = results.srcPics.length;

            results.srcPics.forEach(function(picData) {

                var fbImg = _fb.child(picData.id);

                fbImg.once('value', function(snapshot) {

                    i++;

                    if (!snapshot.val()) {

                        // Get information about the image and when we
                        // have it, set the data into firebase.

                        easyimg.info(picData.file).then(function(info) {
                            fbImg.set(picData);
                            fbImg.update(info);
                            fbImg.update({loading: 1, name: null});
                        });

                        _copyImage(picData);
                    }
                });
            });
        });

        // If pictures exist in FB but not in SRC
            // remove images from DST (if there)
            // remove image from FB




        //console.log('Firebase', results.data);
        //console.log('SRC Pictures', results.srcPics);
        //console.log('DST Pictures', results.dstPics);

    }



    function _copyImage(picData) {

        console.log('supposed to copy', picData.id);


    }




    /**
     *
     * @return {RSVP.Promise}
     * @private
     */
    function _getData() {
        return new RSVP.Promise(function(resolve, reject){
            _fb.on('value', function(snapshot){
                resolve(snapshot.val());
            });
        });
    }


    /**
     *
     * @return {RSVP.Promise}
     * @private
     */
    function _getPics(where) {

        return (new RSVP.Promise(function(resolve, reject){

            recursive(where, function(err, files){
                resolve(files);
            });

        })).then(function(files){

            files = files || [];
            var out = [];

            files.forEach(function(file, i){

                var ext = path.extname(file);

                if (_isImage(file, ext)) {

                    var url = file.replace(where, '');
                    var id = url.replace('.', '-');

                    out.push({
                        id: id,
                        url: url,
                        base: path.basename(file, ext),
                        time: _getModifiedDate(file),
                        file: file,
                        ext: ext
                    });
                }
            });

            return out;
        });
    }


    /**
     *
     * @param file
     * @return {Boolean}
     * @private
     */
    function _isImage(filepath, ext) {
        ext = ext || path.extname(filepath);
        return _cfg.formats.indexOf(ext) > -1;
    }

    /**
     *
     * @param file
     * @return {*}
     */
    function _getModifiedDate(filepath) {
        return (new Date(fs.statSync(filepath).mtime.toString())).getTime();
    }


})();

