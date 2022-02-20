import { Interpreter } from "../engine/main/Interpreter";
import { Parser } from "../engine/main/Parser";
import { Scanner } from "../engine/main/Scanner";
import { loadlibs } from "../engine/stdlib";

export function execute(path: string, source: string) {
    const tokens = new Scanner(source).scanTokens();

    const expr = new Parser(source, tokens).parseTokens();

    // ! '*' used in development only
    return loadlibs(
        new Interpreter(path, path.split("/").at(-1)!.split(".").slice(0, -1).join("."), source),
        "*"
    ).interpret(expr);
}
