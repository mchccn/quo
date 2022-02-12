import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("rem", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) return this.numberify(this.evaluate(args[0]));

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        const n = this.numberify(rest.reduce((acc, val) => this.numberify(acc) * this.numberify(val), 1));

        return this.numberify(first) % n;
    });
