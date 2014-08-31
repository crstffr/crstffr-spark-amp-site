window.App = window.App || {};

(function() {

    var instance;

    function Pictures() {

        var _self = this;
        var _util = window.Utils;

        var _data;
        var _hash;
        var _menu;
        var _view;
        var _loaded = {};

        _util.loadLiveReloadScript();

        /**
         * Public initialization method
         */
        this.init = function() {

            _data = App.Data.create(config);
            _hash = App.Hash.create(config);
            _menu = App.Menu.create('nav.menu');
            _view = App.Viewport.create({
                viewport: '.viewport',
                container: '.image-container',
                loading: '.msg-loading',
                empty: '.msg-empty'
            });

            _data.fetch().then(function(data){
                _menu.build(data);
            });

            _menu.onClick(function(event, path){
                _hash.setHash(path);
            });

            _hash.onChange(function(path, oldPath){

                console.log('hash change', path);

                _menu.select(path);

                _view.filter(path);

                if (!_loaded[path]) {
                    _data.fetch(path).then(function(data) {
                        _view.loadImages(data);
                        _loaded[path] = true;
                    });
                }
            });

            _hash.init();

        }

    }

    window.App.Pictures = new Pictures();

}());