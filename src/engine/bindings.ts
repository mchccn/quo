import { QuoBindingError } from "../priv/error";
import type { Expr } from "./main/Expr";
import type { Interpreter } from "./main/Interpreter";
import type * as std from "./stdlib";
import { defstdfn, defstdns } from "./stdlib";

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
            .map(([k, v]) => {
                const fn = function (this: Interpreter, ...args: Expr[]) {
                    const [target, ...a] = args.map(this.evaluate.bind(this));

                    validate.call(this, target, args[0]);

                    return v.apply(target, a);
                };

                Reflect.deleteProperty(fn, "name");

                Reflect.defineProperty(fn, "name", {
                    value: k,
                    configurable: false,
                    writable: false,
                    enumerable: false,
                });

                (fn as any).native = true;

                return [k, fn];
            })
    );
}

// turn a value into a value quo can use/represent
export function toQuoResolvable(v: unknown): unknown {
    if (
        typeof v === "function" ||
        typeof v === "number" ||
        typeof v === "string" ||
        typeof v === "boolean" ||
        typeof v === "undefined" ||
        v === null
    )
        return v ?? null;

    if (typeof v === "bigint") return Number(v.toString());

    if (Array.isArray(v)) return v.map((v) => toQuoResolvable(v));

    if (typeof v === "object")
        return new Map(Object.getOwnPropertyNames(v).map((k) => [k, toQuoResolvable(v[k as keyof typeof v])]));

    throw new QuoBindingError(`Cannot convert ${v} to a value Quo can use.`);
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

        return (lib as any).name || name
            ? defstdns((lib as any).name || name, lib)
            : error("Library namespace has no name.");
    }

    if (typeof lib === "object")
        for (const key of Object.getOwnPropertyNames(lib)) {
            bindings(stdlib, lib![key as keyof typeof lib], name ? `${name}:${key}` : key);
        }

    return stdlib;
}
