const db = require('../db');
const randomstring = require('randomstring');
const uuid = require('uuid');
var jsforce = require('jsforce');
const axios = require('axios');
const parseString = require('xml2js');

const CONSTANTS = require('../constants');

module.exports = function(app, debugLogger) {

  /*
   * GET (Read)
   */
  app.get('/api/cart', async function(req, res, next) {
    const { DEBUG, SF_CLIENT_ID, SF_CLIENT_SECRET, SF_SITE_URL, ORG_ID, SF_USERNAME, SF_PASSWORD, SF_LOGIN_URL, SF_API_VERSION } = process.env;
    const response = {...CONSTANTS.RESPONSE_OBJECT};

    //try {
        // Make SOAP auth call for accessToken
        const soapAuthUrl = SF_SITE_URL+'/services/Soap/u/'+SF_API_VERSION;
        const soapAuthBody = `<?xml version="1.0" encoding="UTF-8"?>
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:partner.soap.sforce.com">
            <SOAP-ENV:Header>
                <ns1:LoginScopeHeader>
                <ns1:organizationId>`+ORG_ID+`</ns1:organizationId>
                </ns1:LoginScopeHeader>
            </SOAP-ENV:Header>
            <SOAP-ENV:Body>
                <ns1:login>
                <ns1:username>`+SF_USERNAME+`</ns1:username>
                <ns1:password>`+SF_PASSWORD+`</ns1:password>
                </ns1:login>
            </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>`;
        const soapConfig = {
            headers: {
                'Content-Type' : 'text/xml',
                'SOAPAction': 'login',
                'charset': 'UTF-8'
            }
          }
        const soapAuth = await axios.post(soapAuthUrl, soapAuthBody, soapConfig);
        console.log('##DEBUG soapAuth.data: '+soapAuth.data);
        const auth = await parseString.parseStringPromise(xml, { mergeAttrs: true })
        console.log('##DEBUG soapAuth: '+JSON.stringify(auth));

        // Get Cart Id
        const url = SF_LOGIN_URL+'/services/data/v'+SF_API_VERSION+'/commerce/webstores/0ZE5e000000M1ApGAK/carts/active';
        const config = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer '+soapAuth.sessionId
            },
          }

        console.log('##DEBUG config: '+JSON.stringify(config));
        const cartRes = await axios.get(url, config);
        console.log('##DEBUG cartRes: '+cartRes);

        // Get Cart Items
        const cartItemUrl = SF_LOGIN_URL+'/services/data/v'+SF_API_VERSION+'/commerce/webstores/0ZE5e000000M1ApGAK/carts/'+cartRes.data.cartId+'/cart-items';
        const cartItemConfig = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer '+soapAuth.sessionId
            },
          }

        console.log('##DEBUG config: '+JSON.stringify(config));
        const cartItemRes = await axios.get(cartItemUrl, cartItemConfig);
        console.log('##DEBUG cartItemRes: '+cartItemRes);

        if (DEBUG === 'true') debugLogger.info('/api/cart', 'GET', id, 'Get cart items.', cartItemRes);

        if (!cartItemRes) {
            const error = new Error();
            error.message = 'Product not found.';
            error.status = 404;

            throw(error);
        }

        response.data = cartItemRes.data;
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

  /*
   * POST (Insert)
   */
  app.post('/api/cart', async function(req, res, next) {
    const { DEBUG, SF_CLIENT_ID, SF_CLIENT_SECRET, ORG_ID, SF_USERNAME, SF_PASSWORD, SF_LOGIN_URL, SF_API_VERSION } = process.env;
    const response = {...CONSTANTS.RESPONSE_OBJECT};

    try {
        const { cartId, productId, quantity } = req.query;

        if (!productId && !quantity) {
            const error = new Error();
            error.message = 'Required fields not found.';
            error.status = 206;

            throw(error);
        }

        // Make SOAP auth call for accessToken
        const soapAuthUrl = SF_SITE_URL+'/services/Soap/u/'+SF_API_VERSION;
        const soapAuthBody = `<?xml version="1.0" encoding="UTF-8"?>
            <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="urn:partner.soap.sforce.com">
            <SOAP-ENV:Header>
                <ns1:LoginScopeHeader>
                <ns1:organizationId>`+ORG_ID+`</ns1:organizationId>
                </ns1:LoginScopeHeader>
            </SOAP-ENV:Header>
            <SOAP-ENV:Body>
                <ns1:login>
                <ns1:username>`+SF_USERNAME+`</ns1:username>
                <ns1:password>`+SF_PASSWORD+`</ns1:password>
                </ns1:login>
            </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>`;
        const soapConfig = {
            headers: {
                'Content-Type' : 'text/xml',
                'SOAPAction': 'login',
                'charset': 'UTF-8'
            }
          }
        const soapAuth = await axios.post(soapAuthUrl, soapAuthBody, soapConfig);

        if (!cartId) {
            // Get CartId
            const url = SF_LOGIN_URL+'/services/data/v'+SF_API_VERSION+'/commerce/webstores/0ZE5e000000M1ApGAK/carts/active';
          
            let config = {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer '+conn.accessToken
                },
            }

            console.log('##DEBUG config: '+JSON.stringify(config));
            const cart = await axios.post(url, config);
            cartId = cart.data.cartId;
        }

        // Post Updated Items
        const cartAddUrl = SF_LOGIN_URL+'/services/data/v'+SF_API_VERSION+'/commerce/webstores/0ZE5e000000M1ApGAK/carts/'+cartId+'/cart-items';
          
        let cartAddConfig = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer '+conn.accessToken
            },
          }

        const cartAddBody = {
            productId: productId,
            quantity: quantity,
            type: 'Product'
        }

        console.log('##DEBUG cartAddConfig: '+JSON.stringify(cartAddConfig));
        const cartAddRes = await axios.get(cartAddUrl, cartAddBody, cartAddConfig);
        console.log('##DEBUG cartAddRes: '+cartAddRes);

        if (DEBUG === 'true') debugLogger.info('/api/cart', 'GET', id, 'Insert new cart items', cartAddRes.data);

        if (!cartAddRes) {
            const error = new Error();
            error.message = 'Product not found.';
            error.status = 404;

            throw(error);
        }

        response.data = cartAddRes.data;
        response.success = true;

        res.status(200).send(response);

    } catch (error) {
      const { cartId, productId, quantity } = req.query;

      response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
      response.error.message = error.message || 'Internal Server Error';
      response.error.status = error.status || 500;
      response.success = false;

      if (DEBUG === 'true') debugLogger.info('/api/cart', 'POST', cartId, 'Exception', response);

      res.status(error.status || 500).send(response);
    }
  });

};