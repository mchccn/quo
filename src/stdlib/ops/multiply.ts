import type { defstdfn as _ } from "../../engine/stdlib";

export const lib = (defstdfn: typeof _) =>
    defstdfn("*", function (...args) {
        if (args.length === 0) return null;

        if (args.length === 1) return this.numberify(this.evaluate(args[0]));

        const [first, ...rest] = args.map(this.evaluate.bind(this));

        return rest.reduce((acc, val) => {
            if (Array.isArray(acc))
                return Array(this.numberify(val))
                    .fill(0)
                    .map(() => this.deepclone(acc));

            if (Array.isArray(val))
                return Array(this.numberify(acc))
                    .fill(0)
                    .map(() => this.deepclone(val));

            if (typeof acc === "number") return acc * this.numberify(val);

            if (typeof val === "number") return this.numberify(acc) * val;

            if (typeof acc === "string") return acc.repeat(this.numberify(val));

            if (typeof val === "string") return val.repeat(this.numberify(acc));

            return this.numberify(acc) * this.numberify(val);
        }, first);
    });
