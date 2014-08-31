window.App = window.App || {};

(function() {

    var instance;

    function Viewport(elements) {

        var _self = this;
        var _util = window.Utils;

        var $viewport = $(elements.viewport);
        var $container = $viewport.find(elements.container);
        var $loading = $viewport.find(elements.loading);
        var $empty = $viewport.find(elements.empty);
        var $wrapper = $('<a class="image-wrapper"/>');

        _setupLayout();




        function _setupLayout(){
            $container.isotope({
                layoutMode: 'packery',
                sortAscending: false,
                isInitLayout: true,
                sortBy: 'date',
                getSortData: {
                    date: '[data-date]'
                }
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

        this.loadImages = function(data) {

            this.isBusy();
            var _promises = []

            traverse(data).forEach(function(x){
                if (this.level > 1) { return; }
                if (x.local && x.cloud) {
                    var rand = Math.random() * 1000;
                    setTimeout(function(){
                        _promises.push(_loadImage(x));
                    }, rand);

                } else if (x.local && !x.cloud) {
                    _insertPlaceholder(x);
                }
            });

            this.relayout();

            RSVP.all(_promises).then(function(){
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

            $container.append($wrap);
            $container.isotope('appended', $wrap);
            $container.isotope('layout');

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