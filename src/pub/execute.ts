import { sep } from "path";
import { Interpreter } from "../engine/main/Interpreter";
import { Parser } from "../engine/main/Parser";
import { Scanner } from "../engine/main/Scanner";
import { loadlibs } from "../engine/stdlib";

export function initinterpreter(path: string, source: string) {
    // ! '*' used in development only
    return loadlibs(new Interpreter(path, path.split(sep).at(-1)!.split(".").slice(0, -1).join("."), source), "*");
}

export function execute(path: string, source: string) {
    const tokens = new Scanner(source).scanTokens();

    const expr = new Parser(source, tokens).parseTokens();

    return initinterpreter(path, source).interpret(expr);
}
