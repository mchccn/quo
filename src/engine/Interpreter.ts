import { QuoAssertionError, QuoTypeError } from "../interaction/error";
import { Environment } from "./Environment";
import { Expr, ExprVisitor, ListExpr, LiteralExpr, SymbolExpr } from "./Expr";
import { Token, TokenType } from "./Token";

export class Trace {
    public constructor(
        public readonly file: string,
        public readonly module: string,
        public readonly token: Token,
        public readonly target: Function
    ) {}
}

export class Interpreter implements ExprVisitor<unknown> {
    public callstack = [
        new Trace("<anonymous>", "main", new Token(TokenType.Eof, "", undefined, 0, 0), function () {}),
    ] as Trace[];

    public environment = new Environment(this);

    public constructor(public readonly source: string) {}

    public interpret(expr: Expr): unknown {
        const r = this.evaluate(expr);

        if (Array.isArray(r)) return r.pop() ?? null;

        return r;
    }

    public visitLiteralExpr(expr: LiteralExpr) {
        return expr.literal;
    }

    public visitSymbolExpr(expr: SymbolExpr) {
        return this.environment.get(expr.token);
    }

    public visitListExpr(expr: ListExpr) {
        const [head, ...body] = expr.list;

        const previous = this.environment;

        try {
            this.environment = new Environment(this, this.environment);

            if (head instanceof SymbolExpr) {
                if (this.environment.has(head.token) && typeof this.environment.get(head.token) === "function") {
                    const fn = this.environment.get(head.token) as Function;

                    // ! replace with actual file later
                    this.callstack.unshift(new Trace("main", "main", head.token, fn));

                    try {
                        return fn.apply(this, body);
                    } finally {
                        this.callstack.shift();
                    }
                }

                if (!this.environment.has(head.token))
                    throw new QuoTypeError(this, head.token, `Cannot call '${head.token.lexeme}' as it is not defined.`);

                if (typeof this.environment.get(head.token) !== "function")
                    throw new QuoTypeError(this, head.token, `Cannot call '${head.token.lexeme}' as it is not a function.`);
            } else {
                return expr.list.map(this.evaluate.bind(this));
            }
        } finally {
            this.environment = previous;
        }
    }

    public istruthy(v: unknown): boolean {
        if (typeof v === "function") return true;

        if (typeof v === "string") return v.length > 0;

        if (typeof v === "number") return v !== 0;

        if (typeof v === "boolean") return v;

        if (Array.isArray(v)) return v.length > 0;

        if (v === null) return false;

        throw new QuoAssertionError(`Attempted to coerce unhandled type of value.`);
    }

    public isfalsey(v: unknown): boolean {
        return !this.istruthy(v);
    }

    public numberify(v: unknown): number {
        if (typeof v === "function") return 0;

        if (typeof v === "string") return Number(v) || 0;

        if (typeof v === "number") return v;

        if (typeof v === "boolean") return Number(v);

        if (Array.isArray(v)) return v.length;

        if (v === null) return 0;

        throw new QuoAssertionError(`Attempted to numberify unhandled type of value.`);
    }

    public stringify(v: unknown): string {
        if (typeof v === "function") return `<${Interpreter.isnativefn(v) ? "native " : ""}fn ${v.name}>`;

        if (typeof v === "string") return v.toString();

        if (typeof v === "number") return v.toString();

        if (typeof v === "boolean") return v.toString();

        if (Array.isArray(v)) return `(${v.map(this.stringify.bind(this)).join(" ")})`;

        if (v === null) return "nil";

        throw new QuoAssertionError(`Attempted to stringify unhandled type of value.`);
    }

    public deepclone(v: unknown): unknown {
        if (typeof v === "function") return v;

        if (typeof v === "string") return v;

        if (typeof v === "number") return v;

        if (typeof v === "boolean") return v;

        if (Array.isArray(v)) return v.map(this.deepclone.bind(this));

        if (v === null) return v;

        throw new QuoAssertionError(`Attempted to deepclone unhandled type of value.`);
    }

    public deepequals(a: unknown, b: unknown): boolean {
        if (typeof a === "function" || typeof b === "function") return false;

        if (typeof a === "string" && typeof b === "string") return a === b;

        if (typeof a === "number" && typeof b === "number") return a === b;

        if (typeof a === "boolean" && typeof b === "boolean") return a === b;

        if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((x, i) => this.deepequals(x, b[i]));

        if (a === null && b === null) return true;

        return false;
    }

    private static isnativefn(v: any): v is Function & { native: true } {
        return v?.native === true && typeof v === "function";
    }

    public evaluate(expr: Expr): unknown {
        if (!expr) return null;

        return expr.accept(this);
    }
}
