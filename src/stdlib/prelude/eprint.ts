import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("eprint", function (...args) {
        if (args.length) console.error(...args.map(this.evaluate.bind(this)).map(this.stringify.bind(this)));

        return null;
    });
