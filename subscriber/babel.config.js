module.exports = function (api) {
    api.cache(true);

    console.log("Babel config loaded");

    const presets = ["@babel/preset-env"];

    return {
        ignore: ["/node_modules\/(?!sawtooth-sdk/messaging/stream)/"],
        presets,
    };
}