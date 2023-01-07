const request = require("request");
const data = require("../../data/utils/geocode.json");

const geocode = (address, callback) => {
  const url = data.baseUrl + encodeURIComponent(address) + data.query;

  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback(data.requestErrorMessage);
    } else if (body.features.length === 0) {
      callback(data.locationNotFoundMessage);
    } else {
      callback(undefined, {
        latitude: body.features[0].center[1],
        longitude: body.features[0].center[0],
        location: body.features[0].place_name,
      });
    }
  });
};

module.exports = geocode;
