const inquirer = require("inquirer");
require("colors");

const preguntas = {
  type: "list",
  name: "opt_choice",
  message: "What do you want to do?",
  choices: [
    {
      value: 1,
      name: `${"1:".green} Find a Place`,
    },
    {
      value: 2,
      name: `${"2:".green} History`,
    },
    {
      value: 3,
      name: `${"3: Delete History".red}`,
    },
    {
      value: 4,
      name: `${"4:".green} Exit`,
    },
  ],
};

const inquirerMenu = async () => {
  console.clear();
  console.log("==========================".green);
  console.log("     Select an Option     ".cyan);
  console.log("==========================\n".green);

  const { opt_choice } = await inquirer.prompt(preguntas);
  return opt_choice;
};

const pausa = async () => {
  const question = [
    {
      type: "input",
      name: "enter",
      message: `Press ${"ENTER".green} to continue`,
    },
  ];
  console.log("\n");
  await inquirer.prompt(question);
};

const leerInput = async (message) => {
  const question = [
    {
      type: "input",
      name: "desc",
      message,
      validate(value) {
        if (value.length === 0) {
          return "Please enter a value".red;
        }
        return true;
      },
    },
  ];
  const { desc } = await inquirer.prompt(question);
  return desc;
};

const confirmar = async (message) => {
  const pregunta = [
    {
      type: "confirm",
      name: "ok",
      message,
    },
  ];
  const { ok } = await inquirer.prompt(pregunta);
  return ok;
};

const listarLugares = async (lugares = []) => {
  const choices = lugares.map((lugar, i) => {
    const idx = `${i + 1}.`.green;

    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`,
    };
  });

  choices.push({
    value: 0,
    name: "0.".green + "Cancel",
  });

  const listadoLugares = {
    type: "list",
    name: "id",
    message: "Select the Point of Interest:",
    choices,
  };

  const { id } = await inquirer.prompt(listadoLugares);
  return id;
};

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  confirmar,
  listarLugares,
};
