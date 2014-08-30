var RSVP = require('rsvp');
var recursive = require('recursive-readdir');
var path = require('path');
var util = require('util');
var fs = require('fs');

module.exports = function(sitename, config, logger) {

    if (!sitename || sitename === '') {
        throw 'LocalStuff needs to be passed a site name on init';
    }

    /**
     *
     * @return {RSVP.Promise}
     * @private
     */
    function _fetch(where) {

        where = where || config.source;

        return (new RSVP.Promise(function(resolve, reject){

            recursive(where, function(err, files){
                (err) ? reject(err) : resolve(files);
            });

        })).then(function(files){

            files = files || [];

            var out = [];

            files.forEach(function(file, i){
                if (_isImage(file)) {
                    out.push(_getFileData(file));
                }
            });

            return out;
        });
    }


    /**
     *
     * @param file
     * @return {Object}
     * @private
     */
    function _getFileData(file) {

        var ext = path.extname(file);
        var url = file.replace(config.source, '');
        var dir = path.dirname(url) + '/';
        var base = path.basename(file, ext);
        var name = path.basename(file);
        var time = _getModifiedDate(file);
        var id = (dir + base).replace('.', '-');

        return {
            id: id,
            url: url,
            dir: dir,
            name: name,
            base: base,
            time: time,
            file: file,
            ext: ext
        };
    }


    /**
     *
     * @param file
     * @return {Boolean}
     * @private
     */
    function _isImage(filepath, ext) {
        ext = ext || path.extname(filepath);
        return config.formats.indexOf(ext) > -1;
    }

    /**
     *
     * @param file
     * @return {*}
     */
    function _getModifiedDate(filepath) {
        return (new Date(fs.statSync(filepath).mtime.toString())).getTime();
    }

    return {
        fetch: _fetch,
        getfileData: _getFileData
    }



}