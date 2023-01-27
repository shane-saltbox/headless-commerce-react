const db = require('../db');
const randomstring = require('randomstring');
const uuid = require('uuid');
var jsforce = require('jsforce');
const axios = require('axios');

const CONSTANTS = require('../constants');

module.exports = function(app, debugLogger) {

  /*
   * GET (Read)
   */
  app.get('/api/productDetail', async function(req, res, next) {
    const { DEBUG, SF_CLIENT_ID, SF_CLIENT_SECRET, SF_USERNAME, SF_PASSWORD, SF_LOGIN_URL, SF_API_VERSION } = process.env;
    const response = {...CONSTANTS.RESPONSE_OBJECT};

    try {
        const { sku,effectiveAccountId } = req.query;

        if (!sku && !effectiveAccountId) {
            const error = new Error();
            error.message = 'Required fields not found.';
            error.status = 206;

            throw(error);
        }

        var conn = new jsforce.Connection({
            oauth2 : {
                clientId : SF_CLIENT_ID,
                clientSecret : SF_CLIENT_SECRET,
                redirectUri : 'https://headless-commerce.herokuapp.com/callback'
            }
        });

        await conn.login(SF_USERNAME, SF_PASSWORD, function(err, userInfo) {
            if (err) { return console.error(err); }
        });

        const url = SF_LOGIN_URL+'/services/data/v'+SF_API_VERSION+'/commerce/webstores/0ZE5e000000M1ApGAK/products';
          
        let config = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer '+conn.accessToken
            },
            params: {
                effectiveAccountId: effectiveAccountId,
                skus: sku
            },
          }

        console.log('##DEBUG config: '+JSON.stringify(config));
        const productsRes = await axios.get(url, config);
        console.log('##DEBUG productsRes: '+productsRes);

        if (DEBUG === 'true') debugLogger.info('/api/productDetail', 'GET', id, 'Get product details.', productsRes);

        if (!productsRes) {
            const error = new Error();
            error.message = 'Product not found.';
            error.status = 404;

            throw(error);
        }

        response.data = productsRes.data;
        response.success = true;

        res.status(200).send(response);

    } catch (error) {
      const { id } = req.query;

      response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
      response.error.message = error.message || 'Internal Server Error';
      response.error.status = error.status || 500;
      response.success = false;

      if (DEBUG === 'true') debugLogger.info('/api/productDetail', 'GET', id, 'Exception', response);

      res.status(error.status || 500).send(response);
    }
  });

};