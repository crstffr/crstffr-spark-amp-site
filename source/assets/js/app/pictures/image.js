window.App = window.App || {};

(function() {

    var instance;

    function Image(data) {

        var _self = this;
        var _instances = [];
        var _data = App.Data.getInstance();
        var _view = App.View.getInstance();
        var _ready;

        this.data = data;
        this.id = data.local.id;
        this.node = _data.node(this.id);

        _ready = new RSVP.Promise(function(resolve){

            if (_hasAllData()) {
                resolve();
                return;
            }

            _self.node.on('child_added', function(snapshot){
                var name = snapshot.name();
                var data = snapshot.val();
                _self.data[name] = data;
                switch (name) {
                    case 'local':
                        _setSizes();
                        break;
                    case 'cloud':
                        resolve();
                        break;
                }
            });
        });

        _self.node.on('child_changed', function(snapshot){
            var name = snapshot.name();
            var data = snapshot.val();
            _self.data[name] = data;
            if (name === 'local') {
                _setSizes();
            }
        });


        this.ready = function() {
            return _ready;
        }


        this.getInstance = function(name) {
            for (var i = 0; i < _instances.length; i++) {
                if (_instances[i].name === name) {
                    return _instances[i];
                }
            }
        }


        this.destroy = function() {
            _instances.forEach(function(instance){
                instance.remove();
            });
            _instances = null;
        }


        /**
         *
         * @param name
         * @param opts
         */
        this.instance = function(name, opts){

            this.config = $.extend({}, {
                width: 100,
                cropt: 'fit',
                onClick: function(){},
                onLoad: function(){}
            }, opts);

            var _inst = this;

            this.name = name;
            this.loaded = false;

            this.id = _self.id;
            this.data = _self.data;
            this.url = _buildUrl(this.config);
            this.size = _dimensions(this.config.width);

            this.$elem = $('<img class="image"/>');

            this.load = _load;
            this.remove = _remove;
            this.resize = _resize;

            _resize();

            /**
             * Set the SRC of the image element to the URL, returning a
             * promise that is resolved when the image is loaded.
             *
             * @param delay
             * @return {RSVP.Promise}
             */
            function _load(delay){

                delay = parseInt(delay || 0, 10);

                if (_inst.loaded) {
                    return new RSVP.Promise(function(resolve){ resolve(); });
                }

                return new RSVP.Promise(function(resolve){

                    _inst.$elem.on('load', function() {
                        _inst.config.onLoad();
                        _inst.loaded = true;
                        resolve();
                    });

                    _ready.then(function(){

                        setTimeout(function(){
                            _inst.$elem.attr('src', _inst.url);
                        }, delay);

                    });
                });
            }

            /**
             * Given the config width of this instance, calculate the
             * width and height based upon the ratio calculated from
             * the local data retrieved from the file.
             */
            function _resize() {
                var size = _dimensions(_inst.config.width);
                _inst.$elem.width(size.w);
                _inst.$elem.height(size.h);
            }

            function _remove() {
                console.log('Removing', _inst.id, _inst.name);
                _inst.$elem.remove();
            }

            _instances.push(this);

        }


        function _buildUrl(opts) {

            var mods = [];
            opts = opts || {};

            opts.crop ? mods.push('c_' + opts.crop) : '';
            opts.width ? mods.push('w_' + opts.width) : '';
            opts.height ? mods.push('h_' + opts.height) : '';

            var url = _self.data.cloud.url;
            var mods = mods.join(',');
            var str = '/upload/';

            mods = (mods) ? mods + '/' : '';

            var parts = url.split(str);
            var out = [parts[0], str, mods, parts[1]].join('');

            return out;

        }


        function _hasAllData() {
            var d = _self.data;
            return d.cloud &&
                   d.cloud.eager &&
                   d.cloud.eager.length > 0 &&
                   d.cloud.eager[0].url;
        }


        function _setSizes() {
            _instances.forEach(function(instance){
                instance.resize();
            });
        }


        function _dimensions(width) {
            width = width || _self.data.local.width;
            var w = parseInt(_self.data.local.width || 1, 10);
            var h = parseInt(_self.data.local.height || 1, 10);
            var r = h / w;
            return {
                w: parseInt(width, 10),
                h: parseInt(Math.round(width * r), 10),
                r: r
            }
        }

    }

    window.App.Image = Image;

}());