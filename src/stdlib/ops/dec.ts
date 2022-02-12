import { SymbolExpr } from "../../engine/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("dec", function (...args) {
        return args.map((e) =>
            e instanceof SymbolExpr
                ? this.environment.assign(e.symbol, this.numberify(this.environment.get(e.symbol)) - 1)
                : (() => {
                      throw new TypeError(`Must decrement symbols and not other values.`);
                  })()
        );
    });
