class LoggingService {
  constructor(wsBaseUrl) {
    this.wsBaseUrl = wsBaseUrl;
  }

  /*
   * POST
   * URI: https://ncpc-horizontal.herokuapp.com/log
   * PAYLOAD:
   * {
   *   "endpoint": "",
   *   "errorMessage": "",
   *   "overallStatus":"",
   *   "requestPayload":"",
   * }
   */
  async post(endpoint, errorMessage, overallStatus, requestPayload) {
    const wsUri = `${this.wsBaseUrl}/logs`;

    const data = {
      endpoint,
      errorMessage,
      overallStatus,
      requestPayload,
    };

    const options = {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    };

    return fetch(wsUri, options)
      .then((response) => response.json());
  }
}

export default LoggingService;
