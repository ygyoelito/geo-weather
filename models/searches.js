const fs = require("fs");
const axios = require("axios");

class Searches {
  logSearch = [];
  dbPath = "./db/database.json";

  constructor() {
    //leer de la DB si existe
    this.readDB();
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY, //token from mapbox.com
      limit: 5,
      language: "en",
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      lang: "en",
      units: "metric",
    };
  }

  async findCitys(place = "") {
    //petición http
    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapbox,
      });

      const resp = await intance.get();
      return resp.data.features.map((point) => ({
        id: point.id,
        nombre: point.place_name,
        lng: point.center[0],
        lat: point.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async findWeatherByPoint(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/3.0/onecall`,
        params: { ...this.paramsWeather, lat, lon },
      });

      const resp = await instance.get();

      const info = resp.data.current;
      return {
        temp: info.temp,
        sunrise: this.timePoint(info.sunrise),
        sunset: this.timePoint(info.sunset),
        humidity: info.humidity,
        description: this.capitalizeMe(info.weather[0].description),
      };
    } catch (error) {
      console.log(error);
    }
  }

  //Formatter functions
  timePoint = (time) => {
    let t = new Date(time * 1000);
    return t.toLocaleTimeString("en-US");
  };

  capitalizeMe = (str) => {
    const result = str.charAt(0).toUpperCase() + str.slice(1);
    return result;
  };

  //Save Searches History
  saveSearches = (place = "") => {
    if (!this.logSearch.includes(place)) {
      this.logSearch.unshift(place);

      if (this.logSearch.length > 5) {
        this.logSearch.pop();
      }
      this.saveDB();
    }
  };

  saveDB() {
    const payload = {
      history: this.logSearch,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readDB() {
    //check if exist...
    if (!fs.existsSync(this.dbPath)) return;    

    //read data...
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });

    //convert JSON string into an object
    const data = JSON.parse(info);

    //set logSearch property with the saved data
    this.logSearch = data.history;
  }

  cleardB () {
    this.logSearch = [];
    this.saveDB();
  }
}
module.exports = Searches;
