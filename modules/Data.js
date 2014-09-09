var RSVP = require('rsvp');
var Firebase = require('firebase');
var TokenGenerator = require('firebase-token-generator');
var logger = require('./Logger').getInstance();
var uuid = require('node-uuid');
var instance;

function Data(config) {

    if (!config.sitename || config.sitename === '') {
        throw 'Data Class needs a sitename on init';
    }

    if (!config.firebase.api_secret) {
        throw 'Firebase secret not defined in the config';
    }

    var root = new Firebase(config.firebase.root + config.sitename);
    var generator = new TokenGenerator(config.firebase.api_secret);
    var token = generator.createToken({uid: config.firebase.server_uid});

    root.auth(token, function(error) {
        if (error) {
            logger.error('Unable to authenticate with Firebase, invalid token');
            throw 'No database connection';
        }
    });

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
        var node = (child) ? root.child(child) : root;
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