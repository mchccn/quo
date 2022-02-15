import { Interpreter } from "../engine/main/Interpreter";
import { Parser } from "../engine/main/Parser";
import { Scanner } from "../engine/main/Scanner";
import { loadlibs } from "../engine/stdlib";

export function execute(source: string) {
    const tokens = new Scanner(source).scanTokens();

    const expr = new Parser(source, tokens).parseTokens();

    // ! Dependency resolution step

    // const deps = new Resolver(expr).resolve();

    // load deps

    // ! '*' used in development only
    return loadlibs(new Interpreter(source), "*").interpret(expr);
}
