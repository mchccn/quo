import { nativebind } from "../../engine/bindings";
import type { Expr } from "../../engine/main/Expr";
import type { Interpreter } from "../../engine/main/Interpreter";
import { QuoTypeError } from "../../priv/error";
import { bindpredicatebased } from "./bind";
import { first } from "./first";
import { last } from "./last";
import { length } from "./length";

export const lib = Object.assign(
    new Map<string, (this: Interpreter, ...args: Expr[]) => any>([
        bindpredicatebased("forEach"),
        bindpredicatebased("map"),
        bindpredicatebased("flatMap"),
        bindpredicatebased("filter"),
        bindpredicatebased("find"),
        bindpredicatebased("findIndex"),
        bindpredicatebased("every"),
        bindpredicatebased("some"),
        ...nativebind(
            Array,
            ["at", "copyWithin", "flat", "fill", "includes", "splice", "sort", "slice", "toString"],
            function (target, expr) {
                if (!expr) throw new QuoTypeError(this, this.callstack[0].token, `Expected a list.`);

                if (!Array.isArray(target)) throw new QuoTypeError(this, expr.token, `Target must be a list.`);
            }
        ),
        ["length", length],
        ["first", first],
        ["last", last],
        ["head", first],
        ["tail", last],
    ]),
    {
        name: "iter",
    }
);
