const db = require('../db');
const randomstring = require('randomstring');
const uuid = require('uuid');
var xmlparser = require('express-xml-bodyparser');

const CONSTANTS = require('../constants');

module.exports = function(app, debugLogger) {

  /*
   * POST (Insert)
   */
  app.post('/api/delegatedAuthorization', xmlparser({trim: false, explicitArray: false}), async function(req, res, next) {
    const { DEBUG, SCHEMA } = process.env;
    //const datestamp = dateFormat(new Date(), 'isoDateTime');
    const response = {...CONSTANTS.RESPONSE_OBJECT};
    //const today = dateFormat(new Date(), 'yyyy-mm-dd');
    
    console.log("inside post delegatedAuthorization call");

    try {
        const { token } = req.body;

        console.log("request body" + JSON.stringify(req.body));
        console.log("request headers" + JSON.stringify(req.headers));
      
        //if (DEBUG === 'true') debugLogger.info('/api/delegatedAuthorization', 'POST', token, 'Delegated Authorization query.', req);

        response.data = token;
        response.success = true;

        var xmlResponse = '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"><soapenv:Body><AuthenticateResult xmlns="urn:authentication.soap.sforce.com"><Authenticated>true</Authenticated></AuthenticateResult></soapenv:Body></soapenv:Envelope>';

        console.log("response " + JSON.stringify(xmlResponse));

        res.status(200).send(xmlResponse);

    } catch (error) {
      console.log("inside post delegatedAuthorization error");
      const { id } = req.query;

      response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
      response.error.message = error.message || 'Internal Server Error';
      response.error.status = error.status || 500;
      response.success = false;

      if (DEBUG === 'true') debugLogger.info('/api/updateInventory', 'PATCH', id, 'Exception', response);

      res.status(error.status || 500).send(response);
    }
  });
};