import type { Expr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";
import { foreach } from "./foreach";

export const lib = Object.assign(new Map<string, (this: Interpreter, ...args: Expr[]) => any>([["foreach", foreach]]), {
    name: "iter",
});
