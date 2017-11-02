// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
const resolve = require('path').resolve;

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
    databaseURI: databaseUri || 'mongodb://localhost:28018/IEATTA',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appName: "IEATTA",
    publicServerURL: 'http://ieatta-web.herokuapp.com/',
    appId: 'YJ60VCiTAD01YOA3LJtHQlhaLjxiHSsv4mkxKvVM',
    clientKey: 'QMGWgF0PPgsFQsgwlKoDurVX65ZG5O0ifzdAtZ0D',
    restAPIKey: 'gQTEnIKaDWgZ4UiUZGQqN7qkkvtMCOobQEIb1kYy',
    javascriptKey: '3S9VZj8y9g0Tj1WS64dl19eDJrEVpvckG7uhcXIi',
    masterKey: '87rxX8J0JwaaPSBxY9DdKJEqWXByqE7sShRsX4vg', //Add your master key here. Keep it secret!
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
    liveQuery: {
        classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
    },
    verifyUserEmails: true,
    emailAdapter: {
        module: 'parse-server-mailgun',
        options: {
            // The address that your emails come from
            fromAddress: 'trujunzhang@gmail.com>',
            // Your domain from mailgun.com
            domain: "sandbox25f368c4b2da4621af07cf4276682fd6.mailgun.org",
            // Your API key from mailgun.com
            apiKey: "key-330783da3fa3ebc4e72d8ffae7c50b70",
            // The template section
            templates: {
                passwordResetEmail: {
                    subject: 'Reset your password',
                    pathPlainText: resolve(__dirname, 'path/to/templates/password_reset_email.txt'),
                    pathHtml: resolve(__dirname, 'path/to/templates/password_reset_email.html'),
                    callback: (user) => {
                        return {firstName: user.get('firstName')}
                    }
                    // Now you can use {{firstName}} in your templates
                },
                verificationEmail: {
                    subject: 'Confirm your account',
                    pathPlainText: resolve(__dirname, 'path/to/templates/verification_email.txt'),
                    pathHtml: resolve(__dirname, 'path/to/templates/verification_email.html'),
                    callback: (user) => {
                        return {firstName: user.get('firstName')}
                    }
                    // Now you can use {{firstName}} in your templates
                },
                inviteFriendsEmail: {
                    subject: 'Urgent notification!',
                    pathPlainText: resolve(__dirname, 'email-templates/invite_friends.txt'),
                    pathHtml: resolve(__dirname, 'email-templates/invite_friends.html'),
                }
            }
        }
    }

})

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
