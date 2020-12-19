const redis = require('redis');
const config = require('../config/config');
const logger = require('../config/logger')('src/helpers/redis.js');

let client;
let CACHE_TIME;

if (config.ENABLE_REDIS === true) {
    client = redis.createClient({ url: config.REDIS_URL });

    CACHE_TIME = config.REDIS_TIME;

    client.on('connect', function () {
        logger.info('Redis client connected');
    });
    client.on('ready', function () {
        logger.info('Redis client ready');
    });
    client.on('reconnecting', function () {
        logger.info('Redis client reconnecting');
    });
    client.on('end', function () {
        logger.info('Redis client end');
    });
    client.on('warning', function () {
        logger.warn('Redis client warning');
    });

    client.on('error', function (err) {
        logger.error('Something went wrong ' + err);
    });
}

/**
 * GETTERS & SETTERS
 */

function setCache(key, value, timeout = CACHE_TIME) {
    if (config.ENABLE_REDIS === true) {
        logger.debug(`Setting cache key ${key}`);
        client.set(key, JSON.stringify(value), 'EX', timeout);
    }
}

async function getCache(key) {
    return new Promise((resolve, reject) => {
        if (config.ENABLE_REDIS === true) {
            logger.debug(`Getting cache key ${key}`);
            client.get(key, function (err, reply) {
                if (err) {
                    logger.error(err);
                }
                resolve(reply ? JSON.parse(reply) : null);
            });
        } else resolve(null);
    });
}

module.exports = {
    client,
    setCache,
    getCache,
};
