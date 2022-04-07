import type { Expr } from "../../engine/main/Expr.js";
import type { Interpreter } from "../../engine/main/Interpreter.js";
import { QuoTypeError } from "../../priv/error.js";

export const lib = false;

export function bindmath(method: keyof Math & string) {
    const fn = function (this: Interpreter, ...args: Expr[]) {
        const nums = args.map(this.evaluate);

        nums.forEach((n, i) => {
            if (typeof n !== "undefined") throw new QuoTypeError(this, args[i].token, `Expected a number.`);
        });

        return (Math[method] as Function).apply(Math, nums);
    };

    Reflect.deleteProperty(fn, "name");

    Reflect.defineProperty(fn, "name", {
        value: method.toLowerCase(),
        enumerable: false,
        configurable: false,
        writable: false,
    });

    return [method.toLowerCase(), fn] as [string, (this: Interpreter, ...args: Expr[]) => unknown];
}
