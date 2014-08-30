var LocalStuff = require('./modules/LocalStuff');
var CloudStuff = require('./modules/CloudStuff');
var DataStuff = require('./modules/DataStuff');
var Logger = require('./modules/Logger');
var config = require('./config');
var Gaze = require('gaze').Gaze;
var gaze = require('gaze');
var RSVP = require('rsvp');

var logger = new Logger(config.sitename + '-pictures');

process.on('uncaughtException', function(e) {
    logger.error('UncaughtException: ' + e);
    setTimeout(function(){
        process.exit(1);
    }, 1000);
});

(function(){

    var _data;
    var _pics;
    var _cloud;
    var _local;

    _init();

    /**
     *
     * @private
     */
    function _init() {

        logger.info('-------------------------------');
        logger.info('Starting image watch process...');
        logger.info('Starting Local <> Remote sync...');

        _data = new DataStuff(config.sitename, config.data, logger);
        _cloud = new CloudStuff(config.sitename, config.cloud, logger);
        _local = new LocalStuff(config.sitename, config.local, logger);

        var _fetchAll = RSVP.hash({
            local: _local.fetch(),
            cloud: _cloud.fetch()
        });

        _fetchAll.then(_syncLocal).catch(function(error){
            logger.warn('Fetch was rejected: %s', error.message || error);
        });

        logger.info('Starting the Gaze watcher...');


//       gaze([config.local.source + '*.*', config.local.source + '**/*.*'], function(err, watcher){
//
//           watcher.on('added', function(filepath) {
//               logger.info('ADDED: %s', filepath);
//           });
//
//           watcher.on('changed', function(filepath) {
//               logger.info('CHANGED: %s', filepath);
//           });
//
//           watcher.on('deleted', function(filepath) {
//               logger.info('DELETED: %s', filepath);
//           });
//
//
//       });

        var gaze = new Gaze(['*.*', '**/*', '**', '**/*.*'], {
            cwd: config.local.source,
            mode: 'poll'
        });

        // Files have all started watching
        gaze.on('ready', function(watcher) {

            logger.info('Gaze is ready');

            watcher.on('all', function(event, filepath){

                logger.info(event, filepath);

            });

            watcher.on('error', function(err){

                logger.error('Gaze error: %s', err);

            });

        });

    }

    /**
     *
     * @param results
     * @private
     */
    function _syncLocal(results) {

        // If pictures exist in SRC but not in FB
            // copy & resize the images
            // collect all information on images
            // add image data to FB

        var busy = false;

        logger.info('Fetched Local images: %d', results.local.length);
        logger.info('Fetched Cloud images: %d', results.cloud.length);

        // Loop over each of the local source pictures, checking for
        // values in Firebase.  If there is no data, then collect
        // it and set it into the database.

        results.local.forEach(function(picData, i) {

            try {

                var imgRef = _data.node(picData.id);

                _data.fetch(picData.id).then(function(results) {

                    var node = results.node;
                    var data = results.data;

                    if (!data) {

                        busy = true;

                        // Get information about the image and when we
                        // have it, set the data into firebase.

                        logger.info('%s - NEW', picData.id);

                        node.setLocalData(picData);

                        _cloud.upload(picData).then(function(response) {

                            logger.info('%s - UPLOADED', picData.id);
                            node.update({cloud: response});

                        }).catch(function(error){

                            logger.error('%s - ERROR (%s)', picData.id, error);
                            node.remove();

                        });

                    }

                });

            } catch(e) {
                logger.error('Error processing local images: %s', e);
            }
        });

        if (busy === false) {
            logger.info('All local images in sync');
        }

        // If pictures exist in FB but not in SRC
            // remove images from DST (if there)
            // remove image from FB

    }

})();

