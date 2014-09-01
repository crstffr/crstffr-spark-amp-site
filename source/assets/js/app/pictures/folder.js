window.App = window.App || {};

(function() {

    var instance;

    function Folder(tree, path) {

        this.folders = {};
        this.images = {};
        this.count = {
            folders: 0,
            images: 0
        };

        var _self = this;
        var _tree = tree || {};
        var _path = path || '';
        var _data = App.Data.getInstance();

        this.id = _path;
        this.node = _data.node(_path);
        this.empty = true;

        traverse(_tree).forEach(function(x){
            if (this.level === 1) {
                if (x.local && x.local.id) {
                    _addImage(x, this.key);
                } else {
                    _addSubfolder(x, this.key);
                }
            }
        });

        /**
         * Get a subfolder of a specified text path
         * @param path
         * @return {*}
         */
        this.getFolder = function(path) {
            var folder = this;
            var paths = path.split('/');
            paths.forEach(function(name){
                if (name && folder.folders && folder.folders[name]) {
                    folder = folder.folders[name];
                }
            });
            return folder;
        }

        this.prepareImages = function() {
            for(var name in _self.images) {
                if (_self.images.hasOwnProperty(name)) {
                    var image = _self.images[name];
                    image.prepare();
                }
            }
        }

        this.loadImages = function() {
            var timer = 0;
            var _promises = [];
            for(var name in _self.images) {
                if (_self.images.hasOwnProperty(name)) {
                    var image = _self.images[name];
                    _promises.push(image.load(timer));
                    timer += 75;
                }
            }
            return RSVP.all(_promises);
        }

        function _addImage(data, name) {
            var image = new App.Image(data);
            _self.images[name] = image;
            _self.count.images++;
            _self.empty = false;
        }

        function _addSubfolder(tree, name) {
            _self.folders[name] = new Folder(tree, _path + name + '/');
            _self.count.folders++;
        }


    }

    window.App.Folder = Folder;

}());