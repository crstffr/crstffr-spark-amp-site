var Firebase = require('firebase');
var easyimg = require('easyimage');
var RSVP = require('rsvp');

module.exports = function(sitename, config, logger) {

    if (!sitename || sitename === '') {
        throw 'DataStuff needs to be passed a site name on init';
    }

    var _fb = new Firebase(config.firebase.root + sitename);

    /**
     *
     * @return {RSVP.Promise}
     * @private
     */
    function _fetch(child) {
        return new RSVP.Promise(function(resolve, reject){
            var node = _node(child);
            node.once('value', function(snapshot){
                resolve({
                    node: node,
                    data: snapshot.val()
                });
            });
        });
    }


    function _setLocalData(picData) {
        var node = this;
        return easyimg.info(picData.file).then(function(info) {
            node.set({local: info});
            node.update({local: picData});
        });
    }

    function _setCloudData() {

    }

    /**
     * Return a reference to a Firebase node
     * @param child
     * @return {XMLList}
     * @private
     */
    function _node(child) {
        var node = (child) ? _fb.child(child) : _fb;
        node.setLocalData = _setLocalData;
        return node;
    }

    return {
        node: _node,
        fetch: _fetch,
        setLocalData: _setLocalData
    };
}