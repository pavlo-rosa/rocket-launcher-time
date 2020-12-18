// let maxFrame = 61695;
// let   frameURL = `https://framex-dev.wadrid.net/api/video/Falcon%20Heavy%20Test%20Flight%20(Hosted%20Webcast)-wbSwFU6tY1c/frame/${Math.floor(
//     Math.random() * maxFrame
// )}`;

// https://API_DOMAIN/api/video/VIDEO_NAME/frame/42/
const got = require("got");

let URL_BASE = `https://${process.env.API_DOMAIN}/api/video/${process.env.VIDEO_NAME}/`;
console.log(URL_BASE);

async function getMaxFrames() {
  try {
    if (process.env.NODE_ENV === "development") {
      return 61696;
    } else {
      const response = await got(URL_BASE);
      const body = JSON.parse(response.body);
      // console.log(response.body);
      return body.frames;
    }
  } catch (error) {
    console.log(error.response.body);
    return null;
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
