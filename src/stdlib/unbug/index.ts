import type { Expr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";
import { logenv } from "../../pub/debug";

export const lib = Object.assign(
    new Map<string, (this: Interpreter, ...args: Expr[]) => any>([
        [
            "env",
            function () {
                console.log(logenv.call(this, this.environment));
            },
        ],
    ]),
    { name: "unbug" }
);
