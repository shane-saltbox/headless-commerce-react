class MyProductService {
  constructor(sku, effectiveAccountId, wsBaseUrl) {
    this.sku = sku;
    this.effectiveAccountId = effectiveAccountId;
    this.wsBaseUrl = wsBaseUrl;
  }

  /*
   * GET (Read)
   * URI: https://headless-commerce.herokuapp.com/api/productDetail?sku={{SKU}}&effectiveAccountId={{EFFECTIVEACCOUNTID}}
   */
  async get() {
    //const wsUri = `https://headless-commerce.herokuapp.com/api/productDetail?sku=${this.sku}&effectiveAccountId=${this.effectiveAccountId}`;
    const wsUri = `https://headless-commerce.herokuapp.com/api/productDetail?sku=800984&effectiveAccountId=0015e00000MMkzQAAT`;

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
        console.log('##DEBUG service: '+JSON.stringify(response.data));

        return response.data;
      })
      .catch((error) => {
        // this.logger.post(wsUri, error, '500');

        throw error;
      });
  }
}

export default MyProductService;
