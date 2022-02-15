import { SymbolExpr } from "../../engine/main/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoTypeError } from "../../interaction/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("drop", function (...args) {
        return args.every((v) =>
            v instanceof SymbolExpr
                ? this.environment.drop(v.token)
                : () => {
                      throw new QuoTypeError(this, v.token, `Must drop symbols and not other values.`);
                  }
        );
    });
