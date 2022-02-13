import type { Expr } from "../engine/Expr";
import type { Interpreter } from "../engine/Interpreter";
import type * as std from "../engine/stdlib";
import { QuoBindingError } from "./error";

function error(message: string) {
    throw new QuoBindingError(message);
}

export function nativebind<P extends object>(
    { prototype }: { prototype: P },
    lib: (keyof P)[],
    validate: (this: Interpreter, target: unknown, expr: Expr) => unknown
) {
    return Object.fromEntries(
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

export function bindings(stdlib: typeof std.stdlib, defstdfn: typeof std.defstdfn, lib: unknown, name = "") {
    if (lib === null || typeof lib === "undefined")
        return name ? stdlib.set(name, null) : error("Cannot convert nullish value to bindings.");

    if (typeof lib === "function")
        return lib.name || name ? defstdfn(lib.name || name, lib as any) : error("Library function has no name.");

    if (typeof lib === "string" || typeof lib === "number" || typeof lib === "boolean")
        return name ? stdlib.set(name, lib) : error("Missing name for value.");

    if (typeof lib === "symbol" || typeof lib === "bigint") return;

    if (typeof lib === "object")
        for (const key of Object.getOwnPropertyNames(lib)) {
            bindings(stdlib, defstdfn, lib![key as keyof typeof lib], name ? `${name}:${key}` : key);
        }

    return stdlib;
}
