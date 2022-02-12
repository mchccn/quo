import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("print", function (...args) {
        if (args.length) console.log(...args.map(this.evaluate.bind(this)).map(this.stringify.bind(this)));

        return null;
    });
