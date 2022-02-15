import { ListExpr, SymbolExpr } from "../../engine/main/Expr";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoSyntaxError } from "../../priv/error";

export const lib = (defstdfn: typeof _) =>
    defstdfn("for", function (...args) {
        const [def, condition, post, body, ...rest] = args;

        if (def instanceof SymbolExpr) {
            if (!condition) throw new QuoSyntaxError(this.source, def.token, `Expected 'of' or 'in'.`);

            if (!(condition instanceof SymbolExpr) || (condition.token.lexeme !== "of" && condition.token.lexeme !== "in"))
                throw new QuoSyntaxError(this.source, condition.token, `Expected 'of' or 'in', instead got '${condition.token.lexeme}'.`);

            if (!post) throw new QuoSyntaxError(this.source, condition.token, `Expected an iterable after 'for' or 'in'.`);

            const list = this.deepclone(this.evaluate(post));

            if (
                list === null ||
                typeof list === "function" ||
                typeof list === "number" ||
                typeof list === "boolean" ||
                typeof (list as any)[Symbol.iterator] !== "function"
            )
                throw new QuoSyntaxError(this.source, post.token, `Provided iterable is not iterable.`);

            this.environment.define(def.token.lexeme, null);

            const v = [];

            for (const value of list as Iterable<unknown>) {
                this.environment.assign(def.token, value);

                v.push(this.evaluate(body));
            }

            try {
                return v.pop();
            } finally {
                rest.map(this.evaluate.bind(this));
            }
        }

        if (def instanceof ListExpr) {
            this.evaluate(def);

            const v = [];

            while (typeof condition !== "undefined" ? this.istruthy(this.evaluate(condition)) : true) {
                v.push(this.evaluate(body));

                this.evaluate(post);
            }

            try {
                return v.pop();
            } finally {
                rest.map(this.evaluate.bind(this));
            }
        }

        throw new QuoSyntaxError(
            this.source,
            def.token,
            `Expected list or symbol expression, instead got '${def.token.lexeme}'.`
        );
    });
