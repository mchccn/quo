import fs from "fs";
import type { Expr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";

export const lib = false;

export function bindfssync(lib: (keyof typeof fs)[]) {
    return new Map(
        Object.getOwnPropertyNames(fs)
            .filter((k) => lib.includes(k as keyof typeof fs) && typeof fs[k as keyof typeof fs] === "function")
            .map((k) => [k.replace("Sync", "").toLowerCase(), Reflect.get(fs, k)] as [string, Function])
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
                            return v.apply(fs, args.map(this.evaluate.bind(this)));
                        },
                    ]
                )
            )
    );
}
