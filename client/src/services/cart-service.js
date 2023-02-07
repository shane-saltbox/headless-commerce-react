import LoggingService from './logging-service';

class MyCartService {
  constructor(cartId, productId, quantity) {
    this.cartId = cartId;
    this.productId = productId;
    this.quantity = quantity;
  }

  /*
   * GET (Read)
   * URI: https://headless-commerce.herokuapp.com/api/cart
   */
  async get() {
    const wsUri = `https://headless-commerce.herokuapp.com/api/cart`;

    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    };

    return fetch(wsUri, options)
      .then((response) => response.json())
      .then((response) => {
        // if (response.error || response.success === false) {
        //   const endpoint = wsUri;
        //   const message = (response.error ? response.error.message : '');
        //   const status = (response.error ? response.error.status : 200);
        //   const payload = response.data;

        //   this.logger.post(endpoint, message, status, payload);
        // }

        return response;
      })
      .catch((error) => {
        // this.logger.post(wsUri, error, '500');

        throw error;
      });
  }

  /*
   * POST (Insert) [Cart)
   * URI: https://headless-commerce.herokuapp.com/api/cart
   * PAYLOAD:
   * {
   *   "cartId":"{{CART_ID}}",
   *   "productId": "{{PRODUCT_ID}}",
   *   "quantity":"{{QUANTITY}}"
   * }
   */
  async postCart(cartId, productId, quantity) {
    const wsUri = `https://headless-commerce.herokuapp.com/api/cart`;

    const body = {
      "cartId": cartId,
      "productId": productId,
      "quantity": quantity,
    };

    const options = {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };

    return fetch(wsUri, options)
      .then((response) => response.json())
      .then((response) => {
        // if (response.error || response.success === false) {
        //   const endpoint = wsUri;
        //   const message = (response.error ? response.error.message : '');
        //   const status = (response.error ? response.error.status : 200);
        //   const payload = response.data;

        //   this.logger.post(endpoint, message, status, payload);
        // }

        return response;
      })
      .catch((error) => {
        // this.logger.post(wsUri, error, '500', options);

        throw error;
      });
  }
  
}

export default MyCartService;
