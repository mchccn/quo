import { SymbolExpr } from "../../engine/main/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoSyntaxError } from "../../interaction/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("do", function (...args) {
        const [body, keyword, condition, ...rest] = args;

        if (!(keyword instanceof SymbolExpr) || keyword.token.lexeme !== "while")
            throw new QuoSyntaxError(this.source, keyword.token, `Expected 'while' after body.`);

        const v = [];

        do {
            v.push(this.evaluate(body));
        } while (this.istruthy(this.evaluate(condition)));

        try {
            return v.pop();
        } finally {
            rest.map(this.evaluate.bind(this));
        }
    });
