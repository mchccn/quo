import { Interpreter } from "../engine/Interpreter";
import { Parser } from "../engine/Parser";
import { Scanner } from "../engine/Scanner";
import { loadstdlib } from "../engine/stdlib";

export function execute(source: string) {
    const tokens = new Scanner(source).scanTokens();

    const expr = new Parser(source, tokens).parseTokens();

    return loadstdlib(new Interpreter(source), ["ops", "prelude"]).interpret(expr);
}
