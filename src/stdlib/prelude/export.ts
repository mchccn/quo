import { SymbolExpr } from "../../engine/main/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoSyntaxError } from "../../priv/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("export", function (...args) {
        for (const arg of args) {
            if (!(arg instanceof SymbolExpr))
                throw new QuoSyntaxError(this.source, arg.token, "Must export only symbols.");

            this.environment.ancestor(1 + +this.nsactive).export(arg.token, this.evaluate(arg));
        }

        return null;
    });
