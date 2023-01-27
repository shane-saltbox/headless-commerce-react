'use strict';

require('dotenv').config();

const requiredEnvVars = [
    'SF_CLIENT_ID',
    'SF_CLIENT_SECRET',
    'SF_LOGIN_URL',
    'SF_USERNAME'
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
    apiVersion: process.env.SF_API_VERSION || defaultSalesforceApiVersion
};

module.exports = {
    salesforce
};
