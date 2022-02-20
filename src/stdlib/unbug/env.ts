import type { Interpreter } from "../../engine/main/Interpreter";
import { logenv } from "../../pub/debug";

export const lib = false;

export function env(this: Interpreter) {
    console.log(logenv.call(this, this.environment));
}
