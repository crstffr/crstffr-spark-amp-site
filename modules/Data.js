var RSVP = require('rsvp');
var Firebase = require('firebase');

var logger = require('./Logger').getInstance();
var instance;

function Data(config) {

    if (!config.sitename || config.sitename === '') {
        throw 'Data Class needs a sitename on init';
    }

    var _fb = new Firebase(config.data.firebase.root + config.sitename);

    /**
     *
     * @return {RSVP.Promise}
     * @private
     */
    function _fetch(child) {
        return new RSVP.Promise(function(resolve, reject){
             _node(child).once('value', function(snapshot){
                resolve(snapshot.val());
            });
        });
    }

    /**
     * Return a reference to a Firebase node
     * @param child
     * @return {XMLList}
     * @private
     */
    function _node(child) {
        var node = (child) ? _fb.child(child) : _fb;
        node.fetch = function(){
            return _fetch(child);
        };
        return node;
    }

    return {
        node: _node,
        fetch: _fetch
    };
}


/**
 * Singleton Pattern.  Create first, then getInstances.
 * @type {Object}
 */
module.exports = {
    create: function(a) {
        instance = new Data(a);
        return instance;
    },
    getInstance: function() {
        return instance;
    }
}