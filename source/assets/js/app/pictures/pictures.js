window.App = window.App || {};

(function() {

    var instance;

    function Pictures() {

        App.Utils.loadLiveReloadScript();

        var _self = this;
        var _util;
        var _data;
        var _hash;
        var _menu;
        var _view;
        var _over;
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
                    },
                    overlay: {
                        overlay: '.overlay',
                        wrapper: '.image-wrapper'
                    }
                }
            }
        });

        /**
         * Public initialization method
         */
        this.init = function() {

            _loaded = {};
            _util = App.Utils;
            _data = App.Data.create(_config);
            _hash = App.Hash.create(_config);
            _menu = App.Menu.create(_config.app.elements.menu);
            _view = App.View.create(_config.app.elements.view);
            _over = App.Overlay.create(_config.app.elements.overlay);

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

                _hash.onChange(function(path, oldPath) {

                    _view.isBusy();
                    _menu.select(path);

                    _view.filter(path).then(function(){
                        _loadChild(path);
                    });

                });

                _hash.init();

            });

        }

        /**
         * Given a path, load the child whether it be a folder or an image.
         *
         * @param path
         * @private
         */
        function _loadChild(path) {

            var child = _root.getChild(path);
            if (child instanceof App.Folder) {
                _loadFolder(child);
            } else if (child instanceof App.Image) {
                _loadImage(child);
            }
        }


        function _loadImage(image) {

            console.log('Load Image', image);

            _view.isBusy();

            _over.open(image).then(function(){
                _view.isDone();
            });

        }


        /**
         * Load a folder full of images and register event handlers for when
         * images are added or removed.
         *
         * @param folder
         * @private
         */
        function _loadFolder(folder) {

            _over.close();

            console.log('Load Folder', folder);

            if (!folder || !folder.id || !folder.count.images || folder.loaded) {
                _view.isDone();
                return;
            }

            var delay = 0;
            var promises = [];
            var increment = 1 / folder.count.images;

            console.log('Loading %d Images', folder.count.images);

            // Register an event handler for this folder to
            // remove the thumbnail for any removed images.

            folder.onImageRemoved(function(image){
                console.log('IMAGE REMOVED', image);
                var thumb = image.getInstance('thumb');
                if (thumb) {
                    _view.remove(thumb);
                    _view.relayout();
                }
            });

            // Register an event handler for this folder to
            // load thumbnails for any images that are added
            // from here on out.  This allows us a realtime
            // pop-in effect of newly added images.

            folder.onImageAdded(function(image){
                console.log('IMAGE ADDED', image);
                _view.isBusy();
                _loadThumb(image).then(function(){
                    _view.relayout();
                    _view.isDone();
                });
            });

            // Loop over each of the image objects in the folder
            // and load them with a small delay.  When an image
            // is loaded, it increments the loader bar by a
            // a measured amount relevant to the total

            folder.getImages().forEach(function(image) {

                var promise = _loadThumb(image, delay);

                // Increment our loader by a specific amount
                // calculated based upon how many total images
                // there are to load in the folder.

                promise.then(function(){
                    _view.isWorking(increment);
                });

                // Add this image to our stack of promises.

                promises.push(promise);

                // Delay the loading of each image by a small
                // offset.  This leads to a smoother overall
                // performance, as well as a nice effect of
                // the images being drawn in as they load.

                delay += _config.app.load.delay;

            });

            // When ALL of the images in this folder have completed
            // their missions and have loaded completely, then set
            // the folder.loaded flag and relayout the view.

            RSVP.all(promises).then(function(){
                folder.loaded = true;
                _view.relayout();
                _view.isDone();
            });

        }

        /**
         * Create a thumbnail sized instance of the image and append it to the view.
         *
         * @param image
         * @param delay
         * @return {*}
         * @private
         */
        function _loadThumb(image, delay) {

            delay = delay || 0;

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