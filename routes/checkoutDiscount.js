const db = require('../db');
const randomstring = require('randomstring');
const uuid = require('uuid');

const CONSTANTS = require('../constants');

module.exports = function(app, debugLogger) {

  /*
   * GET (Read)
   */
  app.get('/api/checkoutDiscount', async function(req, res, next) {
    const { DEBUG, SCHEMA } = process.env;
    const response = {...CONSTANTS.RESPONSE_OBJECT};

    try {
      const { id } = req.query;

      if (!id) {
        const error = new Error();
        error.message = 'Required fields not found.';
        error.status = 206;

        throw(error);
      }

      const query_inventory = `
        SELECT id, product_id, quantity
        FROM ${SCHEMA}.inventory
        WHERE id = ${id} 
      `;

      if (DEBUG === 'true') debugLogger.info('/api/checkInventory', 'GET', id, 'Inventory Level query.', query_inventory);

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
  app.patch('/api/checkoutDiscount', async function(req, res, next) {
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
        SELECT id, product_id, quantity 
        FROM ${SCHEMA}.inventory
        WHERE product_id = $1 AND location_id = $2
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

  /*
   * POST (Insert)
   */
  app.post('/api/checkoutDiscount', async function(req, res, next) {
    const { DEBUG, SCHEMA } = process.env;
    const response = {...CONSTANTS.RESPONSE_OBJECT};

    try {
      const { createOrderSummaryRequest } = req.body;

      if (!createOrderSummaryRequest.orderSummary || !createOrderSummaryRequest.orderProductSummaries) {
        const error = new Error();
        error.message = 'Required fields not found.';
        error.status = 206;

        throw(error);
      }

      let dataResponse = {
        orderProducts: [
            {
                orderProductSummaryId: "01t0n000003ZtkfAAC",
                adjustmentAmount: "100.00",
                status: "approved",
                reason: ""
            },
            {
                orderProductSummaryId: "01t0n000003ZtkfAAC",
                adjustmentAmount: "100.00",
                status: "denied",
                reason: "This product is not allowed"
            }
        ]
      };

      response.data = dataResponse;
      response.success = true;
      response.status = 'approved';
      response.reason = "";

      res.status(200).send(response);

    } catch (error) {
      const { id } = req.query;

      response.error = {...CONSTANTS.RESPONSE_ERROR_OBJECT};
      response.error.message = error.message || 'Internal Server Error';
      response.error.status = error.status || 500;
      response.success = false;
      response.status = 'denied';
      response.reason = error.message;

      if (DEBUG === 'true') debugLogger.info('/api/checkoutDiscount', 'POST', id, 'Exception', response);

      res.status(error.status || 500).send(response);
    }
  });
};