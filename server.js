require('dotenv').config();


const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');

const debugLogger = require('./debugLogger').init();

const CONSTANTS = require('./constants');

const { ENV_URL, NODE_ENV } = process.env;


/*
 * CONFIGURE EXPRESS SERVER
 */
var app = express();

app.enable('trust proxy');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache');
  //res.set('Content-Security-Policy',   `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com tagmanager.google.com; object-src 'none'; style-src 'self' 'unsafe-inline' *.typekit.net tagmanager.google.com fonts.googleapis.com; img-src 'self' data: *.google-analytics.com *.googletagmanager.com *.sfmc-content.com ssl.gstatic.com www.gstatic.com ${IMAGE_CDN}; frame-ancestors 'none'; frame-src 'none'; font-src 'self' data: *.typekit.net fonts.gstatic.com; connect-src 'self' *.google-analytics.com *.g.doubleclick.net;`);
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('Strict-Transport-Security', 'max-age=200'); 
  //res.set('X-Content-Security-Policy', `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com tagmanager.google.com; object-src 'none'; style-src 'self' 'unsafe-inline' *.typekit.net tagmanager.google.com fonts.googleapis.com; img-src 'self' data: *.google-analytics.com *.googletagmanager.com *.sfmc-content.com ssl.gstatic.com www.gstatic.com ${IMAGE_CDN}; frame-ancestors 'none'; frame-src 'none'; font-src 'self' data: *.typekit.net fonts.gstatic.com; connect-src 'self' *.google-analytics.com *.g.doubleclick.net;`);
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'deny');
  res.set('X-Powered-By', '');
  //res.set('X-WebKit-CSP',              `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google-analytics.com *.googletagmanager.com tagmanager.google.com; object-src 'none'; style-src 'self' 'unsafe-inline' *.typekit.net tagmanager.google.com fonts.googleapis.com; img-src 'self' data: *.google-analytics.com *.googletagmanager.com *.sfmc-content.com ssl.gstatic.com www.gstatic.com ${IMAGE_CDN}; frame-ancestors 'none'; frame-src 'none'; font-src 'self' data: *.typekit.net fonts.gstatic.com; connect-src 'self' *.google-analytics.com *.g.doubleclick.net;`);
  res.set('X-XSS-Protection', '1; mode=block');
  next();
});

/*
 * DEFINE ERROR HANDLER
 */
app.use((error, req, res, next) => {
  const response = {...CONSTANTS.RESPONSE_OBJECT};
  response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
  response.error.message = error.message || 'Internal Server Error';
  response.error.status = error.status || 500;
  response.success = false;

  res.status(error.status || 500).send(response);
});

/*
 * IMPORT ROUTES
 */
require('./routes/inventory')(app, debugLogger);
require('./routes/order')(app, debugLogger);
require('./routes/checkoutDiscount')(app, debugLogger);
require('./routes/sso')(app, debugLogger);

// Catch landing page so it isn't served as a static file.
app.get('/', (req, res) => {
  fs.readFile(`${__dirname}/client/build/index.html`, { encoding: 'utf8' }, function(error, buffer) {
    if (error) return res.status(404).end();
    res.send(buffer = buffer.replace('<head>', '<head><script>window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {}</script>'));
  });
});

// Serve static files from '/client/build'.
app.use(express.static(__dirname + '/client/build'));

// Catch-all route for React Router.
app.get('*', (req, res) => {
  fs.readFile(`${__dirname}/client/build/index.html`, { encoding: 'utf8' }, function(error, buffer) {
    if (error) return res.status(404).end();
    res.send(buffer = buffer.replace('<head>', '<head><script>window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function () {}</script>'));
  });
});

/*
 * INSTANTIATE EXPRESS SERVER
 */
const server = app.listen(process.env.PORT || 5000);

module.exports = server;
