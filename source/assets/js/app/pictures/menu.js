window.App = window.App || {};

(function() {

    var instance;

    function Menu(element) {

        var _self = this;
        var _util = window.Utils;

        var _tree;
        var _promise;
        var _current;
        var _handlers = [];
        var $menu = $(element);
        var $items;

        _promise = new RSVP.Promise(function(resolve, reject){
            $menu.on('onInit.waSlideMenu', function(){
                resolve();
            });
        });

        this.build = function(data) {
            _tree = _parseFolderTree(data);
            _insertElements($menu, _tree);
            _storeItems();
            _makeFancy();
        }

        this.ready = function() {
            return _promise;
        }

        this.select = function(path) {
            this.ready().then(function(){
                var $item = $items.filter('[data-path="' + path + '"]');
                $items.removeClass('selected');
                $item.addClass('selected');
            });
        }

        this.destroy = function() {
            $menu.waSlideMenu('exec','destroy');
            $menu.empty();
            _tree = {};
            return this;
        }

        this.onClick = function(handler){
            _handlers.push(handler);
            return this;
        }

        function _storeItems() {
            $items = $menu.find('li.menu-item');
        }

        function _makeFancy() {
            $menu.waSlideMenu({
                slideSpeed: 200,
                backOnTop: true,
                autoHeightMenu: false,
                backLinkContent: '..'
            });
        }


        function _parseFolderTree(data) {
            var test = [];
            var tree = traverse(data).map(function(x){
                if (x.local && x.local.file) {
                    this.remove();
                }
            });
            return tree;
        }


        function _insertElements($parent, data, prefix) {

            prefix = prefix || '';

            var path;
            var $ul, $li, $a;
            $ul = $('<ul/>');

            for (var i in data) {

                path = prefix + i + '/';

                $a = $('<a/>');
                $li = $('<li/>');
                $li.appendTo($ul);
                $li.addClass('menu-item');
                $li.attr('data-path', path);

                $a.text(i);
                $a.attr('href', '#/' + path);
                $a.on('click', _onMenuClick);
                $a.appendTo($li);

                if (Object.getOwnPropertyNames(data[i]).length > 0) {
                    $a.addClass('has-children');
                    _insertElements($li, data[i], path);
                }
            }
            $ul.appendTo($parent);
        }


        function _onMenuClick(event) {
            var element = this;
            _handlers.forEach(function(handler, i){
                if (typeof handler === 'function') {
                    var path = $(element).attr('href').replace('#/','');
                    handler.bind(element)(event, path);
                }
            });
        }


    }

    window.App.Menu = {
        create: function(a) {
            instance = new Menu(a);
            return instance;
        },
        getInstance: function() {
            return instance;
        }
    }

}());