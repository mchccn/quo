import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("+", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) return this.numberify(this.evaluate(args[0]));

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        return rest.reduce((acc, val) => {
            if (Array.isArray(acc)) return acc.concat(val);

            if (Array.isArray(val)) return Array().concat(acc).concat(val);

            if (typeof acc === "number") return acc + this.numberify(val);

            if (typeof val === "number") return this.numberify(acc) + val;

            if (typeof acc === "string") return acc + this.stringify(val);

            if (typeof val === "string") return this.stringify(acc) + val;

            return this.numberify(acc) + this.numberify(val);
        }, first);
    });
