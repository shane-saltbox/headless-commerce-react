const db = require('../db');
const randomstring = require('randomstring');
const uuid = require('uuid');

const CONSTANTS = require('../constants');

module.exports = function(app, debugLogger) {

  /*
   * GET (Read)
   */
  app.get('/api/checkInventory', async function(req, res, next) {
    const { DEBUG, SCHEMA } = process.env;
    const response = {...CONSTANTS.RESPONSE_OBJECT};

    try {
      const { product_sku } = req.query;

      if (!product_sku) {
        const error = new Error();
        error.message = 'Required fields not found.';
        error.status = 206;

        throw(error);
      }

      const query_inventory = `
        SELECT id, product_sku, quantity
        FROM ${SCHEMA}.inventory
        WHERE product_sku = '${product_sku}' 
      `;

      if (DEBUG === 'true') debugLogger.info('/api/checkInventory', 'GET', product_sku, 'Inventory Level query.', query_inventory);

      const response_inventory = await db.query(query_inventory);

      if (!response_inventory || !response_inventory.rows.length) {
        const error = new Error();
        error.message = 'Inventory not found.';
        error.status = 404;

        throw(error);
      }

      response.data = response_inventory.rows;
      response.success = true;

      res.status(200).send(response);

    } catch (error) {
      const { id } = req.query;

      response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
      response.error.message = error.message || 'Internal Server Error';
      response.error.status = error.status || 500;
      response.success = false;

      if (DEBUG === 'true') debugLogger.info('/api/checkInventory', 'GET', id, 'Exception', response);

      res.status(error.status || 500).send(response);
    }
  });

  /*
   * GET (Read)
   */
  app.get('/api/batchInventory', async function(req, res, next) {
    const { DEBUG, SCHEMA } = process.env;
    const response = {...CONSTANTS.RESPONSE_OBJECT};

    try {
      const { product_sku } = req.query;

      const query_inventory = `
        SELECT id, product_sku, quantity
        FROM ${SCHEMA}.inventory
      `;

      if (DEBUG === 'true') debugLogger.info('/api/batchInventory', 'GET', product_sku, 'Batch Inventory Level query.', query_inventory);

      const response_inventory = await db.query(query_inventory);

      if (!response_inventory || !response_inventory.rows.length) {
        const error = new Error();
        error.message = 'Inventory not found.';
        error.status = 404;

        throw(error);
      }

      response.data = response_inventory.rows;
      response.success = true;

      res.status(200).send(response);

    } catch (error) {
      const { id } = req.query;

      response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
      response.error.message = error.message || 'Internal Server Error';
      response.error.status = error.status || 500;
      response.success = false;

      if (DEBUG === 'true') debugLogger.info('/api/checkInventory', 'GET', id, 'Exception', response);

      res.status(error.status || 500).send(response);
    }
  });

  /*
   * PATCH (Update/Modify)
   */
  app.patch('/api/updateInventory', async function(req, res, next) {
    const { DEBUG, SCHEMA } = process.env;
    //const datestamp = dateFormat(new Date(), 'isoDateTime');
    const response = {...CONSTANTS.RESPONSE_OBJECT};
    //const today = dateFormat(new Date(), 'yyyy-mm-dd');
    
    console.log("inside post call");

    try {
      const { product_sku, quantity } = req.body;

      if (!product_sku || !quantity === null) {
        const error = new Error();
        error.message = 'Required fields not found.';
        error.status = 206;

        throw(error);
      }

      const query_inventory = `
        SELECT id, product_sku, quantity 
        FROM ${SCHEMA}.inventory
        WHERE product_sku = '${product_sku}' 
      `;

      const results_getInventory = await db.query(query_inventory);

      if (results_getInventory.rows && (results_getInventory.rows[0][`quantity`] === 0)) {
        const error = new Error();
        error.message = 'No Inventory. Updates are not allowed.';
        error.status = 500;

        throw(error);
      }

      if (DEBUG === 'true') debugLogger.info('/api/updateInventory', 'PATCH', product_sku, 'Inventory query.', query_inventory);

      // this would allow you to take the existing inventory and subtract it from new amount.
      //const updatedQuantity = results_getInventory.rows[0][`quantity`] - quantity;

      // Update record...
      query_updateInventory = `
        UPDATE 
          ${SCHEMA}.inventory 
        SET 
          quantity=$1
        WHERE 
          id = $2
        RETURNING 
          id, quantity
      `;

      if (DEBUG === 'true') debugLogger.info('/api/updateInventory', 'PATCH', results_getInventory.rows[0][`quantity`], 'Update inventory query.', query_updateInventory);

      results_updateInventory = await db.query(query_updateInventory, [quantity, results_getInventory.rows[0][`id`]]);


      response.data = results_updateInventory.rows;
      response.success = true;

      res.status(200).send(response);

    } catch (error) {
      const { id } = req.query;

      response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
      response.error.message = error.message || 'Internal Server Error';
      response.error.status = error.status || 500;
      response.success = false;

      if (DEBUG === 'true') debugLogger.info('/api/updateInventory', 'PATCH', id, 'Exception', response);

      res.status(error.status || 500).send(response);
    }
  });

  /*
   * PATCH (Update/Modify)
   */
  app.patch('/api/updateInventoryWithLocation', async function(req, res, next) {
    const { DEBUG, SCHEMA } = process.env;
    //const datestamp = dateFormat(new Date(), 'isoDateTime');
    const response = {...CONSTANTS.RESPONSE_OBJECT};
    //const today = dateFormat(new Date(), 'yyyy-mm-dd');
    
    console.log("inside post call");

    try {
      const { productId, quantity, locationId } = req.body;

      if (!productId || !quantity || !locationId === null) {
        const error = new Error();
        error.message = 'Required fields not found.';
        error.status = 206;

        throw(error);
      }

      const query_inventory = `
        SELECT id, product_sku, quantity 
        FROM ${SCHEMA}.inventory
        WHERE product_sku = $1 AND location_id = $2
      `;

      const results_getInventory = await db.query(query_inventory, [productId, locationId]);

      if (results_getInventory.rows && (results_getInventory.rows[0][`quantity`] === 0)) {
        const error = new Error();
        error.message = 'No Inventory. Updates are not allowed.';
        error.status = 500;

        throw(error);
      }

      if (DEBUG === 'true') debugLogger.info('/api/updateInventory', 'PATCH', productId, 'Inventory query.', query_inventory);

      const updatedQuantity = results_getInventory.rows[0][`quantity`] - quantity;

      // Update record...
      query_updateInventory = `
        UPDATE 
          ${SCHEMA}.inventory 
        SET 
          quantity=$1
        WHERE 
          id = $2
        RETURNING 
          id, quantity
      `;

      if (DEBUG === 'true') debugLogger.info('/api/updateInventory', 'PATCH', results_getInventory.rows[0][`quantity`], 'Update inventory query.', query_updateInventory);

      results_updateInventory = await db.query(query_updateInventory, [updatedQuantity, results_getInventory.rows[0][`id`]]);


      response.data = results_updateInventory.rows;
      response.success = true;

      res.status(200).send(response);

    } catch (error) {
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