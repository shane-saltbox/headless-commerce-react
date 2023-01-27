import LoggingService from './logging-service';

class MyInterestsService {
  constructor(bu, id, lang, wsBaseUrl) {
    this.bu = bu;
    this.id = id;
    this.lang = lang;
    this.logger = new LoggingService(wsBaseUrl);
    this.wsBaseUrl = wsBaseUrl;
  }

  /*
   * GET
   * URI: https://ncpc-horizontal.herokuapp.com/interests?id={{USER_ID}}&langBU={{BUSINESS_UNIT}}
   */
  async get() {
    const wsUri = `${this.wsBaseUrl}/interests?id=${this.id}&langBU=${this.lang}-${this.bu}`;

    return fetch(wsUri)
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
   * PATCH
   * URI: https://ncpc-horizontal.herokuapp.com/interest
   * PAYLOAD:
   * {
   *   "availableIntId": {{ }},
   *   "id": {{USER_ID}},
   *   "value": fieldValue
   * }
   */
  async patch(intId, availableIntId, fieldValue) {
    const wsUri = `${this.wsBaseUrl}/interests`;

    const data = {
      availableIntId,
      id: this.id,
      intId,
      value: fieldValue,
    };

    const options = {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
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

export default MyInterestsService;
