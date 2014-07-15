(function(){

    var App = function(){

        $(function(){

            _convertDates();
            setInterval(_convertDates, 1000 * 60 * 5);

            $(window).on('resize', _resize);
            _resize();

        });

        function _resize() {

            var eh,
                wh = $(window).height();

            $(".js-min-height").each(function(i, element){
                eh = $(element).height();
                if (eh < wh) {
                    $(element).height(wh);
                }
            });

        }

        function _convertDates() {

            $(".js-date").each(function(i, element){
                var $e = $(element);
                var d = new Date($e.attr('title'));
                var s = moment(d).fromNow();
                $e.text(s);
            });
        }

    }

    window.App = new App();

}());