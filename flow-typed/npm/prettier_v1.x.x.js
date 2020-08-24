// flow-typed signature: 5d9f7564186b12849222d06b0c689452
// flow-typed version: a3dbb68519/prettier_v1.x.x/flow_>=v0.84.x

/* @flow */
declare module "prettier" {
    declare export type AST = {[key: string]: any, ...};
    declare export type Doc = {
        [key: string]: any,
        ...
    };
    declare export type FastPath<T = any> = {
        : null | T,
        call<U>(
            callback: (path: FastPath<T>) => U,
            ...names: Array<string | number | Symbol>
        ): U,
        : U,
        each(
            callback: (path: FastPath<T>) => void,
            ...names: Array<string | number | Symbol>
        ): void,
        : any[],
        getName(): null | string | number | Symbol,
        : T,
        getNode(count?: number): null | T,
        : null | T,
        getParentNode(count?: number): null | T,
        : null | string | number | Symbol,
        getValue(): T,
        : void,
        map<U>(
            callback: (path: FastPath<T>, index: number) => U,
            ...names: Array<string | number | Symbol>
        ): U[],
        stack: any[],
        ...
    };

    declare export type PrettierParserName =
        | "babylon" // deprecated
        | "babel"
        | "babel-flow"
        | "flow"
        | "typescript"
        | "postcss" // deprecated
        | "css"
        | "less"
        | "scss"
        | "json"
        | "json5"
        | "json-stringify"
        | "graphql"
        | "markdown"
        | "vue"
        | "html"
        | "angular"
        | "mdx"
        | "yaml";

    declare export type PrettierParser = {
        [name: PrettierParserName]: (
            text: string,
            options?: {[key: string]: any, ...}
        ) => AST,
        ...
    };

    declare export type CustomParser = (
        text: string,
        parsers: PrettierParser,
        options: Options
    ) => AST;

    declare export type Options = {|
        arrowParens?: "avoid" | "always",
        bracketSpacing?: boolean,
        filepath?: string,
        insertPragma?: boolean,
        jsxBracketSameLine?: boolean,
        parser?: PrettierParserName | CustomParser,
        plugins?: Array<string | Plugin>,
        printWidth?: number,
        proseWrap?: "always" | "never" | "preserve",
        rangeEnd?: number,
        rangeStart?: number,
        requirePragma?: boolean,
        semi?: boolean,
        singleQuote?: boolean,
        tabWidth?: number,
        trailingComma?: "none" | "es5" | "all",
        useTabs?: boolean,
    |};

    declare export type Plugin = {
        languages: SupportLanguage,
        options?: SupportOption[],
        parsers: {[parserName: string]: Parser, ...},
        printers: {[astFormat: string]: Printer, ...},
        ...
    };

    declare export type Parser = {
        astFormat: string,
        hasPragma?: (text: string) => boolean,
        locEnd: (node: any) => number,
        locStart: (node: any) => number,
        parse: (
            text: string,
            parsers: {[parserName: string]: Parser, ...},
            options: {[key: string]: any, ...}
        ) => AST,
        preprocess?: (
            text: string,
            options: {[key: string]: any, ...}
        ) => string,
        ...
    };

    declare export type Printer = {
        canAttachComment?: (node: any) => boolean,
        embed: (
            path: FastPath<>,
            print: (path: FastPath<>) => Doc,
            textToDoc: (
                text: string,
                options: {[key: string]: any, ...}
            ) => Doc,
            options: {[key: string]: any, ...}
        ) => ?Doc,
        handleComments?: {
            endOfLine?: (
                commentNode: any,
                text: string,
                options: {[key: string]: any, ...},
                ast: any,
                isLastComment: boolean
            ) => boolean,
            ownLine?: (
                commentNode: any,
                text: string,
                options: {[key: string]: any, ...},
                ast: any,
                isLastComment: boolean
            ) => boolean,
            remaining?: (
                commentNode: any,
                text: string,
                options: {[key: string]: any, ...},
                ast: any,
                isLastComment: boolean
            ) => boolean,
            ...
        },
        hasPrettierIgnore?: (path: FastPath<>) => boolean,
        insertPragma?: (text: string) => string,
        massageAstNode?: (node: any, newNode: any, parent: any) => any,
        print: (
            path: FastPath<>,
            options: {[key: string]: any, ...},
            print: (path: FastPath<>) => Doc
        ) => Doc,
        printComments?: (
            path: FastPath<>,
            print: (path: FastPath<>) => Doc,
            options: {[key: string]: any, ...},
            needsSemi: boolean
        ) => Doc,
        willPrintOwnComments?: (path: FastPath<>) => boolean,
        ...
    };

    declare export type CursorOptions = {|
        arrowParens?: $PropertyType<Options, "arrowParens">,
        bracketSpacing?: $PropertyType<Options, "bracketSpacing">,
        cursorOffset: number,
        filepath?: $PropertyType<Options, "filepath">,
        insertPragma?: $PropertyType<Options, "insertPragma">,
        jsxBracketSameLine?: $PropertyType<Options, "jsxBracketSameLine">,
        parser?: $PropertyType<Options, "parser">,
        plugins?: $PropertyType<Options, "plugins">,
        printWidth?: $PropertyType<Options, "printWidth">,
        proseWrap?: $PropertyType<Options, "proseWrap">,
        requirePragma?: $PropertyType<Options, "requirePragma">,
        semi?: $PropertyType<Options, "semi">,
        singleQuote?: $PropertyType<Options, "singleQuote">,
        tabWidth?: $PropertyType<Options, "tabWidth">,
        trailingComma?: $PropertyType<Options, "trailingComma">,
        useTabs?: $PropertyType<Options, "useTabs">,
    |};

    declare export type CursorResult = {|
        cursorOffset: number,
        formatted: string,
    |};

    declare export type ResolveConfigOptions = {|
        config?: string,
        editorconfig?: boolean,
        useCache?: boolean,
    |};

    declare export type SupportLanguage = {
        aceMode: string,
        aliases?: Array<string>,
        codemirrorMimeType: string,
        codemirrorMode: string,
        extensions: Array<string>,
        filenames?: Array<string>,
        group?: string,
        linguistLanguageId: number,
        name: string,
        parsers: Array<string>,
        since: string,
        tmScope: string,
        vscodeLanguageIds: Array<string>,
        ...
    };

    declare export type SupportOption = {|
        choices?: SupportOptionChoice,
        default: SupportOptionValue,
        deprecated?: string,
        description: string,
        oppositeDescription?: string,
        range?: SupportOptionRange,
        redirect?: SupportOptionRedirect,
        since: string,
        type: "int" | "boolean" | "choice" | "path",
    |};

    declare export type SupportOptionRedirect = {|
        options: string,
        value: SupportOptionValue,
    |};

    declare export type SupportOptionRange = {|
        end: number,
        start: number,
        step: number,
    |};

    declare export type SupportOptionChoice = {|
        deprecated?: string,
        description?: string,
        redirect?: SupportOptionValue,
        since?: string,
        value: boolean | string,
    |};

    declare export type SupportOptionValue = number | boolean | string;

    declare export type SupportInfo = {|
        languages: Array<SupportLanguage>,
        options: Array<SupportOption>,
    |};

    declare export type Prettier = {|
        check: (source: string, options?: Options) => boolean,
        clearConfigCache: () => void,
        format: (source: string, options?: Options) => string,
        formatWithCursor: (
            source: string,
            options: CursorOptions
        ) => CursorResult,
        getSupportInfo: (version?: string) => SupportInfo,
        resolveConfig: {
            (
                filePath: string,
                options?: ResolveConfigOptions
            ): Promise<?Options>,
            : Promise<?Options>,
            sync(filePath: string, options?: ResolveConfigOptions): ?Options,
        },
    |};

    declare export default Prettier;
}
