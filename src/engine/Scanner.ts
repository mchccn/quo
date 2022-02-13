import { QuoSyntaxError } from "../interaction/error";
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

        const lexmap = new Map([
            ["(", () => this.addToken(TokenType.BeginList)],
            [")", () => this.addToken(TokenType.EndList)],
            [" ", () => this.col++],
            ["\r", () => this.col++],
            ["\t", () => this.col++],
            ["\v", () => this.col++],
            ["\f", () => this.col++],
            ["\n", () => (this.line++, (this.col = 1))],
            [";", () => this.comments()],
            ['"', () => this.string()],
            [">", () => this.addToken((this.match("="), TokenType.Symbol))],
            ["<", () => this.addToken((this.match("="), TokenType.Symbol))],
            ["=", () => this.addToken((this.match("="), TokenType.Symbol))],
            ["!", () => this.addToken((this.match("="), TokenType.Symbol))],
            ["+", () => this.addToken((this.match("1"), TokenType.Symbol))],
            ["-", () => (this.isDigit(this.peek()) ? this.number() : this.addToken((this.match("1"), TokenType.Symbol)))],
            ["*", () => this.addToken(TokenType.Symbol)],
            ["/", () => this.addToken(TokenType.Symbol)],
        ]);

        (lexmap.has(c)
            ? lexmap.get(c)!
            : () => {
                  if (this.isDigit(c)) {
                      this.number();
                  } else if (this.isAlpha(c)) {
                      this.symbol();
                  } else {
                      throw new QuoSyntaxError(
                          this.source,
                          this.tokens[this.tokens.length - 1],
                          `Unexpected character '${c}' at line ${this.line}, column ${this.col}.`
                      );
                  }
              })();
    }

    private comments() {
        if (this.peek() === ";" && this.peekNext() === ";") {
            const start = new Token(TokenType.Eof, ";;;", ";;;", this.line, this.col);

            this.advance(), this.advance();

            while (!(this.peek() === ";" && this.peekNext() === ";" && this.peekNextNext() === ";") && !this.isAtEnd()) {
                if (this.peek() === "\n") {
                    this.line++;
                    this.col = 1;
                }

                this.advance();
            }

            if (this.isAtEnd()) throw new QuoSyntaxError(this.source, start, "Unterminated comment.");

            this.advance();

            if (!this.isAtEnd()) this.advance();
        } else while (this.peek() !== "\n" && !this.isAtEnd()) this.advance();
    }

    private string() {
        const start = new Token(TokenType.Eof, '"', '"', this.line, this.col);

        while (this.peek() !== '"' && !this.isAtEnd() && this.peek() !== "\n") this.advance();

        if (this.isAtEnd() || this.peek() === "\n") throw new QuoSyntaxError(this.source, start, "Unterminated string.");

        this.advance();

        this.addToken(TokenType.String, this.source.substring(this.start + 1, this.current - 1));
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
        return this.source[this.current] ?? "\0";
    }

    private peekNext() {
        return this.source[this.current + 1] ?? "\0";
    }

    private peekNextNext() {
        return this.source[this.current + 2] ?? "\0";
    }

    private advance() {
        return this.source[this.current++];
    }

    private match(expected: string) {
        if (this.isAtEnd() || this.source[this.current] !== expected) return false;

        this.advance();

        return true;
    }

    private isDigit(c: string) {
        return /^\d$/.test(c);
    }

    private isAlpha(c: string) {
        return /^[a-zA-Z_]$/.test(c);
    }

    private isAlphaNumeric(c: string) {
        return /^\w$/.test(c);
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
