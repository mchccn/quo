import { existsSync, readFileSync, statSync } from "fs";
import { resolve, sep } from "path";
import { Expr, SymbolExpr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";
import { Parser } from "../../engine/main/Parser";
import { Scanner } from "../../engine/main/Scanner";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoRuntimeError, QuoTypeError } from "../../priv/error";
import { initinterpreter } from "../../pub/execute";

const modulecache = new Map<string, [Interpreter, Expr]>();

export const lib = (defstdfn: typeof _) =>
    defstdfn("import", function (...args) {
        for (const a of args) {
            if (!(a instanceof SymbolExpr))
                throw new QuoTypeError(this, a.token, `Expected symbol to use, instead got '${a.token.lexeme}'.`);

            console.warn(`IMPORTS NOT SUPPORTED YET LOL`);

            const fullpath =
                resolve(
                    this.filepath.split(sep).slice(0, -1).join(sep),
                    ...a.token.lexeme.split(":").map((x) => (x.length ? x : ".."))
                ) + ".quo";

            if (!existsSync(fullpath))
                throw new QuoRuntimeError(this, a.token, `Attempted to import non-existent file '${fullpath}'.`);

            if (!statSync(fullpath).isFile())
                throw new QuoRuntimeError(this, a.token, `Attempted to import '${fullpath}' which is not a file.`);

            const source = readFileSync(fullpath, "utf8");

            const [interpreter, expr] = modulecache.get(fullpath) ?? [
                initinterpreter(fullpath, source),
                new Parser(source, new Scanner(source).scanTokens()).parseTokens(),
            ];

            if (!modulecache.has(fullpath)) interpreter.interpret(expr);

            modulecache.set(fullpath, [interpreter, expr]);

            const exports = interpreter.exports;

            //!get the imported symbol
        }

        return null;
    });
