var RSVP = require('rsvp');
var traverse = require('traverse');
var config = require('./modules/Config');
var Logger = require('./modules/Logger');
var logger = Logger.create(config, config.sitename + '-pictures');

var Local = require('./modules/Local');
var Cloud = require('./modules/Cloud');
var Image = require('./modules/Image');
var Watch = require('./modules/Watch');
var Data = require('./modules/Data');

process.on('SIGINT', function() {
    logger.warn('SIGINT - process interrupted');
    setTimeout(process.exit, 1000);
});

process.on('SIGTERM', function() {
    logger.error('SIGTERM - process terminated');
    setTimeout(process.exit, 1000);
});

process.on('uncaughtException', function(e) {
    logger.error('UncaughtException: ' + e);
    setTimeout(process.exit, 1000);
});

(function(){

    var _local = Local.create(config);
    var _cloud = Cloud.create(config);
    var _watch = Watch.create(config);
    var _data = Data.create(config);
    var _images = {};

    _init();

    /**
     *
     * @private
     */
    function _init() {

        logger.line();
        logger.info('Starting Local <> Remote sync...');

        _watch.start(config.local.source);

        _watch.onCreate(function(f, stat, image){
            // console.log('ON CREATE OUTSIDE');
            var image = new Image(f);
            if (image.valid) {
                _images[f] = image;
            } else if (image.isdir) {
                //image.node.set({empty: true});
            }
        });

        RSVP.hash({
            local: _local.fetch(),
            data: _data.fetch()
        }).then(_syncLocal).catch(function(e) {
            logger.warn('Fetch was rejected: %s', e.message || e);
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

        logger.info('Local Images: %d', results.local.length);

        // Loop over each of the local source pictures, checking for
        // values in Firebase.  If there is no data, then collect
        // it and set it into the database.

        results.local.forEach(function(image, i) {

            _images[image.file] = image;

            try {

                image.getRemoteData().then(function(data){

                    if (!data) {
                        logger.info('%s - NEW', image.data.id);
                        image.saveData();
                        image.upload();
                    }
                });

            } catch(e) {

                logger.error('Error syncing local images: %s', e.message || e);
            }
        });


        // If pictures exist in FB but not in SRC
            // remove images from DST (if there)
            // remove image from FB

        traverse(results.data).forEach(function(x){
            if (x.cloud && x.local) {
                if (_images[x.local.file]) { return; }
                if (x.local.file) {
                    var image = new Image(x.local.file);
                    logger.info('%s - IS MISSING', image.data.id);
                    image.remove();
                }
            }
        });

        return results;

    }




})();

