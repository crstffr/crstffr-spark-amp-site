(function(){

    var App = function(){

        console.log("Javascript App() is working");

        $(function(){
             _convertDates();
        });

        function _convertDates() {

            $(".js-date").each(function(i, element){
                var $e = $(element);
                var d = new Date($e.text());
                var s = moment(d).fromNow();
                $e.text(s);
            });
        }

    }

    window.App = new App();

}());