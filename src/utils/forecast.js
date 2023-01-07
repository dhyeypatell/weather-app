const request = require("request");
const data = require("../../data/utils/forecast.json");

const forecast = (latitude, longitude, callback) => {
  const url = data.requestUrl + latitude + "," + longitude;

  request({ url, json: true }, (error, { body } = {}) => {
    if (error) {
      callback(data.requestErrorMessage);
    } else if (body.error) {
      callback(data.locationNotFoundMessage);
    } else {
      callback(
        undefined,
        body.current.weather_descriptions[0] +
          ". It is currently " +
          body.current.temperature +
          " °C. It feels like " +
          body.current.feelslike +
          "."
      );
    }
  });
};

module.exports = forecast;
