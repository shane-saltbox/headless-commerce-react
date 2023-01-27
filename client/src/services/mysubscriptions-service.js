import LoggingService from './logging-service';

class MySubscriptionsService {
  constructor(bu, id, lang, wsBaseUrl, jobid, listid, batchid) {
    this.bu = bu;
    this.id = id;
    this.lang = lang;
    this.logger = new LoggingService(wsBaseUrl);
    this.wsBaseUrl = wsBaseUrl;
    this.jobid = jobid;
    this.listid = listid;
    this.batchid = batchid;
  }

  /*
   * GET (Read)
   * URI: https://ncpc-horizontal.herokuapp.com/subscriptions?id={{USER_ID}}&langBU={{BUSINESS_UNIT}}
   */
  async get() {
    const wsUri = `${this.wsBaseUrl}/subscriptions?id=${this.id}&langBU=${this.lang}-${this.bu}`;

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
   * DELETE (Delete)
   * URI: https://ncpc-horizontal.herokuapp.com/campaigns
   * PAYLOAD:
   * {
   *   "campaignId":"{{ }}",
   *   "campaignMemberId": "{{ }}",
   *   "id": "{{USER_ID}}"
   *   "status":"false",
   * }
   */
  async deleteCampaign(campaignMemberId, checked, id) {
    const wsUri = `${this.wsBaseUrl}/campaigns`;

    const body = {
      campaignMemberId,
      id,
      value: checked,
    };

    const options = {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
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
   * PATCH (Update/Modify) [Subscription)
   * URI: https://ncpc-horizontal.herokuapp.com/subscriptions
   * PAYLOAD:
   * {
   *   "availableSubId":"{{ }}",
   *   "id": "{{USER_ID}}",
   *   "value":"{{FIELD_VALUE}}"
   * }
   */
  async patchSubscription(availableSubId, fieldValue, subId, jobid, listid, batchid) {
    const wsUri = `${this.wsBaseUrl}/subscriptions`;

    const body = {
      availableSubId,
      id: this.id,
      value: fieldValue,
      subId,
      jobid,
      listid,
      batchid,
    };

    const options = {
      body: JSON.stringify(body),
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
   * DELETE (Unsubscribe All)
   * URI: https://ncpc-horizontal.herokuapp.com/subscriptions
   * PAYLOAD:
   * {
   *   "id": "{{USER_ID}}",
   * }
   */
  async deleteUnsubscribeAll() {
    const wsUri = `${this.wsBaseUrl}/subscriptions`;

    const body = {
      id: this.id,
    };

    const options = {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
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
   * PATCH (Update/Modify) [Subscription)
   * URI: https://ncpc-horizontal.herokuapp.com/subscriptions
   * PAYLOAD:
   * {
   *   "availableSubId":"{{ }}",
   *   "id": "{{USER_ID}}",
   *   "value":"{{FIELD_VALUE}}"
   * }
   */
  async unsubscribeAll(superUnsubscribeAllEnabled) {
    const wsUri = `${this.wsBaseUrl}/subscriptions/unsubscribeAll`;
    const body = {
      id: this.id,
      jobid: this.jobid,
      listid: this.listid,
      batchid: this.batchid,
      superUnsubscribeAllEnabled,
      langBU: `${this.lang}-${this.bu}`,
    };

    const options = {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
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

export default MySubscriptionsService;
