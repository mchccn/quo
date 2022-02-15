import { Environment } from "../../engine/main/Environment";
import { Expr, ListExpr, SymbolExpr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoSyntaxError } from "../../priv/error";
import { getlast } from "../../engine/executils";

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
                const closure = new Environment(this, this.environment);

                const fn = function (this: Interpreter, ...args: Expr[]) {
                    const values = args.map(this.evaluate.bind(this));

                    params.list.forEach((param, index) => {
                        closure.define(param.token.lexeme, values[index] ?? null);
                    });

                    const previous = this.environment;

                    this.environment = closure;

                    try {
                        return getlast(getlast(this.evaluate(body) as unknown[]));
                    } finally {
                        this.environment = previous;
                    }
                };

                Reflect.deleteProperty(fn, "name");

                Reflect.defineProperty(fn, "name", {
                    value: name.token.lexeme,
                    configurable: false,
                    writable: false,
                    enumerable: false,
                });

                return this.environment.ancestor(1).define(name.token.lexeme, fn);
            } finally {
                rest.map(this.evaluate.bind(this));
            }
        }

        if (params instanceof SymbolExpr) {
            try {
                const closure = new Environment(this, this.environment);

                const fn = function (this: Interpreter, ...args: Expr[]) {
                    const values = args.map(this.evaluate.bind(this));

                    closure.define(params.token.lexeme, values);

                    const previous = this.environment;

                    this.environment = closure;

                    try {
                        return getlast(getlast(this.evaluate(body) as unknown[]));
                    } finally {
                        this.environment = previous;
                    }
                };

                Reflect.deleteProperty(fn, "name");

                Reflect.defineProperty(fn, "name", {
                    value: name.token.lexeme,
                    configurable: false,
                    writable: false,
                    enumerable: false,
                });

                return this.environment.ancestor(1).define(name.token.lexeme, fn);
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
