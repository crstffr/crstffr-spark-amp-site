window.App = window.App || {};

(function() {

    var instance;

    function Pictures() {

        var _self = this;
        var _util = App.Utils;

        _util.loadLiveReloadScript();

        var _data;
        var _hash;
        var _menu;
        var _view;
        var _root;
        var _ready;
        var _loaded;

        var _config = $.extend({}, config, {
             app: {
                load: {
                    delay: 80
                },
                elements: {
                    menu: 'nav.menu',
                    view: {
                        viewport: '.viewport',
                        container: '.image-container',
                        loading: '.msg-loading',
                        empty: '.msg-empty'
                    }
                }
            }
        });

        /**
         * Public initialization method
         */
        this.init = function() {

            _loaded = {};
            _data = App.Data.create(_config);
            _hash = App.Hash.create(_config);
            _menu = App.Menu.create(_config.app.elements.menu);
            _view = App.View.create(_config.app.elements.view);

            // Build the Menu from data in Firebase

            _ready = new RSVP.Promise(function(resolve, reject){
                _data.fetch().then(function(data){
                    _root = new App.Folder(data);
                    _root.ready().then(function(){
                        _menu.buildFolder(_root);
                        _menu.makeFancy();
                        resolve();
                    });
                });
            });

            _menu.onClick(function(event, path){
                _hash.setHash(path);
            });


            _menu.ready().then(function(){

                _hash.onChange(function(path, oldPath){


                    _view.isBusy();
                    _menu.select(path);
                    _view.filter(path).then(function(){
                        _loadImages(path);
                    });

                });

                _hash.init();

            });

        }


        function _loadImages(path) {

            var delay = 0;
            var promises = [];
            var folder = _root.getFolder(path);

            console.log('Load from', folder);

            if (!folder || !folder.id || folder.loaded) {
                _view.isDone();
                return;
            }

            folder.onImageRemoved(function(image){
                console.log('IMAGE REMOVED', image);
                var thumb = image.getInstance('thumb');
                if (thumb) {
                    _view.remove(thumb);
                    _view.relayout();
                }
            });

            folder.onImageAdded(function(image){
                _view.isBusy();
                console.log('IMAGE ADDED', image);
                _loadThumb(image, 0).then(function(){
                    _view.relayout();
                    _view.isDone();
                });
            });

            folder.getImages().forEach(function(image) {
                promises.push(_loadThumb(image, delay));
                delay += _config.app.load.delay;
            });

            RSVP.all(promises).then(function(){
                folder.loaded = true;
                _view.relayout();
                _view.isDone();
            });

        }

        function _loadThumb(image, delay) {

            if (!image instanceof App.Image) {
                console.warn('Object is not an instance of App.Image', image);
                return;
            }

            var opts = config.image.sizes.thumb;
            var thumb = new image.instance('thumb', opts);

            _view.append(thumb);
            return thumb.load(delay);
        }


    }

    window.App.Pictures = new Pictures();

}());