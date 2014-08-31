var fs = require('fs');
var path = require('path');
var extend = require('extend');
var easyimg = require('easyimage');
var config = require('./Config');
var logger = require('./Logger').getInstance();

module.exports = function(file) {

    if (!_isValid()) { return false; }

    var img = this;

    this.file = file;
    this.valid = _isValid();
    this.data = _getLocalData();

    var _data = require('./Data').getInstance();
    var _cloud = require('./Cloud').getInstance();
    var _node = _data.node(img.data.id);

    /**
     * Upload the image file to the cloud storage service,
     * adding the response data to the database when it
     * is completed.
     */
    this.upload = function() {

        logger.info('%s - UPLOADING...', img.data.id);

        _cloud.upload(img).then(function(response) {

            logger.info('%s - UPLOAD COMPLETE', img.data.id);
            _node.update({cloud: response});

        }).catch(function(e) {
            logger.error('%s - UPLOAD ERROR (%s)', img.data.id, e.message || e);
            _node.remove();
        });
    };

    /**
     * Set the local image data into the database.
     */
    this.saveData = function() {
        _node.update({local: img.data});
        easyimg.info(img.file).then(function(info) {
            _node.update({local: extend({}, img.data, info)});
        });
    };

    /**
     *
     * @return {RSVP.Promise}
     */
    this.getRemoteData = function() {
        return _node.fetch();
    }

    /**
     * Remove the file information from the database and
     * delete the file from the cloud storage service.
     *
     */
    this.remove = function() {

        logger.info('%s - REMOVING...', img.data.id);

        _cloud.remove(img.data.cid).then(function(results){

            _node.remove();
            logger.info('%s - REMOVE COMPLETE', img.data.id);

        }).catch(function(e){
            logger.error('%s - REMOVE ERROR (%s)', img.data.id, e.message || e);
        });
    }

    /**
     *
     * @return {Object}
     * @private
     */
    function _getLocalData() {

        var ext, url, dir, base, name, time, id, cid;

        try {

            ext = path.extname(img.file);
            url = img.file.replace(config.local.source, '');
            dir = path.dirname(url) + '/';
            base = path.basename(img.file, ext);
            name = path.basename(img.file);

            if (fs.existsSync(img.file)) {
                time = _getModifiedDate(img.file);
            }

            id = dir + base;
            id = id.replace('.', '-');
            id = id.replace('&', 'and');
            cid = config.sitename + '/' + id;

        } catch(e) {
            logger.error(e.message || e);
        }

        return {
            id: id,
            cid: cid,
            url: url,
            dir: dir,
            name: name,
            base: base,
            time: time,
            file: img.file,
            ext: ext
        };

    }


    /**
     * Checks file extension against the config values
     * @return {Boolean}
     * @private
     */
    function _isValid() {
        var ext = path.extname(file).toLowerCase();
        return (config.image.formats.indexOf(ext) > -1);
    }

    /**
     * Gets a timestamp of the last modified date of a file
     * @param file
     * @return {*}
     */
    function _getModifiedDate(file) {
        return (new Date(fs.statSync(file).mtime.toString())).getTime();
    }

}