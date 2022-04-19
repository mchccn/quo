import type { Expr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";
import { QuoSyntaxError, QuoTypeError } from "../../priv/error";

export const lib = false;

export function bindpredicatebased(method: keyof [] & string) {
    const fn = function (this: Interpreter, ...args: Expr[]) {
        if (args.length !== 2) throw new QuoSyntaxError(this.source, args[0].token, "Expected 2 arguments.");

        const list = this.evaluate(args[0]);
        const predicate = this.evaluate(args[1]);

        if (!Array.isArray(list)) throw new QuoTypeError(this, args[0].token, "Expected a list.");

        if (typeof predicate !== "function") throw new QuoTypeError(this, args[1].token, "Expected a function.");

        return (list[method] as Function).call(list, (item: any, index: number) => predicate.call(this, item, index));
    };

    Reflect.deleteProperty(fn, "name");

    Reflect.defineProperty(fn, "name", {
        value: method.toLowerCase(),
        enumerable: false,
        configurable: false,
        writable: false,
    });

    (fn as any).native = true;

    return [method.toLowerCase(), fn] as [string, (this: Interpreter, ...args: Expr[]) => unknown];
}
