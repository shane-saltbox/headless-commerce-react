const db = require('../db');
const axios = require('axios');
const parseString = require('xml2js');

const CONSTANTS = require('../constants');

module.exports = function(app, debugLogger) {

  /*
   * GET (Read)
   */
  app.get('/api/productDetail', async function(req, res, next) {
    const { DEBUG, SF_CLIENT_ID, SF_CLIENT_SECRET, SF_USERNAME, ORG_ID, SF_SITE_URL, SF_PASSWORD, SF_LOGIN_URL, SF_API_VERSION } = process.env;
    const response = {...CONSTANTS.RESPONSE_OBJECT};

    try {
        const { sku,effectiveAccountId } = req.query;

        if (!sku && !effectiveAccountId) {
            const error = new Error();
            error.message = 'Required fields not found.';
            error.status = 206;

            throw(error);
        }

        /* var conn = new jsforce.Connection({
            oauth2 : {
                clientId : SF_CLIENT_ID,
                clientSecret : SF_CLIENT_SECRET,
                redirectUri : 'https://headless-commerce.herokuapp.com/callback'
            }
        });

        await conn.login(SF_USERNAME, SF_PASSWORD, function(err, userInfo) {
            if (err) { return console.error(err); }
        }); */

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
        const auth = await parseString.parseStringPromise(soapAuth.data, { mergeAttrs: true })
        const accessToken = auth['soapenv:Envelope']['soapenv:Body'][0].loginResponse[0].result[0].sessionId[0];

        const url = SF_LOGIN_URL+'/services/data/v'+SF_API_VERSION+'/commerce/webstores/0ZE5e000000M1ApGAK/products';
          
        let config = {
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': 'Bearer '+accessToken
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