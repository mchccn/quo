import readline from "readline";
import { Interpreter } from "../engine/main/Interpreter";
import { Parser } from "../engine/main/Parser";
import { Scanner } from "../engine/main/Scanner";
import { Token, TokenType } from "../engine/main/Token";
import { loadlibs } from "../engine/stdlib";
import { pkg } from "../priv/package";

const i = readline.createInterface(process.stdin, process.stdout);

export async function repl() {
    process.on("beforeExit", () => console.log());

    console.log(`\
Welcome to Quo v${pkg.version}.`);

    const input = [];

    const interpreter = loadlibs(new Interpreter(""), "*");

    repl: while (true) {
        prompt: do {
            const line = await new Promise<string>((resolve) =>
                i.question(input.length ? ".   " : "> ", (line) => resolve(line))
            );

            if (!input.length && line === "exit") break repl;

            input.push(line);

            const tokens = new Scanner(input.join("\n")).scanTokens();

            {
                const stack = [] as Token[];

                for (const t of tokens) {
                    if (t.type === TokenType.BeginList) {
                        stack.push(t);
                    } else if (t.type === TokenType.EndList) {
                        stack.pop();
                    }
                }

                if (stack.length) continue prompt;
            }

            if (!input.join("\n").trim()) {
                input.length = 0;

                continue prompt;
            }

            try {
                const expr = new Parser(input.join("\n"), tokens).parseTokens();

                Object.defineProperty(interpreter, "source", { value: input.join("\n") });

                const value = interpreter.interpret(expr);

                console.log(interpreter.stringify(value));

                input.length = 0;

                break;
            } catch (e) {
                console.error(e);

                input.length = 0;
            }
        } while (true);
    }
}
