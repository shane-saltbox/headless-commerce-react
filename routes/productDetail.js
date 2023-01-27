const db = require('../db');
const randomstring = require('randomstring');
const uuid = require('uuid');
var jsforce = require('jsforce');

const CONSTANTS = require('../constants');

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
      console.log('##DEBUG: '+conn);
      conn.login(config.SF_USERNAME, config.SF_PASSWORD, function(err, userInfo) {
        if (err) { return console.error(err); }
        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        console.log('##DEBUG: '+conn.accessToken);
        console.log('##DEBUG: '+conn.instanceUrl);
        // logged in user property
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
        // ...
      });

      var body = { 
            effectiveAccountId: 'hello', 
            skus: '100'
        };
        conn.apex.get("/commerce/webstores/webstoreId/products", body, function(err, res) {
        if (err) { return console.error(err); }
        console.log("response: ", res);
        // the response object structure depends on the definition of apex class
        });

      if (DEBUG === 'true') debugLogger.info('/api/checkInventory', 'GET', id, 'Inventory Level query.', query_inventory);


      if (!response_inventory || !response_inventory.rows.length) {
        const error = new Error();
        error.message = 'Inventory not found.';
        error.status = 404;

        throw(error);
      }

      response.data = response_inventory.rows;
      response.success = true;

      res.status(200).send(response);

    /* } catch (error) {
      const { id } = req.query;

      response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
      response.error.message = error.message || 'Internal Server Error';
      response.error.status = error.status || 500;
      response.success = false;

      if (DEBUG === 'true') debugLogger.info('/api/checkInventory', 'GET', id, 'Exception', response);

      res.status(error.status || 500).send(response);
    } */
  });

};