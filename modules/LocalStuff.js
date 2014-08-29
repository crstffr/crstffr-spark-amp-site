var RSVP = require('rsvp');
var recursive = require('recursive-readdir');
var path = require('path');
var util = require('util');
var fs = require('fs');

module.exports = function(sitename, config, logger) {

    var CONFIG = config;
    CONFIG.sitename = sitename;

    if (!sitename || sitename === '') {
        throw 'LocalStuff needs to be passed a site name on init';
    }

    /**
     *
     * @return {RSVP.Promise}
     * @private
     */
    function _fetch(where) {

        where = where || CONFIG.source;

        return (new RSVP.Promise(function(resolve, reject){

            recursive(where, function(err, files){
                (err) ? reject(err) : resolve(files);
            });

        })).then(function(files){

            try {

                files = files || [];
                var out = [];

                files.forEach(function(file, i){

                    var ext = path.extname(file);

                    if (_isImage(file, ext)) {

                        var url = file.replace(where, '');
                        var dir = path.dirname(url) + '/';
                        var base = path.basename(file, ext);
                        var name = path.basename(file);
                        var time = _getModifiedDate(file);
                        var id = (dir + base).replace('.', '-');

                        out.push({
                            id: id,
                            url: url,
                            dir: dir,
                            name: name,
                            base: base,
                            time: time,
                            file: file,
                            ext: ext
                        });
                    }
                });

            } catch(e) {
                console.log('ERROR: ', e);
            }

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
        return CONFIG.formats.indexOf(ext) > -1;
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
        fetch: _fetch
    }



}