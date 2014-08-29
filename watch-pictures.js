var LocalStuff = require('./modules/LocalStuff');
var CloudStuff = require('./modules/CloudStuff');
var DataStuff = require('./modules/DataStuff');
var Logger = require('./modules/Logger');
var Firebase = require('firebase');
var easyimg = require('easyimage');
var config = require('./config');
var RSVP = require('rsvp');
var gaze = require('gaze');

process.on('uncaughtException', function(e) {
    console.error('ERROR: ', e);
    process.exit(1);
});

(function(){

    var _fb;
    var _data;
    var _pics;
    var _cloud;
    var _local;
    var _logger;

    _init();

    /**
     *
     * @private
     */
    function _init() {

        _logger = new Logger(config.sitename + '-pictures');

        _logger.info('This is info');
        _logger.warn('This is warn');
        _logger.error('This is error');

        _fb = new Firebase(config.data.firebase.root + config.sitename);

        _data = new DataStuff(config.sitename, config.data, _logger);
        _cloud = new CloudStuff(config.sitename, config.cloud, _logger);
        _local = new LocalStuff(config.sitename, config.local, _logger);

        RSVP.hash({
            data: _getData(),
            local: _local.fetch(),
            cloud: _cloud.fetch()
        }).then(_syncLocations);


        _cloud.fetch().then(function(files){
            console.log('Cloud files', files.length);
        }).catch(function(error){
            console.log('Cant fetch files:', error.message);
        });

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

            // Loop over each of the local source pictures, checking for
            // values in Firebase.  If there is no data, then collect
            // it and set it into the database.

            results.local.forEach(function(picData) {

                try {

                    var imgRef = _fb.child(picData.id);

                    imgRef.once('value', function(snapshot) {

                        var data = snapshot.val();

                        if (!data) {

                            // Get information about the image and when we
                            // have it, set the data into firebase.

                            easyimg.info(picData.file).then(function(info) {
                                imgRef.set({local: info});
                                imgRef.update({local: picData});
                            });

                            // Now upload the image to the Cloud

                            _cloud.upload(picData).then(function(response){

                                console.log('Success uploading', picData.id);
                                imgRef.update({cloud: response});

                            }).catch(function(error){

                                console.log('Error uploading', picData.id, error);
                                imgRef.remove();

                            })


                        }
                    });

                } catch(e) {
                    console.log('ERROR: ', e);
                }
            });
        });

        // If pictures exist in FB but not in SRC
            // remove images from DST (if there)
            // remove image from FB




        //console.log('Firebase', results.data);
        //console.log('SRC Pictures', results.srcPics);
        //console.log('DST Pictures', results.dstPics);

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

})();

