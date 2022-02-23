import { readdirSync } from "fs";
import { join } from "path";
import type { Expr } from "./main/Expr";
import type { Interpreter } from "./main/Interpreter";

export const stdlib = new Map<string, unknown | ((this: Interpreter, ...args: Expr[]) => unknown)>();

export const defstdfn = (name: string, fn: (this: Interpreter, ...args: Expr[]) => unknown) => {
    Reflect.deleteProperty(fn, "name");

    Reflect.defineProperty(fn, "name", {
        value: name,
        configurable: false,
        writable: false,
        enumerable: false,
    });

    Reflect.defineProperty(fn, "native", {
        value: true,
        configurable: false,
        writable: false,
        enumerable: false,
    });

    return stdlib.set(name, fn);
};

export const defstdns = (name: string, ns: Map<string, unknown>) => {
    Reflect.defineProperty(ns, "name", {
        value: name,
        configurable: false,
        writable: false,
        enumerable: false,
    });

    Reflect.defineProperty(ns, "native", {
        value: true,
        configurable: false,
        writable: false,
        enumerable: false,
    });

    return stdlib.set(name, ns);
};

export const loadlibs = (interpreter: Interpreter, modules: string[] | "*") => {
    (function traverse(path: string) {
        const contents = readdirSync(join(__dirname, "..", path), { withFileTypes: true });

        for (const entry of contents) {
            if (entry.isDirectory()) {
                if (modules === "*" || modules.includes(entry.name)) traverse(join(path, entry.name));
            } else {
                if (!entry.name.endsWith(".js")) continue;

                const { lib } = require(join(__dirname, "..", path, entry.name));

                if (lib === false) continue;

                if (typeof lib === "function") {
                    lib.call(undefined, defstdfn);
                } else if (lib instanceof Map) {
                    if (!(lib as any).name) console.warn(`${join(path, entry.name)} has no name.`);

                    defstdns((lib as any).name ?? "", lib);
                } else {
                    if (lib === undefined) console.warn(`${join(path, entry.name)} is missing a definition.`);

                    stdlib.set(entry.name, lib);
                }
            }
        }
    })("stdlib");

    interpreter.environment.fill([...stdlib.entries()]);

    return interpreter;
};
