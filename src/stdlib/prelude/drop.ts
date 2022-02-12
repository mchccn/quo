import { SymbolExpr } from "../../engine/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("drop", function (...args) {
        return args.every((v) =>
            v instanceof SymbolExpr
                ? this.environment.drop(v.symbol)
                : () => {
                      throw new TypeError(`Must drop symbols and not other values.`);
                  }
        );
    });
