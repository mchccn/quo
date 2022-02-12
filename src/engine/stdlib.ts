import { readdirSync } from "fs";
import { join } from "path";
import type { Expr } from "./Expr";
import type { Interpreter } from "./Interpreter";

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

    if (stdlib.has(name)) console.warn(`Overwrote stdlib entry ${name}.`);

    stdlib.set(name, fn);
};

// ! Will be changed to work with user-defined modules/packages and namespaces
// ! Add module caching
export const loadstdlib = (interpreter: Interpreter, modules: string[]) => {
    (function traverse(path: string) {
        const contents = readdirSync(join(__dirname, "..", path), { withFileTypes: true });

        for (const entry of contents) {
            if (entry.isDirectory()) {
                if (modules.includes(entry.name)) traverse(join(path, entry.name));
            } else {
                if (entry.name.endsWith(".d.ts")) continue;

                const { lib } = require(join(__dirname, "..", path, entry.name));

                if (typeof lib === "function") {
                    lib.call(undefined, defstdfn);
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
