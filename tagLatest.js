#!/usr/bin/env node

/* @flow */
const cp = require('child_process');
const {version} = require('./package.json');

function gitTagLatest() {
    cp.execFileSync('git', [
        'tag',
        '-a',
        `publish/${version}`,
        '-m',
        `Publish @miblanchard/react-native-slider v${version}`,
    ]);
}

process.on('SIGINT', () => process.exit(0));
process.on('unhandledRejection', (e) => {
    throw e;
});

gitTagLatest();
