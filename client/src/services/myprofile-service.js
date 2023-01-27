import LoggingService from './logging-service';

class MyProfileService {
  constructor(bu, id, lang, wsBaseUrl) {
    this.bu = bu;
    this.id = id;
    this.lang = lang;
    this.logger = new LoggingService(wsBaseUrl);
    this.wsBaseUrl = wsBaseUrl;
  }

  /*
   * GET (Read)
   * URI: https://ncpc-horizontal.herokuapp.com/profile?id={{USER_ID}}&langBU={{BUSINESS_UNIT}}
   */
  async get() {
    const wsUri = `${this.wsBaseUrl}/profile?id=${this.id}&langBU=${this.lang}-${this.bu}`;

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
   * PATCH (Update/Modify)
   * URI: https://ncpc-horizontal.herokuapp.com/profile
   * PAYLOAD:
   * {
   *   "field":"{{FIELD_NAME}}",
   *   "id": "{{USER_ID}}",
   *   "value":"{{FIELD_VALUE}}"
   * }
   */
  async patch(fieldId, fieldName, fieldValue) {
    const wsUri = `${this.wsBaseUrl}/profile`;

    const data = {
      fieldId,
      fieldName,
      id: this.id,
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

  /*
   * POST
   * URI: https://ncpc-horizontal.herokuapp.com/profile
   * PAYLOAD:
   * {
   *   "id": "{{USER_ID}}"
   * }
   */
  async postForgetMe() {
    const wsUri = `${this.wsBaseUrl}/forgetMe`;

    const data = {
      id: this.id,
    };

    const options = {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };

    return fetch(wsUri, options)
      .then((response) => response.json())
      .then((response) => {
        if (response.error || response.success === false) {
          const endpoint = wsUri;
          const message = (response.error ? response.error.message : '');
          const status = (response.error ? response.error.status : 200);
          const payload = response.data;

          this.logger.post(endpoint, message, status, payload);
        }

        return response;
      })
      .catch((error) => {
        this.logger.post(wsUri, error, '500', options);

        throw error;
      });
  }
}

export default MyProfileService;
