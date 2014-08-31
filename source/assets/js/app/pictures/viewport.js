window.App = window.App || {};

(function() {

    var instance;

    function Viewport(elements) {

        var _self = this;
        var _util = window.Utils;
        var _ready;

        var $viewport = $(elements.viewport);
        var $container = $viewport.find(elements.container);
        var $loading = $viewport.find(elements.loading);
        var $empty = $viewport.find(elements.empty);
        var $wrapper = $('<a class="image-wrapper"/>');

        _setupLayout();




        function _setupLayout(){
            _ready = new RSVP.Promise(function(resolve, reject) {
                $container.isotope({
                    layoutMode: 'packery',
                    packery: {
                        columnWidth: 220,
                        gutter: 25
                    },
                    sortAscending: false,
                    isInitLayout: true,
                    sortBy: 'date',
                    getSortData: {
                        date: '[data-date]'
                    }
                });
                resolve();
            });
        }

        this.filter = function(path) {
            _ready.then(function(){
                $container.isotope({filter: '[data-path="' + path + '"]'});
            });
        }

        this.isBusy = function() {
            App.Load.bar.start();
            $loading.show();
        }

        this.isDone = function() {
            App.Load.bar.done();
            $loading.hide();
        }


        this.relayout = function() {

            setTimeout(function(){
                $container.isotope('updateSortData');
            }, 100);

            setTimeout(function(){
                $container.isotope('layout');
            }, 500);


        }

        function _layoutComplete(isoInstance, laidOutItems) {
            console.log('Layout complete on ' + laidOutItems.length + ' items');
        }

        this.loadImages = function(data) {

            this.isBusy();
            var _timer = 0;
            var _promises = [];

            $container.isotope('once', 'layoutComplete', _layoutComplete);

            traverse(data).forEach(function(x){
                if (this.level > 1) { return; }
                if (x.local && x.cloud) {
                    setTimeout(function(){
                        _promises.push(_loadImage(x));
                    }, _timer);
                    _timer += 100;
                } else if (x.local && !x.cloud) {
                    _insertPlaceholder(x);
                }
            });

            this.relayout();

            RSVP.all(_promises).then(function($wrappers){
                console.log($wrappers);
                _self.relayout();
                _self.isDone();
            });

        }


        function _loadImage(data) {

            console.log(data);

            var thumb = data.cloud.eager[0];
            var $wrap = $wrapper.clone();
            var $img = $('<img/>');

            $img.height(thumb.height);
            $img.width(thumb.width);
            $img.appendTo($wrap);

            $wrap.height(thumb.height).width(thumb.width);
            $wrap.attr('href', '#/' + data.local.id);
            $wrap.attr('data-date', data.local.time);
            $wrap.attr('data-path', data.local.dir);

            $container.append($wrap);
            $container.isotope('appended', $wrap);

            $img.attr('src', thumb.url);

            return new RSVP.Promise(function(resolve, reject){
                $img.on('load', function(){
                    resolve();
                });
            });

        }


        function _insertPlaceholder(data) {
            console.log('insert placeholder', data);
        }


    }

    window.App.Viewport = {
        create: function(a) {
            instance = new Viewport(a);
            return instance;
        },
        getInstance: function() {
            return instance;
        }
    }

}());