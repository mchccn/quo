import type { Expr } from "./main/Expr";
import type { Interpreter } from "./main/Interpreter";
import type * as std from "./stdlib";
import { defstdfn, defstdns } from "./stdlib";
import { QuoBindingError } from "../interaction/error";

function error(message: string): never {
    throw new QuoBindingError(message);
}

export function nativebind<P extends object>(
    { prototype }: { prototype: P },
    lib: (keyof P)[],
    validate: (this: Interpreter, target: unknown, expr: Expr) => unknown
) {
    return new Map(
        Object.getOwnPropertyNames(prototype)
            .filter((k) => lib.includes(k as keyof P) && typeof prototype[k as keyof typeof prototype] === "function")
            .map((k) => [k.toLowerCase(), Reflect.get(prototype, k)] as [string, Function])
            .map(
                ([k, v]) => (
                    Reflect.deleteProperty(v, "name"),
                    Reflect.defineProperty(v, "name", {
                        value: k,
                        configurable: false,
                        writable: false,
                        enumerable: false,
                    }),
                    [
                        k,
                        function (this: Interpreter, ...args: Expr[]) {
                            const [target, ...a] = args.map(this.evaluate.bind(this));

                            validate.call(this, target, args[0]);

                            return v.apply(target, a);
                        },
                    ]
                )
            )
    );
}

export function bindings(stdlib: typeof std.stdlib, lib: unknown, name = "") {
    if (lib === null || typeof lib === "undefined")
        return name ? stdlib.set(name, null) : error("Cannot convert nullish value to bindings.");

    if (typeof lib === "function")
        return lib.name || name ? defstdfn(lib.name || name, lib as any) : error("Library function has no name.");

    if (typeof lib === "string" || typeof lib === "number" || typeof lib === "boolean")
        return name ? stdlib.set(name, lib) : error("Missing name for value.");

    if (typeof lib === "symbol" || typeof lib === "bigint") return stdlib;

    if (lib instanceof Map) {
        if (!name) return error("Missing name for bindings.");

        return (lib as any).name || name ? defstdns((lib as any).name || name, lib) : error("Library namespace has no name.");
    }

    if (typeof lib === "object")
        for (const key of Object.getOwnPropertyNames(lib)) {
            bindings(stdlib, lib![key as keyof typeof lib], name ? `${name}:${key}` : key);
        }

    return stdlib;
}
