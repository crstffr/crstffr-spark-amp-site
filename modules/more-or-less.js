var extname = require('path').extname;

module.exports = function(options) {
    options = options || {};
    var ext = options.ext || 'html',
        regexp = options.regexp || /\s*<!--\s*more\s*-->/,
        key = options.key || 'less';

    ext = ext[0] === '.' ? ext : '.' + ext;
    if (typeof regexp === 'string') {
        regexp = new RegExp(regexp);
    }

    return function(files, metalsmith, done) {
        Object.keys(files).forEach(function(file) {

            var contents = files[file].contents,
                hasmore,
                index;

            if (extname(file) !== ext || !contents) {
                return;
            }

            index = contents.toString().search(regexp);
            hasmore = (index > -1);

            files[file][key] = hasmore ? contents.slice(0, index) : contents;
            files[file]['hasmore'] = hasmore;
        });
        done();
    };
};