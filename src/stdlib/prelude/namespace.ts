import { ListExpr, SymbolExpr } from "../../engine/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoSyntaxError } from "../../interaction/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("namespace", function (...args) {
        const [name, body, ...rest] = args;

        if (!(name instanceof SymbolExpr)) throw new QuoSyntaxError(this.source, name.token, `Expected namespace name.`);

        if (!(body instanceof ListExpr)) throw new QuoSyntaxError(this.source, name.token, `Expected namespace body.`);

        try {
            
        } finally {
            rest.map(this.evaluate.bind(this));
        }
    });
