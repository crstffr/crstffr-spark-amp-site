window.App = window.App || {};

(function() {

    var instance;

    function View(elements) {

        var _self = this;
        var _util = window.Utils;
        var _ready;

        var $viewport = $(elements.viewport);
        var $container = $viewport.find(elements.container);
        var $loading = $viewport.find(elements.loading);
        var $empty = $viewport.find(elements.empty);
        var $wrapper = $('<a class="image-wrapper"/>');

        _setupLayout();


        /**
         *
         * @private
         */
        function _setupLayout(){
            _ready = new RSVP.Promise(function(resolve, reject) {
                $container.isotope({
                    layoutMode: 'packery',
                    packery: {
                        columnWidth: 220,
                        gutter: 25
                    },
                    sortAscending: false,
                    isInitLayout: true
                    /*
                    sortBy: 'date',
                    getSortData: {
                        date: '[data-date]'
                    }*/
                });
                resolve();
            });
        }

        this.show = function(path) {
            _self.filter(path);
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

        this.insert = function($elem) {

            $container.append($elem);
            $container.isotope('appended', $elem);

        }


    }

    window.App.View = {
        create: function(a) {
            instance = new View(a);
            return instance;
        },
        getInstance: function() {
            return instance;
        }
    }

}());