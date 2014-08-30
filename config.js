module.exports = {

    sitename: 'smartamp',


    cloud: {
        cloud_name: 'brace-images',
        api_key: '787328258491676',
        api_secret: 'EicvBgJZNa7xZCgB9q0flOoS-yQ',
        cdn_subdomain: true
    },

    data: {
        firebase: {
            root: 'https://brace-images.firebaseio.com/'
        }
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
                width: '220',
                height: '220'
            }
        }
    }



};