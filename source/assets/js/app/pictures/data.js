window.App = window.App || {};

(function() {

    var instance;

    function Data(config) {

        var _self = this;
        var _root = new Firebase(config.data.firebase.root + config.sitename);

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
            var node = (child) ? _root.child(child) : _root;
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

    window.App.Data = {
        create: function(a) {
            instance = new Data(a);
            return instance;
        },
        getInstance: function() {
            return instance;
        }
    }

}());