(function() {


    function Pictures() {

        var _self = this;

        var $filters;
        var $container;
        var $dataitems;
        var $infopanel;
        var $showinfo;
        var $hideinfo;
        var $backbtns;

        var _classes = {
            btnOn: 'btn-primary',
            btnOff: 'btn'
        };

        var _pictures = {};
        var _history = [];
        var _filters = [];
        var _loaded = 0;
        var _count = 0;
        var _tags = [];

        /**
         * Public initialization method
         */
        this.init = function() {

            $backbtns = $('.js-back');
            $filters = $('.js-filters');
            $infopanel = $('.js-picture-info-panel');
            $container = $('.js-picture-container');
            $dataitems = $('.js-picturedata > *');
            $showinfo = $('.js-info-show');
            $hideinfo = $('.js-info-hide');
            _count = $dataitems.length;

            $backbtns.on('click', _goBack);

            _loadPictures();
            _initFilters();
            _initHasher();

        }


        function _initHasher() {
            hasher.initialized.add(_parseHash);
            hasher.changed.add(_parseHash);
            hasher.init();
        }

        function _parseHash(newHash, oldHash){
            if (newHash !== oldHash) {
                _hideInfoPanel();
                _history.push(newHash);
                if (newHash) {
                    _filterByVal(newHash);
                } else {
                    _resetFilters();
                }
            }
        }

        function _goBack() {
            if (_history.length < 2) {
                hasher.setHash('');
            } else {
                hasher.setHash(_history.slice(-2,-1));
            }
            return false;
        }

        /**
         * Loop over the data items, collect their data attributes and
         * create image tags for each of the items.  When all of the
         * images have loaded, init the grid system.
         *
         * @private
         */
        function _loadPictures() {

            $dataitems.each(function(i, element) {

                var $e = $(element);
                var $img = $('<img/>');
                var $wrapper = $('<a class="picture-wrapper"/>');

                var picture = {
                    mdate: $e.data('mdate'),
                    dir: $e.data('dir'),
                    base: $e.data('base'),
                    ext: $e.data('ext'),
                    sizes: $e.data('sizes').toString().split(','),
                    tags: $e.data('tags').toString().split(',')
                };

                picture.url = picture.dir + '/' + picture.base + '-small' + picture.ext;

                _pictures[picture.base] = picture;

                _tags = arrayUnique(_tags.concat(picture.tags));

                $img.attr('src', picture.url)
                    .data('base', picture.base)
                    .appendTo($wrapper)
                    .on('load', function(e) {
                        _loaded++;
                        if (_loaded === _count) {
                            _initGrid();
                        }
                    });

                $wrapper.addClass(picture.base)
                        .addClass(picture.tags.join(' '))
                        .attr('href', '#/' + picture.base)
                        .appendTo($container)
                        .data('data', picture);

            });

            _self.tags = _tags;
            _self.data = _pictures;

        }


        function _initFilters() {

            $(_tags).each(function(i, val){

                var $btn = $('<a>' + val + '</a>');

                $btn.addClass('filter btn')
                    .attr('href', '#/' + val)
                    .appendTo($filters)
                    .attr('data-value', val)
                    .attr('data-filter', '.' + val)
                    .on('click', _onFilterClick)
                    .val(val);

            });

            $filters = $filters.find('.btn');

        }

        function _resetFilters() {

            $filters.removeClass(_classes.btnOn);
            $container.isotope({filter: '*'});
            hasher.setHash('');

        }

        function _filterByVal(val) {

            var $btn = $filters.filter('[data-value="' + val + '"]');
            _toggleFilterButton($btn);
            $container.isotope({filter: '.' + val});

        }

        function _toggleFilterButton($e) {
            $filters.removeClass(_classes.btnOn);
            $e.addClass(_classes.btnOn);
        }

        function _onFilterClick(e) {

            if ($(this).hasClass(_classes.btnOn)) {
                _resetFilters();
                e.preventDefault();
            }
        }

        function _layoutComplete(iso, items) {
            if (items.length === 1) {
                _showInfoPanel(items[0].element);
            } else {
                _hideInfoPanel();

            }
        }


        function _showInfoPanel(item) {

            $infopanel.show();
            $showinfo.show();
            $hideinfo.hide();

            var i, size;
            var $item = $(item);
            var data = $item.data('data');

            for (i = 0; i < data.sizes.length; i++) {
                size = data.sizes[i];
                data[size] = data.dir + '/' + data.base + '-' + size + data.ext;
            }

            $infopanel.find('[data-bind]').each(function(i, e){
                var key = $(e).attr('data-bind');
                if (data[key]) {
                    $(e).text(data[key]);
                }
            });

            $infopanel.find('[data-value]').each(function(i, e){
                var key = $(e).attr('data-value');
                if (data[key]) {
                    $(e).val(data[key]);
                }
            });



        }

        function _hideInfoPanel() {
            $infopanel.hide();
            $showinfo.hide();
            $hideinfo.show();
        }


        /**
         * Init grid system, used for masonry layout.
         * @private
         */
        function _initGrid() {
            $container.isotope({
                layoutMode: 'masonry',
                isInitLayout: false
            });

            $container.isotope('on', 'layoutComplete', _layoutComplete);
            $container.isotope();
        }

    }

    window.Pictures = new Pictures();

}());