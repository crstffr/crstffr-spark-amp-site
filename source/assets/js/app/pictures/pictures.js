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
        var _root;
        var _ready;

        _util.loadLiveReloadScript();

        /**
         * Public initialization method
         */
        this.init = function() {

            _data = App.Data.create(config);
            _hash = App.Hash.create(config);
            _menu = App.Menu.create('nav.menu');
            _view = App.View.create({
                viewport: '.viewport',
                container: '.image-container',
                loading: '.msg-loading',
                empty: '.msg-empty'
            });

            // Build the Menu from data in Firebase

            _ready = new RSVP.Promise(function(resolve, reject){
                _data.fetch().then(function(data){
                    _root = new App.Folder(data);
                    _menu.buildFolder(_root);
                    _menu.makeFancy();
                    resolve();
                });
            })


            _menu.onClick(function(event, path){
                _hash.setHash(path);
            });

            _hash.onChange(function(path, oldPath){

                _view.isBusy();
                _menu.select(path);
                _view.filter(path);

                _ready.then(function(){
                    var folder = _root.getFolder(path);
                    if (folder) {
                        folder.loadImages().then(function(){
                            _view.relayout();
                            _view.isDone();
                        });
                    }

                });
            });

            _hash.init();

        }

    }

    window.App.Pictures = new Pictures();

}());