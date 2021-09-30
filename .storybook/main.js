module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    webpackFinal: (config) => {
        config.resolve.alias['react-native'] = 'react-native-web';
        return config;
    },
};
