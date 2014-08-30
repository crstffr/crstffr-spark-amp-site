var Cloudinary = require('cloudinary');
var RSVP = require('rsvp');
var util = require('util');

module.exports = function(sitename, config, logger) {

    if (!sitename || sitename === '') {
        throw 'CloudStuff needs to be passed a site name on init';
    }

    Cloudinary.config(config);

    /**
     *
     * @return {RSVP.Promise}
     * @private
     */
    function _fetch() {

        return new RSVP.Promise(function(resolve, reject){

            Cloudinary.api.resources(function(results){
                (results.error) ? reject(results.error) : resolve(results.resources);
            },{
                max_results: 500,
                type: 'upload',
                prefix: sitename
            });
        });
    }


    /**
     *
     * @param fileData
     * @return {RSVP.Promise}
     * @private
     */
    function _upload(fileData) {

        return new RSVP.Promise(function(resolve, reject){

            if (!fileData.id) {
                reject('CloudStuff.upload - File data does not have an ID');
                return false;
            }

            if (!fileData.file) {
                reject('CloudStuff.upload - File data does not have a file path');
                return false;
            }

            Cloudinary.uploader.upload(fileData.file, function(results){
                (results.error) ? reject(results.error) : resolve(results);
            },{
                crop: config.sizes.full.crop,
                width: config.sizes.full.width,
                height: config.sizes.full.height,
                public_id: _publicId(fileData),
                eager: [ config.sizes.thumb ],
                invalidate: true,
                overwrite: true,
                exif: true
            });

            return true;

        });

    }


    /**
     * Generate the public ID for an image, which appends the sitename
     * to the beginning of the image ID.
     *
     * @param fileData
     * @return {String}
     * @private
     */
    function _publicId(fileData) {
        return sitename + '/' + fileData.id;
    }


    /**
     * Remove a single file
     *
     * @param fileData
     * @return {RSVP.Promise}
     * @private
     */
    function _remove(fileData) {

        if (util.isArray(fileData)) { throw 'CloudStuff.remove only takes fileData objects'; }

        return new RSVP.Promise(function(resolve, reject){
            Cloudinary.api.delete_resources([fileData.public_id], function(results){
                (results.error) ? reject(results.error) : resolve(results);
            });
        });
    }


    /**
     * Loop over an array of files and upload each one in separate calls.
     * @param arrayOfFiles
     * @return {RSVP.Promise}
     * @private
     */
    function _uploadFiles(arrayOfFiles) {

        if (!util.isArray(arrayOfFiles)) { throw 'CloudStuff.uploadFiles only takes arrays'; }

        var promises = [];

        arrayOfFiles.forEach(function(fileData){
            promises.push(_upload(fileData));
        });

        return RSVP.all(promises);
    }


    /**
     * Loop over an array of files and remove them in one batch call.
     * @param arrayOfFiles
     * @return {RSVP.Promise}
     * @private
     */
    function _removeFiles(arrayOfFiles) {

        if (!util.isArray(arrayOfFiles)) { throw 'CloudStuff.removeFiles only takes arrays'; }

        var ids = [];

        arrayOfFiles.forEach(function(fileData){
            ids.push(_publicId(fileData));
        });

        return new RSVP.Promise(function(resolve, reject){
            Cloudinary.api.delete_resources(ids, function(results){
                (results.error) ? reject(results.error) : resolve(results);
            });
        });
    }


    return {
        fetch: _fetch,
        upload: _upload,
        remove: _remove,
        uploadFiles: _uploadFiles,
        removeFiles: _removeFiles
    };

}