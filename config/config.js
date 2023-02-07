'use strict';

require('dotenv').config();

const requiredEnvVars = [
    'SF_CLIENT_ID',
    'SF_CLIENT_SECRET',
    'SF_LOGIN_URL',
    'SF_USERNAME',
    'ORG_ID',
    'WEB_STORE'
];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Missing ${envVar} environment variable`);
        process.exit(-1);
    }
});

const defaultSalesforceApiVersion = '54.0';

const salesforce = {
    clientId: process.env.SF_CLIENT_ID,
    clientSecret: process.env.SF_CLIENT_SECRET,
    loginUrl: process.env.SF_LOGIN_URL,
    username: process.env.SF_USERNAME,
    apiVersion: process.env.SF_API_VERSION || defaultSalesforceApiVersion,
    org_id: process.env.ORG_ID,
    web_store: process.env.WEB_STORE,
};

module.exports = {
    salesforce
};
