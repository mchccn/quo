import type { Expr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";
import { QuoSyntaxError, QuoTypeError } from "../../priv/error";

export const lib = false;

export function foreach(this: Interpreter, ...args: Expr[]) {
    if (args.length !== 2) throw new QuoSyntaxError(this.source, args[0].token, "Expected 2 arguments.");

    const list = this.evaluate(args[0]);
    const predicate = this.evaluate(args[1]);

    if (!Array.isArray(list)) throw new QuoTypeError(this, args[0].token, "Expected a list.");

    if (typeof predicate !== "function") throw new QuoTypeError(this, args[1].token, "Expected a function.");

    // ! uh what the fuck how do i do this

    return list;
}
