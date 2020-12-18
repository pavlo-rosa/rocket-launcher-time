const got = require("got");

//Development environment call to fake data
//Following next structure: https://API_DOMAIN/api/video/VIDEO_NAME/frame/42/
let URL_BASE = `https://${process.env.API_DOMAIN}/api/video/${process.env.VIDEO_NAME}/`;


async function getMaxFrames() {
  try {
    if (process.env.NODE_ENV === "development") {
      return 61696;
    } else {
      const response = await got(URL_BASE);
      const body = JSON.parse(response.body);
      return body.frames;
    }
  } catch (error) {
    console.log(error.response.body);
    return 0;
  }
}

function getURLFrameByID(id) {
  if (process.env.NODE_ENV === "development") {
    return "https://tvline.com/wp-content/uploads/2018/08/image.jpeg";
  } else {
    return URL_BASE + `frame/${id}/`;
  }
}

module.exports = {
  getMaxFrames,
  getURLFrameByID,
};
