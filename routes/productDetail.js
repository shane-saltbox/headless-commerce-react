const db = require('../db');
const randomstring = require('randomstring');
const uuid = require('uuid');
var jsforce = require('jsforce');
const axios = require('axios');

const CONSTANTS = require('../constants');
const { config } = require('dotenv');

module.exports = function(app, debugLogger, config) {

  /*
   * GET (Read)
   */
  app.get('/api/productDetail', async function(req, res, next) {
    const { DEBUG, SCHEMA } = process.env;
    const response = {...CONSTANTS.RESPONSE_OBJECT};

    //try {
        const { id } = req.query;

        if (!id) {
            const error = new Error();
            error.message = 'Required fields not found.';
            error.status = 206;

            throw(error);
        }

        var conn = new jsforce.Connection({
            oauth2 : {
            // you can change loginUrl to connect to sandbox or prerelease env.
            // loginUrl : 'https://test.salesforce.com',
            clientId : config.SF_CLIENT_ID,
            clientSecret : config.SF_CLIENT_SECRET,
            redirectUri : 'https://headless-commerce.herokuapp.com/callback'
            }
        });
        console.log('##DEBUG: '+JSON.stringify(conn));
        console.log('##DEBUG SF_USERNAME: '+JSON.stringify(config.SF_USERNAME));
        console.log('##DEBUG SF_PASSWORD: '+JSON.stringify(config.SF_PASSWORD));
        conn.login(config.SF_USERNAME, config.SF_PASSWORD, function(err, userInfo) {
            if (err) { return console.error(err); }
            // Now you can get the access token and instance URL information.
            // Save them to establish connection next time.
            console.log('##DEBUG: '+JSON.stringify(conn.accessToken));
            console.log('##DEBUG: '+JSON.stringify(conn.instanceUrl));
            // logged in user property
            console.log("User ID: " + userInfo.id);
            console.log("Org ID: " + userInfo.organizationId);
            // ...
        });

        const params = {
            effectiveAccountId: '0015e00000MMkzQAAT',
            skus: '800984'
          };
          
        const productsRes = await axios.get(config.SF_LOGIN_URL+'/commerce/webstores/webstoreId/products', { params });


        if (DEBUG === 'true') debugLogger.info('/api/productDetail', 'GET', id, 'Get product details.', productsRes);


        if (!productsRes || !productsRes.rows.length) {
            const error = new Error();
            error.message = 'Product not found.';
            error.status = 404;

            throw(error);
        }

        response.data = productsRes.rows;
        response.success = true;

        res.status(200).send(response);

    /* } catch (error) {
      const { id } = req.query;

      response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
      response.error.message = error.message || 'Internal Server Error';
      response.error.status = error.status || 500;
      response.success = false;

      if (DEBUG === 'true') debugLogger.info('/api/productDetail', 'GET', id, 'Exception', response);

      res.status(error.status || 500).send(response);
    } */
  });

};