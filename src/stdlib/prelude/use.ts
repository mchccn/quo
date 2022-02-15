import { SymbolExpr } from "../../engine/main/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoTypeError } from "../../interaction/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("use", function (...args) {
        for (const a of args) {
            if (!(a instanceof SymbolExpr))
                throw new QuoTypeError(this, a.token, `Expected symbol to use, instead got '${a.token.lexeme}'.`);

            const value = this.environment.get(a.token);

            if (value instanceof Map) {
                this.environment.ancestor(1).fillsafe([...value.entries()]);
            } else {
                this.environment.ancestor(1).define(a.token.lexeme.split(":").reverse()[0], value);
            }
        }

        return null;
    });
