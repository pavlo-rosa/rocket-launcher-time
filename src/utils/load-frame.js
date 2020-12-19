const config = require('../config/config')
const logger = require('../config/logger')('src/utils/load-frame.js');
const got = require('got');

//Development environment call to fake data
//Following next structure: https://API_DOMAIN/api/video/VIDEO_NAME/frame/42/
const URL_BASE = `https://${config.API_DOMAIN}/api/video/${config.VIDEO_NAME}/`;

async function getMaxFrames() {
    try {
        if (config.NODE_ENV === 'development') {
            return 61696;
        } else {
            const response = await got(URL_BASE);
            const body = JSON.parse(response.body);
            return body.frames;
        }
    } catch (error) {
        logger.error(error.response.body);
    }
}

function getURLFrameByID(id) {
    if (config.NODE_ENV === 'development') {
        return 'https://tvline.com/wp-content/uploads/2018/08/image.jpeg';
    } else {
        return URL_BASE + `frame/${id}/`;
    }
}

module.exports = {
    getMaxFrames,
    getURLFrameByID,
};
