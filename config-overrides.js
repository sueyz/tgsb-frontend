const webpack = require('webpack');
module.exports = function override(config, env) {
    config.resolve.fallback = {
        process: require.resolve("process/browser"),
        zlib: require.resolve("browserify-zlib"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        buffer: require.resolve("buffer"),
        assert: require.resolve("assert"),
        https: require.resolve('https-browserify'),

    };
    config.plugins.push(
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );

    return config;
}