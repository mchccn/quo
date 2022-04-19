import { Expr, SymbolExpr } from "../../engine/main/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoSyntaxError } from "../../priv/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("if", function (...args) {
        const [condition, truthy, falsey, ...then] = args;

        if (this.istruthy(this.evaluate(condition)))
            try {
                return this.evaluate(truthy);
            } finally {
                then.map(this.evaluate.bind(this));
            }

        if (falsey instanceof SymbolExpr) {
            if (falsey.token.lexeme !== "elif" && falsey.token.lexeme !== "else")
                throw new QuoSyntaxError(this.source, falsey.token, `Expected 'elif' or 'else'.`);

            const [returned, value, ...rest] = ((): [unknown?, ...Expr[]] => {
                let elif = falsey;

                let [condition, value, ...rest] = then;

                do {
                    if (elif.token.lexeme !== "elif" && elif.token.lexeme !== "else")
                        throw new QuoSyntaxError(this.source, elif.token, `Expected 'elif' or 'else'.`);

                    if (elif.token.lexeme === "else") {
                        rest.unshift(condition, value);
                        break;
                    }

                    if (!condition)
                        throw new QuoSyntaxError(this.source, elif.token, `Expected condition after 'elif'.`);

                    if (!value) throw new QuoSyntaxError(this.source, elif.token, `Expected value after 'elif'.`);

                    if (this.istruthy(this.evaluate(condition))) return [this.evaluate(value)];

                    [elif, condition, value, ...rest] = rest;
                } while (elif);

                return [undefined, ...rest];
            })();

            if (typeof returned !== "undefined") return returned;

            try {
                return this.evaluate(value);
            } finally {
                rest.map(this.evaluate.bind(this));
            }
        }

        try {
            return this.evaluate(falsey);
        } finally {
            then.map(this.evaluate.bind(this));
        }
    });
