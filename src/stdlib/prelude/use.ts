import { SymbolExpr } from "../../engine/main/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoReferenceError, QuoTypeError } from "../../priv/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("use", function (...args) {
        for (const a of args) {
            if (!(a instanceof SymbolExpr))
                throw new QuoTypeError(this, a.token, `Expected symbol to use, instead got '${a.token.lexeme}'.`);

            const value = this.environment.get(a.token);

            if (value === undefined)
                throw new QuoReferenceError(
                    this,
                    a.token,
                    `Cannot reference '${a.token.lexeme}' as it is not defined.`
                );

            if (value instanceof Map) {
                this.environment.ancestor(1).fillsafe([...value.entries()]);
            } else {
                this.environment.ancestor(1).define(a.token.lexeme.split(":").at(-1)!, value);
            }
        }

        return null;
    });
