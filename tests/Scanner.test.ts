import { expect } from "chai";
import { Scanner } from "../src/engine/main/Scanner";
import { TokenType } from "../src/engine/main/Token";

describe("Scanner", () => {
    it("should always emit an end-of-file token", () => {
        expect(new Scanner("").scanTokens()[0].type).to.equal(TokenType.Eof);
    });

    it("should emit a symbol token for valid symbols", () => {
        for (const symbol of ["a", "a1", "a_1", "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "_"]) {
            const token = new Scanner(symbol).scanTokens()[0];

            expect(token.type).to.equal(TokenType.Symbol);
            expect(token.lexeme).to.equal(symbol);
        }
    });

    it("should emit a number token for valid numbers", () => {
        for (const number of ["0", "1", "1234567890", "0xff", "0o77", "0b11", "99"]) {
            const token = new Scanner(number).scanTokens()[0];

            expect(token.type).to.equal(TokenType.Number);
            expect(token.literal).to.equal(Number(number));
        }
    });

    it("should emit a string token for valid strings", () => {
        for (const string of ['""', '"abc"', '"abc"', '"abcdef"']) {
            const token = new Scanner(string).scanTokens()[0];

            expect(token.type).to.equal(TokenType.String);
            expect(token.literal).to.equal(string.slice(1, -1));
        }
    });

    it("should emit a begin and end list tokens", () => {
        const tokens = new Scanner("()").scanTokens();

        expect(tokens[0].type).to.equal(TokenType.BeginList);
        expect(tokens[1].type).to.equal(TokenType.EndList);
    });

    it("should emit tokens for constants", () => {
        const tokens = new Scanner("true false nil").scanTokens();

        expect(tokens[0].type).to.equal(TokenType.True);
        expect(tokens[1].type).to.equal(TokenType.False);
        expect(tokens[2].type).to.equal(TokenType.Nil);
    });

    it("should emit symbols for stdlib functions", () => {
        const tokens = new Scanner("> >= < <= = != +1 -1").scanTokens();

        expect(tokens[0].type).to.equal(TokenType.Symbol);
        expect(tokens[1].type).to.equal(TokenType.Symbol);
        expect(tokens[2].type).to.equal(TokenType.Symbol);
        expect(tokens[3].type).to.equal(TokenType.Symbol);
        expect(tokens[4].type).to.equal(TokenType.Symbol);
        expect(tokens[5].type).to.equal(TokenType.Symbol);
        expect(tokens[6].type).to.equal(TokenType.Symbol);
    });

    it("should handle nested lists", () => {
        const tokens = new Scanner("(()())").scanTokens();

        expect(tokens[0].type).to.equal(TokenType.BeginList);
        expect(tokens[1].type).to.equal(TokenType.BeginList);
        expect(tokens[2].type).to.equal(TokenType.EndList);
        expect(tokens[3].type).to.equal(TokenType.BeginList);
        expect(tokens[4].type).to.equal(TokenType.EndList);
        expect(tokens[5].type).to.equal(TokenType.EndList);
    });

    it("should ignore comments", () => {
        const tokens = new Scanner("; comment\n; comment\n;;;\nmulti\nline\ncomment\n;;;").scanTokens();

        expect(tokens[0].type).to.equal(TokenType.Eof);
    });

    it("should ignore whitespace", () => {
        const tokens = new Scanner(" \n\t\r\v").scanTokens();

        expect(tokens[0].type).to.equal(TokenType.Eof);
    });

    it("should error on unexpected characters", () => {
        for (const invalid of ["@", "&", "\\"]) {
            expect(() => new Scanner(invalid).scanTokens()).to.throw();
        }
    });

    it("should error on unterminated comments", () => {
        expect(() => new Scanner(";;;").scanTokens()).to.throw();
    });

    it("should error on unterminated strings", () => {
        expect(() => new Scanner('"').scanTokens()).to.throw();
    });
});
