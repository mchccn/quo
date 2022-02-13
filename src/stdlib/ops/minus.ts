import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("-", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) return -this.numberify(this.evaluate(args[0]));

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        return rest.reduce((acc, val) => {
            return this.numberify(acc) - this.numberify(val);
        }, first);
    });
