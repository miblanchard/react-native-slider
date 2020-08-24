// flow-typed signature: 1dff23447d5e18f5ac2b05aaec7cfb74
// flow-typed version: a453e98ea2/rimraf_v2.x.x/flow_>=v0.25.0

/* @flow */
declare module "rimraf" {
    declare type Options = {
        disableGlob?: boolean,
        emfileWait?: number,
        glob?: boolean,
        maxBusyTries?: number,
    };

    declare type Callback = (err: ?Error, path: ?string) => void;

    declare module.exports: {
        (f: string, opts?: Options | Callback, callback?: Callback): void,
        sync(path: string, opts?: Options): void,
    };
}
