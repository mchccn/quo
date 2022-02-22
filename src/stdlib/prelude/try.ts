import { SymbolExpr } from "../../engine/main/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("try", function (...args) {
        const [trytorun, catchword, catchfn, finallyword, finallyfn] = args;

        try {
            return this.evaluate(trytorun);
        } catch (e) {
            if (catchword instanceof SymbolExpr && catchword.token.lexeme === "catch") {
                return this.evaluate(catchfn);
            }

            throw e;
        } finally {
            if (finallyword instanceof SymbolExpr && finallyword.token.lexeme === "finally") {
                return this.evaluate(finallyfn);
            }
        }
    });
