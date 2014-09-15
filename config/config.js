(function() {

    var config = {

        sitename: 'smartamp',

        cloud: {
            cloud_name: 'brace-images',
            api_key: '787328258491676',
            cdn_subdomain: true,
            concurrent_uploads: 2
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
            eager: ['thumb', 'med'],
            sizes: {
                thumb: {
                    crop: 'fit',
                    width: '220',
                    quality: '85',
                    format: 'jpg'
                },
                med: {
                    crop: 'fit',
                    width: '800',
                    height: '800',
                    quality: '85',
                    format: 'jpg'
                },
                full: {
                    crop: 'fit',
                    width: '1200',
                    height: '1200',
                    format: 'jpg'
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