const featureGenerator = require("./generators/feature.generator.cjs");
const featureOAuthGenerator = require("./generators/feature-oauth.generator.cjs");

module.exports = function (plop) {
  plop.setHelper("screamingSnakeCase", (text) => {
    return text
      .replace(/([a-z])([A-Z])/g, "$1_$2")
      .replace(/[\s\-]+/g, "_")
      .replace(/__+/g, "_")
      .toUpperCase();
  });

  featureGenerator(plop);
  featureOAuthGenerator(plop);
};
