window.App = window.App || {};

(function() {

    var instance;

    function Load() {

        var _self = this;
        var _view;

        this.bar = NProgress;

    }

    window.App.Load = {
        create: function() {
            instance = new Load();
            return instance;
        },
        getInstance: function() {
            return instance;
        }
    }

    window.App.Load = new Load();

}());