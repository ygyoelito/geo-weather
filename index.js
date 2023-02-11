require("dotenv").config();

const {
  inquirerMenu,
  pausa,
  leerInput,
  confirmar,
  listarLugares,
} = require("./helpers/inquirer");

const Searches = require("./models/searches");

const main = async () => {
  let opt = 0;
  let flagA, flagB = false;

  const search = new Searches();

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Ask for the place you want to look for
        const searchCriteria = await leerInput("Point of interest:");

        // Look for places
        const points = await search.findCitys(searchCriteria);

        //Select a place
        const pointId = await listarLugares(points);

        if (pointId !== 0) {
          //validating '0. Cancel' option
          const selectedPoint = points.find((place) => place.id === pointId);
          let { nombre, lng, lat } = selectedPoint;

          //Save in DB
          search.saveSearches(nombre);

          //Climate data
          const weather = await search.findWeatherByPoint(lat, lng);
          let { temp, sunrise, sunset, humidity, description } = weather;

          //Show results
          //console.clear();
          console.log("\nInformation about".green, `${nombre}\n`.yellow);
          console.log("Latitude:", `${lat}`.red);
          console.log("Longitude:", `${lng}`.red);
          console.log("Temperature:", `${temp} ºC`.red);
          console.log("Sunrise:", `${sunrise}`.red);
          console.log("Sunset:", `${sunset}`.red);
          console.log("Humidity:", `${humidity} %`.red);
          console.log("Description:", `${description}`.red);

          await pausa();
          break;
        } else {
          continue;
        }

      case 2:
        if (search.logSearch.length > 0) {
          search.logSearch.forEach((place, index) => {
            const idx = `${index + 1}.`.green;
            console.log(idx, place);
          });
        } else {
          console.log("Empty record".bgBlue);
        }
        await pausa();
        break;

      case 3:
        flagA = await confirmar("Are you sure want to delete searchs history?");
        if (flagA) {
          search.cleardB();
          console.log("Record deleted");         
        } else {
          opt = 0;          
        }
        break;

      case 4:
        flagB = await confirmar("Are you sure want to leave?");
        if (!flagB) {
          opt = 0;
          break;
        }
    }
  } while (opt !== 4);
};

main();
