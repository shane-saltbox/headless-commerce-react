import LoggingService from './logging-service';
import fetch from 'node-fetch';

class QandAService {
  constructor(bu, id, lang, wsBaseUrl) {
    this.bu = bu;
    this.id = id;
    this.lang = lang;
    this.logger = new LoggingService(wsBaseUrl);
    this.wsBaseUrl = wsBaseUrl;
  }

  /*
   * GET (Read)
   * URI: https://ncpc-horizontal.herokuapp.com/qanda?id={{USER_ID}}&langBU={{BUSINESS_UNIT}}
   */
  async get() {
    const wsUri = `${this.wsBaseUrl}/qanda?id=${this.id}&langBU=${this.lang}-${this.bu}`;

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

        // throw error;
      });
  }

  /*
   * PATCH ()
   * URI: https://ncpc-horizontal.herokuapp.com/qanda?id={{USER_ID}}
   * PAYLOAD:
   * {
   *   "source":"Preference Center",
   *   "options": [],
   *   "question": {}
   * }
   */
  async patch(source, question, opts) {
    const wsUri = `${this.wsBaseUrl}/qanda?id=${this.id}`;

    const data = {
      opts,
      question,
      source,
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

export default QandAService;
