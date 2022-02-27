import { expect } from "chai";
import { ListExpr } from "../src/engine/main/Expr";
import { Parser } from "../src/engine/main/Parser";
import { Scanner } from "../src/engine/main/Scanner";

describe("Parser", () => {
    it("should error on mismatched parentheses", () => {
        for (const src of ["(", ")", "(()", "())", ")(", "()(())())", "(((()))"]) {
            expect(() => new Parser(src, new Scanner(src).scanTokens()).parseTokens()).to.throw();
        }
    });

    it("should always output a list expression", () => {
        for (const src of ["", "()", "(1 2 3)", "(1 (2 (3)))", "() ()", "(()) () ((()))"]) {
            expect(new Parser(src, new Scanner(src).scanTokens()).parseTokens()).to.be.an.instanceof(ListExpr);
        }
    });
});
