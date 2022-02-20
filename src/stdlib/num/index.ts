import type { Expr } from "../../engine/main/Expr";
import { nativebind } from "../../engine/bindings";
import { QuoTypeError } from "../../priv/error";

export const lib = Object.assign(
    new Map([
        //
        ...nativebind(
            Number,
            ["toExponential", "toFixed", "toPrecision", "toString"],
            function (target: unknown, expr: Expr) {
                if (typeof target !== "number") throw new QuoTypeError(this, expr.token, `Target must be a number.`);
            }
        ).entries(),
    ]),
    { name: "num" }
);
