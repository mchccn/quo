import { Expr, ListExpr, SymbolExpr } from "../../engine/Expr";
import type { Interpreter } from "../../engine/Interpreter";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoSyntaxError } from "../../interaction/error";
import { gethead } from "../../interaction/executils";

export const lib = (defstdfn: typeof _) =>
    defstdfn("defn", function (...args) {
        const [name, params, body, ...rest] = args;

        if (!(name instanceof SymbolExpr)) throw new QuoSyntaxError(this.source, name.token, `Expected function name.`);

        if (!(body instanceof ListExpr))
            throw new QuoSyntaxError(this.source, body.token, `Expected function body, instead got '${body.token.lexeme}'.`);

        if (params instanceof ListExpr) {
            for (const param of params.list)
                if (!(param instanceof SymbolExpr))
                    throw new QuoSyntaxError(
                        this.source,
                        param.token,
                        `Expected parameter name, instead got '${param.token.lexeme}'.`
                    );

            try {
                return this.environment.ancestor(1).define(name.token.lexeme, function (this: Interpreter, ...args: Expr[]) {
                    const values = args.map(this.evaluate.bind(this));

                    params.list.forEach((param, index) => {
                        this.environment.define(param.token.lexeme, values[index] ?? null);
                    });

                    return gethead(gethead(this.evaluate(body) as unknown[]));
                });
            } finally {
                rest.map(this.evaluate.bind(this));
            }
        }

        if (params instanceof SymbolExpr) {
            try {
                return this.environment.ancestor(1).define(name.token.lexeme, function (this: Interpreter, ...args: Expr[]) {
                    const values = args.map(this.evaluate.bind(this));

                    this.environment.define(params.token.lexeme, values);

                    return gethead(gethead(this.evaluate(body) as unknown[]));
                });
            } finally {
                rest.map(this.evaluate.bind(this));
            }
        }

        throw new QuoSyntaxError(
            this.source,
            params.token,
            `Expected parameter definitions, instead got '${params.token.lexeme}'.`
        );
    });
