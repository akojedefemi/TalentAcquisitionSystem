/// <reference path="../../typings/tsd.d.ts" />
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var cors = require('cors');
var errorHandler = require('./routes/utils/errorHandler')();
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 7200;
var routes;
var db = require('./data/db.js');


var environment = process.env.NODE_ENV;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compress());            // Compress response data with gzip
app.use(logger('dev'));
app.use(favicon(__dirname + '/favicon.ico'));
app.use(cors());                // enable ALL CORS requests
app.use(errorHandler.init);
// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

routes = require('./routes/index')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/aaa', function(req, res){
   console.log('Hello');
   res.status(200).json({
       abc: 'def'
   });
});

switch (environment){
    case 'stage':
    case 'build':
        console.log('** BUILD **');
        console.log('serving from ' + './build/');
        app.use('/', express.static('./build/'));
        break;
    default:
        console.log('** DEV **');
        console.log('serving from ' + './src/client/ and ./');
        app.use('/', express.static('./src/client/'));
        app.use('/', express.static('./'));
        break;
}

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
        '\n__dirname = ' + __dirname  +
        '\nprocess.cwd = ' + process.cwd());
});
