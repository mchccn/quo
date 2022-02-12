import { Interpreter } from "../engine/Interpreter";
import { Parser } from "../engine/Parser";
import { Scanner } from "../engine/Scanner";
import { loadstdlib } from "../engine/stdlib";

export function execute(source: string) {
    const tokens = new Scanner(source).scanTokens();

    const expr = new Parser(tokens).parseTokens();

    return loadstdlib(new Interpreter(), ["ops", "prelude"]).interpret(expr);
}
