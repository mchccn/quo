import { SymbolExpr } from "../../engine/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoTypeError } from "../../interaction/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("inc", function (...args) {
        return args.map((e) =>
            e instanceof SymbolExpr
                ? this.environment.assign(e.token, this.numberify(this.environment.get(e.token)) + 1)
                : (() => {
                      throw new QuoTypeError(this, e.token, `Must increment symbols and not other values.`);
                  })()
        );
    });
