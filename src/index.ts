/**
 * T O D O   L I S T
 *
 * Basic language features
 * - Fully-featured variables
 * - First-order functions, closures, and lambdas
 * - Control flow
 * - Arithmetic and basic operations
 *
 * Standard library
 * - Extended list operations
 * - String utility
 * - Boolean logic
 *
 * UI/UX
 * - Better error handling and messages
 * - CLI for executing scripts
 * - Package manager
 * - Custom script debugger
 * - VSCode language support extension
 *
 * Namespaces
 * - Namespace delimiter
 * - Define namespaces
 * - Use namespaces
 * - Fully qualified name
 *
 * Modules
 * - Import modules as whole or a few symbols
 * - Export symbols
 *
 * Bindings
 * - File system
 * - Operating system
 * - Networking
 * - JavaScript libraries
 *
 * Metaprogramming
 * - Create native-like functions
 * - Special permissions to expression representation
 * - Direct bindings to evaluation and symbol names
 * - Change behaviour of actions
 *
 * Specifications
 *
 * Tutorial
 *
 * Change name to Quo
 *
 * Rewrite README.md and change license
 *
 * Make repo look professional
 */

enum TokenType {
    BeginList,
    EndList,
    String,
    Number,
    True,
    False,
    Nil,
    Symbol,
    Eof,
}

class Token {
    public constructor(
        public readonly type: TokenType,
        public readonly lexeme: string,
        public readonly literal: unknown,
        public readonly line: number,
        public readonly col: number
    ) {}
}

class Scanner {
    private static keywords = new Map([
        ["true", TokenType.True],
        ["false", TokenType.False],
        ["nil", TokenType.Nil],
    ]);

    private readonly tokens = [] as Token[];

    private start = 0;
    private current = 0;
    private line = 1;
    private col = 1;

    public constructor(public readonly source: string) {}

    public scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }

        this.addToken(TokenType.Eof);

        return this.tokens;
    }

    private scanToken() {
        const c = this.advance();

        switch (c) {
            case "(":
                this.addToken(TokenType.BeginList);
                break;
            case ")":
                this.addToken(TokenType.EndList);
                break;
            case " ":
            case "\r":
            case "\t":
                this.col++;
                break;
            case "\n":
                this.line++;
                this.col = 1;
                break;
            case ";":
                while (this.peek() != "\n" && !this.isAtEnd()) this.advance();
                break;
            case '"':
                this.string();
                break;
            case ">":
                this.addToken((this.match("="), TokenType.Symbol), c);
                break;
            case "<":
                this.addToken((this.match("="), TokenType.Symbol), c);
                break;
            case "=":
                this.addToken((this.match("="), TokenType.Symbol), c);
                break;
            case "!":
                this.addToken((this.match("="), TokenType.Symbol), c);
                break;
            case "+":
                this.addToken(TokenType.Symbol, c);
                break;
            case "-":
                if (this.isDigit(this.peek())) {
                    this.number();
                } else {
                    this.addToken(TokenType.Symbol, c);
                }
                break;
            case "*":
                this.addToken(TokenType.Symbol, c);
                break;
            case "/":
                this.addToken(TokenType.Symbol, c);
                break;
            default:
                if (this.isDigit(c)) {
                    this.number();
                } else if (this.isAlpha(c)) {
                    this.symbol();
                } else {
                    throw new SyntaxError(`Unexpected character '${c}' at line ${this.line}, column ${this.col}.`);
                }
                break;
        }
    }

    private string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == "\n") this.line++;

            this.advance();
        }

        if (this.isAtEnd()) throw new SyntaxError("Unterminated string.");

        this.advance();

        const value = this.source.substring(this.start + 1, this.current - 1);

        this.addToken(TokenType.String, value);
    }

    private number() {
        while (this.isDigit(this.peek())) this.advance();

        if (this.peek() === "." && this.isDigit(this.peekNext())) {
            this.advance();

            while (this.isDigit(this.peek())) this.advance();
        }

        this.addToken(TokenType.Number, Number(this.source.substring(this.start, this.current)));
    }

    private symbol() {
        while (this.isAlphaNumeric(this.peek())) this.advance();

        const text = this.source.substring(this.start, this.current);

        const type = Scanner.keywords.get(text) ?? TokenType.Symbol;

        this.addToken(type, text);
    }

    private peek() {
        if (this.isAtEnd()) return "\0";

        return this.source[this.current];
    }

    private peekNext() {
        if (this.current + 1 >= this.source.length) return "\0";

        return this.source[this.current + 1];
    }

    private peekNextNext() {
        if (this.current + 2 >= this.source.length) return "\0";

        return this.source[this.current + 1];
    }

    private advance() {
        return this.source[this.current++];
    }

    private match(expected: string) {
        if (this.isAtEnd()) return false;

        if (this.source[this.current] !== expected) return false;

        this.current++;

        return true;
    }

    private isDigit(c: string) {
        return /^[0-9]$/.test(c);
    }

    private isAlpha(c: string) {
        return /^[a-zA-Z_]$/.test(c);
    }

    private isAlphaNumeric(c: string) {
        return this.isAlpha(c) || this.isDigit(c);
    }

    private addToken(type: TokenType, literal?: unknown) {
        const text = this.source.substring(this.start, this.current);

        this.tokens.push(new Token(type, text, literal ?? "", this.line, this.col));

        this.col += text.length;
    }

    private isAtEnd() {
        return this.current >= this.source.length;
    }
}

interface ExprVisitor<R> {
    visitListExpr(expr: ListExpr): R;
    visitLiteralExpr(expr: LiteralExpr): R;
    visitSymbolExpr(expr: SymbolExpr): R;
}

abstract class Expr {
    abstract accept<R>(visitor: ExprVisitor<R>): R;
}

class ListExpr extends Expr {
    public constructor(public readonly list: Expr[]) {
        super();
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitListExpr(this);
    }
}

class LiteralExpr extends Expr {
    public constructor(public readonly literal: unknown) {
        super();
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }
}

class SymbolExpr extends Expr {
    public constructor(public readonly symbol: Token) {
        super();
    }

    public accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitSymbolExpr(this);
    }
}

class Parser {
    private current = 0;

    public constructor(public readonly tokens: Token[]) {}

    public parseTokens() {
        this.validateParens();

        const list = [];

        while (!this.isAtEnd()) {
            list.push(this.expression());
        }

        return new ListExpr(list);
    }

    private expression() {
        this.consume(TokenType.BeginList, "Expected '(' to begin list.");

        const list = [];

        while (!this.check(TokenType.EndList) && !this.isAtEnd()) {
            ``;
            list.push(this.primary());
        }

        this.consume(TokenType.EndList, "Expected ')' after list contents.");

        return new ListExpr(list);
    }

    private primary(): Expr {
        if (this.match(TokenType.True)) return new LiteralExpr(true);
        if (this.match(TokenType.False)) return new LiteralExpr(false);
        if (this.match(TokenType.Nil)) return new LiteralExpr(null);

        if (this.match(TokenType.Number, TokenType.String)) return new LiteralExpr(this.previous().literal);

        if (this.match(TokenType.Symbol)) return new SymbolExpr(this.previous());

        if (this.peek().type === TokenType.BeginList) return this.expression();

        throw void 0;
    }

    private consume(type: TokenType, message: string) {
        if (this.check(type)) return this.advance();

        throw new SyntaxError(message);
    }

    private match(...types: TokenType[]) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }

        return false;
    }

    private check(type: TokenType) {
        if (this.isAtEnd()) return false;

        return this.peek().type === type;
    }

    private advance() {
        if (!this.isAtEnd()) this.current++;

        return this.previous();
    }

    private isAtEnd() {
        return this.peek().type === TokenType.Eof;
    }

    private peek() {
        return this.tokens[this.current];
    }

    private previous() {
        return this.tokens[this.current - 1];
    }

    private validateParens() {
        const stack = [] as number[];

        this.tokens.forEach((t, i) => {
            if (t.type === TokenType.BeginList) {
                stack.push(i);
            } else if (t.type === TokenType.EndList) {
                if (!stack.length) throw new SyntaxError(`Unmatched right parentheses at line ${t.line}, column ${t.col}.`);

                stack.pop();
            }
        });

        if (stack.length) throw new SyntaxError(`Unmatched left parentheses at line ${this.tokens[stack[0]].line}, column ${this.tokens[stack[0]].col}.`);
    }
}

class Environment {
    private map = new Map<string, unknown>();

    public constructor(public readonly parent?: Environment) {}

    public get(key: Token): unknown {
        return (
            this.map.get(key.lexeme) ??
            this.parent?.get(key) ??
            (() => {
                throw new Error(`Undefined symbol '${key.lexeme}'.`);
            })()
        );
    }

    public define(key: string, value: unknown): unknown {
        this.map.set(key, value);

        return value;
    }

    public assign(key: Token, value: unknown): unknown {
        if (this.map.has(key.lexeme)) {
            this.map.set(key.lexeme, value);

            return value;
        }

        if (this.parent?.has(key)) {
            this.parent.assign(key, value);

            return value;
        }

        throw new Error(`Undefined symbol '${key.lexeme}'.`);
    }

    public has(key: Token): boolean {
        return this.map.has(key.lexeme) || this.parent?.has(key) || false;
    }

    public getAt(distance: number, name: string) {
        return this.ancestor(distance).map.get(name);
    }

    public assignAt(distance: number, name: Token, value: unknown) {
        this.ancestor(distance).assign(name, value);
    }

    public drop(key: Token): boolean {
        return this.map.delete(key.lexeme) || this.parent?.drop(key) || false;
    }

    public dropAt(distance: number, key: Token): boolean {
        return this.ancestor(distance).drop(key);
    }

    public ancestor(distance: number) {
        let environment = this as Environment;

        for (let i = 0; i < distance; i++) {
            environment = environment.parent!;
        }

        return environment;
    }

    public fill(entries: [string, unknown][]) {
        for (const [key, value] of entries) {
            this.map.set(key, value);
        }

        return this;
    }
}

const stdlib = new Map<string, (this: Interpreter, ...args: Expr[]) => unknown>();

{
    /**
     * Obviously when moving to an actual repository the standard library will
     * make up the majority of the project. This will be refactored into many
     * folders and files that will be synchronously loaded into the interpreter.
     */

    const defstdfn = (name: string, fn: (this: Interpreter, ...args: Expr[]) => unknown) => {
        Reflect.deleteProperty(fn, "name");

        Reflect.defineProperty(fn, "name", {
            value: name,
            configurable: false,
            writable: false,
            enumerable: false,
        });

        Reflect.defineProperty(fn, "native", {
            value: true,
            configurable: false,
            writable: false,
            enumerable: false,
        });

        stdlib.set(name, fn);
    };

    defstdfn("+", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) return this.numberify(this.evaluate(args[0]));

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        return rest.reduce((acc, val) => {
            if (Array.isArray(acc)) return acc.concat(val);

            if (Array.isArray(val)) return Array().concat(acc).concat(val);

            if (typeof acc === "number") return acc + this.numberify(val);

            if (typeof val === "number") return this.numberify(acc) + val;

            if (typeof acc === "string") return acc + this.stringify(val);

            if (typeof val === "string") return this.stringify(acc) + val;

            return this.numberify(acc) + this.numberify(val);
        }, first);
    });

    defstdfn("-", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) return -this.numberify(this.evaluate(args[0]));

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        return rest.reduce((acc, val) => {
            return this.numberify(acc) + this.numberify(val);
        }, first);
    });

    defstdfn("*", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) return this.numberify(this.evaluate(args[0]));

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        return rest.reduce((acc, val) => {
            if (Array.isArray(acc))
                return Array(this.numberify(val))
                    .fill(0)
                    .map(() => this.deepclone(acc));

            if (Array.isArray(val))
                return Array(this.numberify(acc))
                    .fill(0)
                    .map(() => this.deepclone(val));

            if (typeof acc === "number") return acc * this.numberify(val);

            if (typeof val === "number") return this.numberify(acc) * val;

            if (typeof acc === "string") return acc.repeat(this.numberify(val));

            if (typeof val === "string") return val.repeat(this.numberify(acc));

            return this.numberify(acc) * this.numberify(val);
        }, first);
    });

    defstdfn("/", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) {
            const v = this.numberify(this.evaluate(args[0]));

            return v ? 1 / v : 0;
        }

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        if (rest.some((v) => this.numberify(v) === 0)) return 0;

        return rest.reduce((acc, val) => {
            return this.numberify(acc) / this.numberify(val);
        }, first);
    });

    defstdfn("mod", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) return this.numberify(this.evaluate(args[0]));

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        const n = this.numberify(rest.reduce((acc, val) => this.numberify(acc) * this.numberify(val), 1));

        return ((this.numberify(first) % n) + n) % n;
    });

    defstdfn("rem", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) return this.numberify(this.evaluate(args[0]));

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        const n = this.numberify(rest.reduce((acc, val) => this.numberify(acc) * this.numberify(val), 1));

        return this.numberify(first) % n;
    });

    defstdfn("list", function (...args) {
        return args.map(this.evaluate.bind(this));
    });

    defstdfn("print", function (...args) {
        if (args.length) console.log(...args.map(this.evaluate.bind(this)).map(this.stringify.bind(this)));

        return null;
    });

    defstdfn("def", function (...args) {
        const [name, value, ...rest] = args;

        if (name instanceof SymbolExpr) {
            this.environment.ancestor(1).define(name.symbol.lexeme, this.evaluate(value));

            rest.map(this.evaluate.bind(this));

            return this.environment.get(name.symbol);
        }

        throw new SyntaxError(`Must define a symbol and not other values.`);
    });

    defstdfn("set", function (...args) {
        const [name, value, ...rest] = args;

        if (name instanceof SymbolExpr) {
            this.environment.ancestor(1).assign(name.symbol, this.evaluate(value));

            rest.map(this.evaluate.bind(this));

            return this.environment.get(name.symbol);
        }

        throw new SyntaxError(`Must define a symbol and not other values.`);
    });

    defstdfn("drop", function (...args) {
        return args.every((v) =>
            v instanceof SymbolExpr
                ? this.environment.drop(v.symbol)
                : () => {
                      throw new TypeError(`Must drop symbols and not other values.`);
                  }
        );
    });
}

class Interpreter implements ExprVisitor<unknown> {
    public environment = new Environment().fill([...stdlib.entries()]);

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

                if (!this.environment.has(head.symbol)) throw new TypeError(`Cannot call '${head.symbol.lexeme}' as it is not defined.`);

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

function execute(source: string) {
    const tokens = new Scanner(source).scanTokens();

    const expr = new Parser(tokens).parseTokens();

    console.log(expr);

    return new Interpreter().interpret(expr);
}

console.clear();

execute(`\
; Metaprogramming example
;
; (s hello world) ; => "hello world"
; 
; (mdefn s args (
;     (def mapped (std:list:map args (lambda (e) (
;         (if (missymbol e)
;            (msymbolname e)
;            (meval e))
;     ))))
;     (std:list:join mapped " ")
; ))

; (defn fib (n) (
;     (if (<= n 2)
;         (1)
;         (+ (fib (- n 1)) (fib (- n 2))))
; ))

; (if (= (+ 1 1) 2)
;     (print "true")
;     (print "false"))

; (def foo "bar")
; (print foo)
; (set foo "baz")
; (print foo)
; (drop foo)
; (print foo)
`);
