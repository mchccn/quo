import type { Expr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";
import { QuoSyntaxError, QuoTypeError } from "../../priv/error";

export const lib = false;

export function length(this: Interpreter, ...args: Expr[]) {
    if (args.length !== 1) throw new QuoSyntaxError(this.source, args[0].token, "Expected 1 argument.");

    const list = this.evaluate(args[0]);

    if (!Array.isArray(list)) throw new QuoTypeError(this, args[0].token, "Expected a list.");

    return list.length;
}
