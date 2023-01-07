const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");
const getCurrentYear = require("./utils/currentYear");
const data = require("../data/app.json");

const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

const envPort = process.env.PORT;
const port = envPort || 3000;

app.use(express.static(publicDirectoryPath));

if (!envPort) {
  const livereload = require("livereload");
  const connectLivereload = require("connect-livereload");

  app.use(connectLivereload());
  const liveReloadServer = livereload.createServer();

  liveReloadServer.watch(publicDirectoryPath);

  liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
      liveReloadServer.refresh("/");
    }, 100);
  });
}

app.set("view engine", "hbs");
app.set("views", viewPath);

hbs.registerHelper("currentYear", getCurrentYear);

hbs.registerPartials(partialsPath);

app.get(data.home.slug, ({ res }) => {
  res.render("home", {
    title: data.home.title,
    subTitle: data.home.subTitle,
  });
});

app.get(data.about.slug, ({ res }) => {
  res.render("about", {
    title: data.about.title,
    shortUrl: data.about.shortUrl,
  });
});

app.get(data.weather.slug, (req, res) => {
  if (!req.query.address) {
    return res.send({ error: data.weather.apiRequest.errorMessage });
  }

  geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({ forecast: forecastData, location, address: req.query.address });
    });
  });
});

app.get("*", ({ res }) => {
  res.render("404", {
    title: data.custom404.title,
    errorMessage: data.custom404.errorMessage,
  });
});

app.listen(
  port,
  !envPort &&
    (() => {
      console.log("Port: " + port);
      console.log("Server URL: http://localhost:" + port);
    })
);
