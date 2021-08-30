const path = require('path');

const cwd = process.cwd();
module.exports = {
    resolve: {
        alias: {
            '@storybook/react-native': '@storybook/react',
            'react-native': 'react-native-web',
        },
        extensions: ['.ts', '.tsx'],
        modules: [path.resolve(cwd, 'node_modules'), 'node_modules'],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                include: [
                    path.resolve(__dirname, '../src'),
                    path.resolve(__dirname, '../SliderExample/src'),
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-private-methods',
                            '@babel/plugin-proposal-private-property-in-object',
                            '@babel/plugin-proposal-nullish-coalescing-operator',
                            '@babel/plugin-proposal-optional-chaining',
                            '@babel/plugin-transform-flow-strip-types',
                            'react-native-web',
                            'transform-inline-environment-variables',
                        ],
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    shippedProposals: true,
                                    targets: {
                                        browsers: ['last 2 versions'],
                                        node: '14.5.0',
                                    },
                                },
                            ],
                            '@babel/preset-flow',
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                        ],
                    },
                },
            },
            {
                test: /\.(png|jpg|gif|mp4|hls|m3ua|flv|swf|ttf|otf|woff|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                    },
                ],
            },
        ],
    },
};
