import type { Expr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";
import { env } from "./env";

export const lib = Object.assign(
    new Map<string, (this: Interpreter, ...args: Expr[]) => any>([["env", env]]),
    {
        name: "unbug",
    }
);
