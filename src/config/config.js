require('dotenv').config();

//TODO: (Future) possible to parametrize [apiDomain , videoName]
let apiDomain;
let videoName;

module.exports = {
    API_DOMAIN: apiDomain || process.env.API_DOMAIN,
    VIDEO_NAME: videoName || process.env.VIDEO_NAME,
    NODE_ENV: process.env.NODE_ENV,
    BOT_TOKEN: process.env.BOT_TOKEN,
    ENABLE_REDIS: process.env.ENABLE_REDIS ? (process.env.ENABLE_REDIS === 'true') : true,
    REDIS_TIME: process.env.CACHE_TIME || 3600*24*7,
    REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
