window.App = window.App || {};

(function() {

    var instance;

    function Image(data) {

        var _self = this;
        var _loaded = false;
        var _view = App.View.getInstance();

        this.data = data;
        this.id = data.local.id;
        this.elem = _buildElement();
        this.img = this.elem.find('img');

        this.getElement = function() {
            return _self.elem;
        }

        this.prepare = function() {
            _view.insert(_self.elem);
        }

        this.load = function(delay){

            delay = parseInt(delay || 0);

            if (_loaded) {
                return new RSVP.Promise(function(resolve, reject){
                    resolve();
                });
            }

            _self.prepare();

            var d = _self.data;
            if (!d.cloud || !d.cloud.eager) { return; }
            var url = d.cloud.eager[0].url;

            setTimeout(function(){
                _self.img.attr('src', url);
            }, delay);

            return new RSVP.Promise(function(resolve, reject){
                _self.img.on('load', function(){
                    _loaded = true;
                    resolve();
                })
            });
        }
        
        
        function _dimensions(width) {
            width = width || _self.data.local.width;
            var w = _self.data.local.width || 1;
            var h = _self.data.local.height || 1;
            var r = h / w;
            return {
                w: width,
                h: Math.round(width * r),
                r: r
            }
        }


        function _buildElement() {

            var $a = $('<a class="image-wrapper"/>');
            var $img = $('<img class="image"/>');
            var size = _dimensions(220);

            $img.width(size.w);
            $img.height(size.h);
            $img.appendTo($a);

            $a.height(size.h).width(size.w);
            $a.attr('href', '#/' + _self.data.local.id);
            $a.attr('data-date', _self.data.local.time);
            $a.attr('data-path', _self.data.local.dir);
            $a.on('click', function(e){
                return false;
            })

            return $a;

        }

        function _loadImage(data) {

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

    }

    window.App.Image = Image;

}());