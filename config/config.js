(function() {

    var config = {

        sitename: 'smartamp',

        cloud: {
            cloud_name: 'brace-images',
            api_key: '787328258491676',
            cdn_subdomain: true
        },

        firebase: {
            root: 'https://brace-images.firebaseio.com/'
        },

        local: {
            source: 'source/content/pictures/',
            watch: ['*', '**/*']
        },

        logger: {
            papertrail: {
                host: 'logs2.papertrailapp.com',
                port: 28144
            }
        },

        livereload: {
            'athena': {
                port: 35729
            }
        },

        image: {
            exif: false,
            formats: [ '.jpg', '.jpeg', '.png', '.gif' ],
            sizes: {
                full: {
                    crop: 'fit',
                    width: '1500',
                    height: '1500'
                },
                thumb: {
                    crop: 'fit',
                    width: '220'
                }
            }
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = config;
    } else {
        window['config'] = config;
    }

})();