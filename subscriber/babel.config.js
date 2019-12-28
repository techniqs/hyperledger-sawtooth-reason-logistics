module.exports = function (api) {
    api.cache(true);

    console.log("Babel config loaded");

    const presets = ["@babel/preset-env"];

    return {
        // include:["src","node_modules"],
        // ignore: ["/node_modules\/(?!sawtooth-sdk)/"],
        presets,
    };
}