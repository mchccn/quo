import { Expr, ListExpr, LiteralExpr, SymbolExpr } from "./Expr";
import { Token, TokenType } from "./Token";

export class Parser {
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
        return types.some((t) => this.check(t)) ? (this.advance(), true) : false;
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

        if (stack.length)
            throw new SyntaxError(
                `Unmatched left parentheses at line ${this.tokens[stack[0]].line}, column ${this.tokens[stack[0]].col}.`
            );
    }
}
