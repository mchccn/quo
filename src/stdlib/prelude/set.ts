import { SymbolExpr } from "../../engine/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("set", function (...args) {
        const [name, value, ...rest] = args;

        if (name instanceof SymbolExpr) {
            this.environment.ancestor(1).assign(name.symbol, this.evaluate(value));

            rest.map(this.evaluate.bind(this));

            return this.environment.get(name.symbol);
        }

        throw new SyntaxError(`Must define a symbol and not other values.`);
    });
