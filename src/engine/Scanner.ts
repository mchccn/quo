import { Token, TokenType } from "./Token";

export class Scanner {
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
