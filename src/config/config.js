require('dotenv').config();

//TODO: (Future) possible to parametrize [apiDomain , videoName]
let apiDomain;
let videoName;

module.exports = {
    API_DOMAIN: apiDomain || process.env.API_DOMAIN,
    VIDEO_NAME: videoName || process.env.VIDEO_NAME,
    NODE_ENV: process.env.NODE_ENV,
    BOT_TOKEN: process.env.BOT_TOKEN,
};
