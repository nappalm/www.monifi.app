const path = require("path");

module.exports = function (plop) {
  plop.setGenerator("feature", {
    description: "Crear una feature autocontenida",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Nombre de la feature (ej: cheques, login):",
        validate: (value) => {
          if (value && value.trim().length > 0) {
            return true;
          }
          return "El nombre de la feature es obligatorio";
        },
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: path.resolve(
          process.cwd(),
          "src/features/{{kebabCase name}}",
        ),
        base: path.resolve(__dirname, "../templates/feature"),
        templateFiles: path.resolve(__dirname, "../templates/feature/**/*"),
      },
    ],
  });
};
