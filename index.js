// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
    databaseURI: databaseUri || 'mongodb://localhost:28018/IEATTA',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: 'YJ60VCiTAD01YOA3LJtHQlhaLjxiHSsv4mkxKvVM',
    clientKey: 'QMGWgF0PPgsFQsgwlKoDurVX65ZG5O0ifzdAtZ0D',
    restAPIKey: 'gQTEnIKaDWgZ4UiUZGQqN7qkkvtMCOobQEIb1kYy',
    javascriptKey: '3S9VZj8y9g0Tj1WS64dl19eDJrEVpvckG7uhcXIi',
    masterKey: '87rxX8J0JwaaPSBxY9DdKJEqWXByqE7sShRsX4vg', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
    liveQuery: {
        classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
    }

    // push: {
    //     android: {
    //         senderId: '...',
    //         apiKey: '...'
    //     },
    //     ios: {
    //         pfx: '/Users/djzhang/Documents/androidapk/delivery/delivery-push.p12',
    //         passphrase: 'trujunzhang', // optional password to your p12/PFX
    //         bundleId: 'com.Socialinfotech.DeliveryApp',
    //         production: false
    //     }
    // }

});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function (req, res) {
    res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function () {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
