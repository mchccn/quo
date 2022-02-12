import { SymbolExpr } from "../../engine/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoSyntaxError } from "../../interaction/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("set", function (...args) {
        const [name, value, ...rest] = args;

        if (name instanceof SymbolExpr) {
            this.environment.ancestor(1).assign(name.token, this.evaluate(value));

            rest.map(this.evaluate.bind(this));

            return this.environment.get(name.token);
        }

        throw new QuoSyntaxError(this.source, name.token, `Must define a symbol and not other values.`);
    });
