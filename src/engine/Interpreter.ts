import { Environment } from "./Environment";
import { Expr, ExprVisitor, ListExpr, LiteralExpr, SymbolExpr } from "./Expr";

export class Interpreter implements ExprVisitor<unknown> {
    public environment = new Environment();

    public interpret(expr: Expr): unknown {
        const r = this.evaluate(expr);

        if (Array.isArray(r)) return r.pop() ?? null;

        return r;
    }

    public visitLiteralExpr(expr: LiteralExpr) {
        return expr.literal;
    }

    public visitSymbolExpr(expr: SymbolExpr) {
        return this.environment.get(expr.symbol);
    }

    public visitListExpr(expr: ListExpr) {
        const [head, ...body] = expr.list;

        const previous = this.environment;

        try {
            this.environment = new Environment(this.environment);

            if (head instanceof SymbolExpr) {
                if (this.environment.has(head.symbol) && typeof this.environment.get(head.symbol) === "function") {
                    return (this.environment.get(head.symbol) as Function).apply(this, body);
                }

                if (!this.environment.has(head.symbol))
                    throw new TypeError(`Cannot call '${head.symbol.lexeme}' as it is not defined.`);

                if (typeof this.environment.get(head.symbol) !== "function")
                    throw new TypeError(`Cannot call '${head.symbol.lexeme}' as it is not a function.`);
            } else {
                return expr.list.map(this.evaluate.bind(this));
            }
        } finally {
            this.environment = previous;
        }
    }

    public numberify(v: unknown): number {
        if (typeof v === "function") return 0;

        if (typeof v === "string") return Number(v) || 0;

        if (typeof v === "number") return v;

        if (typeof v === "boolean") return Number(v);

        if (Array.isArray(v)) return v.length;

        if (v === null) return 0;

        throw new TypeError(`Attempted to numberify unhandled type of value.`);
    }

    public stringify(v: unknown): string {
        if (typeof v === "function") return `<${Interpreter.isnativefn(v) ? "native " : ""}fn ${v.name}>`;

        if (typeof v === "string") return v.toString();

        if (typeof v === "number") return v.toString();

        if (typeof v === "boolean") return v.toString();

        if (Array.isArray(v)) return `(${v.map(this.stringify.bind(this)).join(" ")})`;

        if (v === null) return "nil";

        throw new TypeError(`Attempted to stringify unhandled type of value.`);
    }

    public deepclone(v: unknown): unknown {
        if (typeof v === "function") return v;

        if (typeof v === "string") return v;

        if (typeof v === "number") return v;

        if (typeof v === "boolean") return v;

        if (Array.isArray(v)) return v.map(this.deepclone.bind(this));

        if (v === null) return v;

        throw new TypeError(`Attempted to deepclone unhandled type of value.`);
    }

    private static isnativefn(v: any): v is Function & { native: true } {
        return v?.native === true && typeof v === "function";
    }

    public evaluate(expr: Expr): unknown {
        if (!expr) return null;

        return expr.accept(this);
    }
}
