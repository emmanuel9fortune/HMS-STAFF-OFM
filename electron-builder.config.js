require('dotenv').config();

module.exports = {
    appId: process.env.APPID,

    productName: process.env.APP_NAME,

    directories: {
        output: 'dist'
    },

    files: [
        '**/*',
        'main.js',
        'logo.jpg',
        'preload.js',
        'hospital/build/**/*',
        'build/**/*'
    ]
};