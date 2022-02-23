import { existsSync, readFileSync, statSync } from "fs";
import { resolve, sep } from "path";
import { Expr, SymbolExpr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";
import { Parser } from "../../engine/main/Parser";
import { Scanner } from "../../engine/main/Scanner";
import type { defstdfn as _ } from "../../engine/stdlib";
import { QuoReferenceError, QuoRuntimeError, QuoTypeError } from "../../priv/error";
import { initinterpreter } from "../../pub/execute";

const modulecache = new Map<string, [Interpreter, Expr]>();

export const lib = (defstdfn: typeof _) =>
    defstdfn("import", function (...args) {
        const [target, ...members] = args;

        if (!(target instanceof SymbolExpr))
            throw new QuoTypeError(this, target.token, `Expected symbol to use, instead got '${target.token.lexeme}'.`);

        const fullpath =
            resolve(
                this.filepath.split(sep).slice(0, -1).join(sep),
                ...target.token.lexeme.split(":").map((x) => (x.length ? x : ".."))
            ) + ".quo";

        if (!existsSync(fullpath))
            throw new QuoRuntimeError(this, target.token, `Attempted to import non-existent file '${fullpath}'.`);

        if (!statSync(fullpath).isFile())
            throw new QuoRuntimeError(this, target.token, `Attempted to import '${fullpath}' which is not a file.`);

        const source = readFileSync(fullpath, "utf8");

        const [interpreter, expr] = modulecache.get(fullpath) ?? [
            initinterpreter(fullpath, source),
            new Parser(source, new Scanner(source).scanTokens()).parseTokens(),
        ];

        if (!modulecache.has(fullpath)) interpreter.interpret(expr);

        modulecache.set(fullpath, [interpreter, expr]);

        const { exports } = interpreter;

        if (!members.length) {
            this.environment.ancestor(1).define(target.token.lexeme.split(":").at(-1)!, exports);
        } else
            for (const member of members) {
                const path = member.token.lexeme.split(".");

                if (path.length === 1) {
                    if (!exports.has(path[0]))
                        throw new QuoReferenceError(
                            this,
                            member.token,
                            `Attempted to import non-existent member '${path[0]}' from '${fullpath}'.`
                        );

                    this.environment.ancestor(1).define(member.token.lexeme, exports.get(path[0]));
                } else {
                    const name = path.at(-1)!;

                    let value: unknown = exports.get(path.shift()!);

                    if (typeof value === "undefined")
                        throw new QuoReferenceError(
                            this,
                            expr.token,
                            `Cannot reference '${path[0]}' as it is not defined.`
                        );

                    while (path.length) {
                        if (value instanceof Map) {
                            if (!value.has(path[0]))
                                throw new QuoReferenceError(
                                    this,
                                    expr.token,
                                    `No member named '${path[0]}' in namespace.`
                                );

                            value = value.get(path.shift()!)!;
                        }

                        if (path.length > 1)
                            throw new QuoTypeError(
                                this,
                                expr.token,
                                `Cannot reference '${path[0]}' as it is not a namespace.`
                            );
                    }

                    this.environment.ancestor(1).define(name, value);
                }
            }

        return null;
    });
