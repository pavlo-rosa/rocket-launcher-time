const config = require('../config/config');
const logger = require('../config/logger')('src/helpers/load-frame.js');
const got = require('got');

//Following next structure: https://API_DOMAIN/api/video/VIDEO_NAME/frame/42/
const URL_BASE = `https://${config.API_DOMAIN}/api/video/${config.VIDEO_NAME}/`;

async function getMaxFrames() {
    try {
        const response = await got(URL_BASE);
        const body = JSON.parse(response.body);
        return body.frames;
    } catch (error) {
        logger.error(error.response.body);
    }
}

function getURLFrameByID(id) {
    return URL_BASE + `frame/${id}/`;
}

module.exports = {
    getMaxFrames,
    getURLFrameByID,
};
