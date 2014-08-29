module.exports = {

    sitename: 'smartamp',

    data: {
        firebase: {
            root: 'https://brace-images.firebaseio.com/'
        }
    },

    local: {
        source: 'source/content/pictures/',
        formats: [ '.jpg', '.jpeg', '.png', '.gif' ]
    },

    cloud: {
        cloud_name: 'brace-images',
        api_key: '787328258491676',
        api_secret: 'EicvBgJZNa7xZCgB9q0flOoS-yQ',
        cdn_subdomain: true,
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